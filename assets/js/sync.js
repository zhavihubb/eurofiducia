/* EUROFIDUCIA — Cross-Device Persistence & Sync Layer
   ===================================================
   This module makes EV.store survive redeploy AND work across devices.

   How it works:
   1. localStorage stays the fast local cache (instant reads, offline use).
   2. Every EV.store.set() ALSO pushes the value to the backend server.
   3. On page load, EV.sync.hydrate() pulls the entire server DB and merges it
      into localStorage — so a user logging in on a NEW DEVICE gets all their
      data back automatically.
   4. A periodic background flush re-syncs local changes (covers offline edits).

   The backend is server/server.js (zero-dependency Node). If it is unreachable,
   the app keeps working on localStorage alone (graceful degradation).

   CONFIGURATION
   - Set EV.sync.serverURL to your deployed backend URL (see SETUP_PERSISTENCE.md).
   - If left empty, sync is skipped and the app behaves exactly as before
     (localStorage only) — handy for local dev without the backend.
*/
(function () {
  if (typeof EV === 'undefined') EV = {};

  EV.sync = {
    // ---- CONFIG: set this to your backend URL (or leave '' for local-only) ----
    // e.g. 'https://eurofiducia-backend.onrender.com'
    // Auto-detect: use the same origin as the page (works on Railway where server + static are same host)
    serverURL: (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '',

    // how often to flush local changes to the server (ms)
    flushInterval: 30000,
    _flushTimer: null,
    _dirty: false,
    _hydrated: false,

    _api: function (path, opts) {
      if (!this.serverURL) return Promise.resolve({ __skipped: true });
      return fetch(this.serverURL + path, opts).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch(function (e) {
        // Silent fail — app still works on localStorage
        return { __error: e.message };
      });
    },

    // Pull entire server DB and hydrate localStorage (called once on load)
    hydrate: function () {
      var self = this;
      if (this._hydrated || !this.serverURL) return Promise.resolve();
      return this._api('/api/pull').then(function (data) {
        if (!data || data.__error || data.__skipped) return;
        for (var key in data) {
          if (key === '__meta') continue;
          var serverVal = data[key];
          var localRaw = null;
          try { localRaw = localStorage.getItem('ev_' + key); } catch (e) {}
          // Only write to localStorage if the server has data the local browser doesn't,
          // OR the server data is newer (arrays merged by id below).
          if (localRaw === null) {
            try { localStorage.setItem('ev_' + key, JSON.stringify(serverVal)); } catch (e) {}
          } else if (Array.isArray(serverVal)) {
            // Merge arrays by id (union, server wins on conflict)
            try {
              var localArr = JSON.parse(localRaw);
              if (Array.isArray(localArr)) {
                var seen = {};
                localArr.forEach(function (x) { if (x && x.id) seen[String(x.id)] = x; });
                serverVal.forEach(function (x) {
                  if (x && x.id) {
                    if (seen[String(x.id)]) Object.assign(seen[String(x.id)], x);
                    else { localArr.push(x); seen[String(x.id)] = x; }
                  }
                });
                try { localStorage.setItem('ev_' + key, JSON.stringify(localArr)); } catch (e) {}
              }
            } catch (e) {}
          } else {
            // Non-array: prefer server value if local is stale/empty-ish
            try {
              var localVal = JSON.parse(localRaw);
              if (localVal === null || localVal === '' || (typeof localVal === 'object' && Object.keys(localVal).length === 0)) {
                localStorage.setItem('ev_' + key, JSON.stringify(serverVal));
              }
            } catch (e) {
              try { localStorage.setItem('ev_' + key, JSON.stringify(serverVal)); } catch (e2) {}
            }
          }
        }
        self._hydrated = true;
        // Re-run any page loaders that depend on synced data
        if (typeof window.onSyncHydrate === 'function') {
          try { window.onSyncHydrate(); } catch (e) {}
        }
      });
    },

    // Push a single key to the server
    pushKey: function (key, value) {
      return this._api('/api/key/' + encodeURIComponent(key), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: value })
      });
    },

    // Bulk push everything in localStorage (used by the flush timer)
    flushAll: function () {
      if (!this.serverURL) return Promise.resolve();
      var dump = {};
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var fullKey = localStorage.key(i);
          if (fullKey && fullKey.indexOf('ev_') === 0) {
            var key = fullKey.substring(3);
            try { dump[key] = JSON.parse(localStorage.getItem(fullKey)); } catch (e) {}
          }
        }
      } catch (e) {}
      return this._api('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dump: dump })
      });
    },

    // Start the periodic background flush
    startAutoSync: function () {
      var self = this;
      if (this._flushTimer || !this.serverURL) return;
      this._flushTimer = setInterval(function () { self.flushAll(); }, this.flushInterval);
      // Also flush on tab hide / page unload
      window.addEventListener('beforeunload', function () { self.flushAll(); });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') self.flushAll();
      });
    },

    // Mark that local data changed and a flush is needed
    markDirty: function () { this._dirty = true; },

    /**
     * Re-pull a SINGLE key from the server, bypassing the _hydrated guard.
     * This is used for polling (e.g. checking if the user's account status
     * changed after admin approval). Merges array data by id.
     * Returns a Promise that resolves to the server value (or null).
     */
    pullKey: function (key) {
      if (!this.serverURL) return Promise.resolve(null);
      return this._api('/api/key/' + encodeURIComponent(key)).then(function (resp) {
        if (!resp || resp.__error || resp.__skipped) return null;
        var serverVal = resp.value;
        if (serverVal === null || serverVal === undefined) return null;
        // Merge into localStorage (same logic as hydrate, but for one key)
        var localRaw = null;
        try { localRaw = localStorage.getItem('ev_' + key); } catch (e) {}
        if (localRaw === null) {
          try { localStorage.setItem('ev_' + key, JSON.stringify(serverVal)); } catch (e) {}
        } else if (Array.isArray(serverVal)) {
          try {
            var localArr = JSON.parse(localRaw);
            if (Array.isArray(localArr)) {
              var seen = {};
              localArr.forEach(function (x) { if (x && x.id) seen[String(x.id)] = x; });
              serverVal.forEach(function (x) {
                if (x && x.id) {
                  if (seen[String(x.id)]) Object.assign(seen[String(x.id)], x);
                  else { localArr.push(x); seen[String(x.id)] = x; }
                }
              });
              try { localStorage.setItem('ev_' + key, JSON.stringify(localArr)); } catch (e) {}
            }
          } catch (e) {}
        } else {
          try {
            var localVal = JSON.parse(localRaw);
            if (localVal === null || localVal === '' || (typeof localVal === 'object' && Object.keys(localVal).length === 0)) {
              localStorage.setItem('ev_' + key, JSON.stringify(serverVal));
            } else {
              // For non-array non-empty values, prefer the SERVER value if it's newer/different
              // This ensures status updates (like accountStatus: 'active') propagate
              localStorage.setItem('ev_' + key, JSON.stringify(serverVal));
            }
          } catch (e) {
            try { localStorage.setItem('ev_' + key, JSON.stringify(serverVal)); } catch (e2) {}
          }
        }
        return serverVal;
      });
    },

    /**
     * Poll the server for the current user's account status.
     * If the status changed (e.g. pending → active), update localStorage
     * and call the onUserStatusChange callback (if defined).
     * Returns a Promise.
     */
    pollUserStatus: function (userId, knownStatus) {
      var self = this;
      if (!this.serverURL || !userId) return Promise.resolve(null);
      return this.pullKey('users').then(function (users) {
        if (!users || !Array.isArray(users)) return null;
        var user = null;
        for (var i = 0; i < users.length; i++) {
          if (users[i] && users[i].id === userId) { user = users[i]; break; }
        }
        if (!user) return null;
        var newStatus = user.accountStatus || 'pending';
        if (newStatus !== knownStatus) {
          // Status changed! Update localStorage users array
          try {
            var localUsers = JSON.parse(localStorage.getItem('ev_users') || '[]');
            var found = false;
            for (var j = 0; j < localUsers.length; j++) {
              if (localUsers[j] && localUsers[j].id === userId) {
                // Merge server fields into local user (server wins for status fields)
                Object.assign(localUsers[j], user);
                found = true;
                break;
              }
            }
            if (!found) { localUsers.push(user); }
            localStorage.setItem('ev_users', JSON.stringify(localUsers));
          } catch (e) {}
          // Fire callback
          if (typeof window.onUserStatusChange === 'function') {
            try { window.onUserStatusChange(knownStatus, newStatus, user); } catch (e) {}
          }
        }
        return { status: newStatus, user: user, changed: newStatus !== knownStatus };
      });
    },

    /**
     * Start polling the server for the current user's status every N seconds.
     * Used by the user dashboard so that when an admin approves the account
     * (on a different device), the user's dashboard auto-updates.
     */
    startStatusPolling: function (userId, intervalMs) {
      var self = this;
      if (this._statusPollTimer) clearInterval(this._statusPollTimer);
      if (!this.serverURL || !userId) return;
      intervalMs = intervalMs || 10000; // default 10 seconds
      this._statusPollTimer = setInterval(function () {
        var sess = null;
        try { sess = JSON.parse(localStorage.getItem('ev_session') || 'null'); } catch (e) {}
        if (!sess || sess.userId !== userId) {
          clearInterval(self._statusPollTimer);
          return;
        }
        // Get current known status from localStorage
        var knownStatus = 'pending';
        try {
          var localUsers = JSON.parse(localStorage.getItem('ev_users') || '[]');
          for (var i = 0; i < localUsers.length; i++) {
            if (localUsers[i] && localUsers[i].id === userId) {
              knownStatus = localUsers[i].accountStatus || 'pending';
              break;
            }
          }
        } catch (e) {}
        self.pollUserStatus(userId, knownStatus);
      }, intervalMs);
    },

    // Convenience: configure + bootstrap in one call
    init: function (serverURL) {
      if (serverURL) this.serverURL = serverURL;
      var self = this;
      return this.hydrate().then(function () { self.startAutoSync(); });
    }
  };

  // ---- Patch EV.store so every set() also pushes to the server ----
  if (EV.store && EV.store.set) {
    var _origSet = EV.store.set.bind(EV.store);
    var _origPush = EV.store.push.bind(EV.store);
    EV.store.set = function (key, val) {
      _origSet(key, val);
      EV.sync.pushKey(key, val);
    };
    EV.store.push = function (key, item) {
      var arr = _origPush(key, item);
      EV.sync.pushKey(key, arr);
      return arr;
    };
  }
})();
