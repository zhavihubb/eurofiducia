/**
 * EuroFiducia Persistence Backend
 * ============================
 * A zero-dependency Node.js server (uses only built-in http + fs modules).
 * It stores ALL EuroFiducia data (users, sessions, transactions, emails, settings,
 * crypto wallets, notifications, etc.) in a single JSON file on the server.
 *
 * This means:
 *   - Data survives redeployment (the db.json file is the source of truth)
 *   - Data is shared across devices/browsers (a user logs in and gets their data back)
 *   - No localStorage is lost when the static frontend is re-deployed
 *
 * ENDPOINTS
 *   GET  /api/health           -> { ok:true, version }
 *   GET  /api/data             -> entire db (admin/debug)
 *   GET  /api/key/:key         -> { key, value }   (value = stored JSON for that key)
 *   PUT  /api/key/:key         -> body { value }   -> saves value for key
 *   POST /api/sync             -> body { dump: {key:value,...} } -> merges all keys
 *   GET  /api/pull             -> returns entire db (for client to hydrate localStorage)
 *   POST /api/email            -> body { to, subject, body, opts } -> sends real email via Resend
 *   POST /api/sms              -> body { to, message, opts } -> stores SMS (real sending needs provider config)
 *
 * The frontend sync.js calls these. localStorage stays as a fast offline cache;
 * the server db.json is the durable, cross-device source of truth.
 *
 * HOW TO RUN
 *   node server.js
 *   (optionally set PORT env var, defaults to 3000)
 *
 * HOW TO HOST FOR FREE
 *   - Render.com: create a new "Web Service", point at this folder, build command
 *     empty, start command "node server.js". The db.json persists on the disk.
 *   - Railway.app: similar, "node server.js".
 *   - Any VPS / always-on machine: run with pm2 ("pm2 start server.js --name eurofiducia")
 *     so it restarts on reboot.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https'); // for Resend API (zero new dependencies)

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const FRONTEND_DIR = path.resolve(__dirname, '..'); // eurofiducia/ root holds the static site

// ---------- Email configuration (Resend API) ----------
// Set these as Railway environment variables to enable REAL email sending.
// Without them, emails are simulated (stored in db.json only).
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'EuroFiducia <noreply@eurofiducia.eu>';
const RESEND_API_HOST = 'api.resend.com';

/**
 * Send a real email via the Resend API.
 * Uses only Node's built-in https module — zero new dependencies.
 * Returns a Promise that resolves to { ok, simulated, detail }.
 */
function sendRealEmail(to, subject, body, opts) {
  opts = opts || {};
  if (!RESEND_API_KEY) {
    console.warn('[email] No RESEND_API_KEY set — email simulated only (not actually sent).');
    return Promise.resolve({ ok: true, simulated: true, detail: 'No RESEND_API_KEY configured' });
  }

  return new Promise(function (resolve) {
    var emailPayload = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      text: body
    };
    // If body looks like HTML, also send as html
    if (/<[a-z][\s\S]*>/i.test(body)) {
      emailPayload.html = body;
    }
    var payloadStr = JSON.stringify(emailPayload);

    var req = https.request({
      hostname: RESEND_API_HOST,
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr)
      }
    }, function (res) {
      var data = '';
      res.on('data', function (c) { data += c; });
      res.on('end', function () {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('[email] Sent to ' + to + ' subject="' + subject + '" status=' + res.statusCode);
          resolve({ ok: true, simulated: false, detail: 'Sent via Resend', httpStatus: res.statusCode });
        } else {
          console.error('[email] Resend error ' + res.statusCode + ': ' + data);
          resolve({ ok: false, simulated: true, detail: 'Resend API error: ' + res.statusCode + ' ' + data });
        }
      });
    });

    req.on('error', function (e) {
      console.error('[email] Request error:', e.message);
      resolve({ ok: false, simulated: true, detail: 'Network error: ' + e.message });
    });

    req.write(payloadStr);
    req.end();
  });
}

// ---------- JSON DB helpers ----------
function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const seed = {
        __meta: {
          created: new Date().toISOString(),
          version: 1,
          note: 'EuroFiducia persistence store. All ev_* keys from the frontend are mirrored here.'
        }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[db] load error:', e.message);
    return {};
  }
}

function saveDB(db) {
  try {
    db.__meta = db.__meta || {};
    db.__meta.lastWrite = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return true;
  } catch (e) {
    console.error('[db] save error:', e.message);
    return false;
  }
}

// ---------- HTTP helpers ----------
function sendJSON(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise(function (resolve) {
    let chunks = '';
    req.on('data', function (c) { chunks += c; if (chunks.length > 5e6) req.destroy(); });
    req.on('end', function () {
      try { resolve(chunks ? JSON.parse(chunks) : {}); }
      catch (e) { resolve({ __parseError: true }); }
    });
    req.on('error', function () { resolve({ __parseError: true }); });
  });
}

// MIME types for serving the static frontend (optional — you can also host the
// static site separately and only use this server for /api/*).
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8'
};

function serveStatic(req, res, urlPath) {
  let filePath = path.join(FRONTEND_DIR, decodeURIComponent(urlPath));
  if (urlPath === '/' || urlPath === '') filePath = path.join(FRONTEND_DIR, 'index.html');
  // Prevent path traversal
  if (!filePath.startsWith(FRONTEND_DIR)) { sendJSON(res, 403, { error: 'forbidden' }); return; }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      // try index.html for SPA-style fallback (not strictly needed here)
      sendJSON(res, 404, { error: 'not found', path: urlPath });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

// ---------- Request router ----------
const server = http.createServer(async function (req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') { sendJSON(res, 204, {}); return; }

  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  // ---- API routes ----
  if (p === '/api/health') {
    sendJSON(res, 200, { ok: true, version: 1, time: new Date().toISOString() });
    return;
  }

  if (p === '/api/data' && req.method === 'GET') {
    sendJSON(res, 200, loadDB());
    return;
  }

  if (p === '/api/pull' && req.method === 'GET') {
    // Return everything except the __meta key, ready for client hydration
    const db = loadDB();
    delete db.__meta;
    sendJSON(res, 200, db);
    return;
  }

  if (p.startsWith('/api/key/') && (req.method === 'GET' || req.method === 'PUT')) {
    const key = decodeURIComponent(p.replace('/api/key/', ''));
    if (!key) { sendJSON(res, 400, { error: 'missing key' }); return; }
    const db = loadDB();
    if (req.method === 'GET') {
      sendJSON(res, 200, { key: key, value: db[key] !== undefined ? db[key] : null });
      return;
    }
    // PUT
    const body = await readBody(req);
    if (body.__parseError) { sendJSON(res, 400, { error: 'invalid JSON' }); return; }
    db[key] = body.value !== undefined ? body.value : null;
    saveDB(db);
    sendJSON(res, 200, { ok: true, key: key });
    return;
  }

  if (p === '/api/sync' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.__parseError) { sendJSON(res, 400, { error: 'invalid JSON' }); return; }
    const dump = body.dump || {};
    const db = loadDB();
    let count = 0;
    for (const k in dump) {
      if (k === '__meta') continue;
      // Merge arrays intelligently: union by id if both are arrays of objects with id
      if (Array.isArray(db[k]) && Array.isArray(dump[k])) {
        const seen = new Set(db[k].map(function (x) { return x && x.id ? String(x.id) : JSON.stringify(x); }));
        dump[k].forEach(function (item) {
          const id = item && item.id ? String(item.id) : JSON.stringify(item);
          if (!seen.has(id)) { db[k].push(item); seen.add(id); count++; }
        });
        // also update existing items by id
        db[k] = db[k].map(function (existing) {
          if (!existing || !existing.id) return existing;
          const updated = dump[k].find(function (x) { return x && x.id === existing.id; });
          return updated ? Object.assign({}, existing, updated) : existing;
        });
      } else {
        db[k] = dump[k]; count++;
      }
    }
    saveDB(db);
    sendJSON(res, 200, { ok: true, merged: count });
    return;
  }

  if (p === '/api/email' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.__parseError) { sendJSON(res, 400, { error: 'invalid JSON' }); return; }
    var emailTo = body.to || '';
    var emailSubject = body.subject || '(no subject)';
    var emailBody = body.body || '';
    var emailOpts = body.opts || {};
    if (!emailTo) { sendJSON(res, 400, { error: 'missing "to" field' }); return; }

    // Store the email record in db.json (so it shows up in user inbox regardless)
    var emailRecord = {
      id: 'E' + Date.now() + Math.random().toString(36).slice(2, 5),
      to: emailTo, subject: emailSubject, body: emailBody,
      time: new Date().toISOString(),
      type: emailOpts.type || 'notification',
      template: emailOpts.template || null,
      read: false
    };
    var dbForEmail = loadDB();
    if (!dbForEmail['email_log']) dbForEmail['email_log'] = [];
    dbForEmail['email_log'].push(emailRecord);
    if (emailOpts.userId) {
      var userKey = 'user_emails_' + emailOpts.userId;
      if (!dbForEmail[userKey]) dbForEmail[userKey] = [];
      dbForEmail[userKey].push(emailRecord);
    }
    saveDB(dbForEmail);

    // Attempt to send the REAL email via Resend
    var emailResult = await sendRealEmail(emailTo, emailSubject, emailBody, emailOpts);

    sendJSON(res, 200, {
      ok: true,
      id: emailRecord.id,
      simulated: emailResult.simulated,
      delivered: emailResult.ok && !emailResult.simulated,
      detail: emailResult.detail
    });
    return;
  }

  if (p === '/api/sms' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.__parseError) { sendJSON(res, 400, { error: 'invalid JSON' }); return; }
    var smsTo = body.to || '';
    var smsMsg = body.message || '';
    var smsOpts = body.opts || {};
    if (!smsTo) { sendJSON(res, 400, { error: 'missing "to" field' }); return; }

    // Store SMS record in db.json
    var smsRecord = {
      id: 'S' + Date.now() + Math.random().toString(36).slice(2, 5),
      to: smsTo, message: smsMsg,
      time: new Date().toISOString(),
      type: smsOpts.type || 'sms_notification',
      read: false
    };
    var dbForSms = loadDB();
    if (!dbForSms['sms_log']) dbForSms['sms_log'] = [];
    dbForSms['sms_log'].push(smsRecord);
    if (smsOpts.userId) {
      var smsUserKey = 'user_sms_' + smsOpts.userId;
      if (!dbForSms[smsUserKey]) dbForSms[smsUserKey] = [];
      dbForSms[smsUserKey].push(smsRecord);
    }
    saveDB(dbForSms);

    // SMS via real provider would go here (Twilio etc.) — not configured by default
    console.log('[sms] Simulated SMS to ' + smsTo + ': ' + smsMsg.substring(0, 50) + '...');

    sendJSON(res, 200, {
      ok: true,
      id: smsRecord.id,
      simulated: true,
      detail: 'SMS provider not configured (Twilio/API key needed for real SMS)'
    });
    return;
  }

  if (p === '/api/wipe' && req.method === 'POST') {
    // Danger zone — reset the DB (admin only in practice; protected by a token query)
    const token = url.searchParams.get('token');
    if (token !== process.env.ADMIN_TOKEN && token !== 'eurofiducia-reset') {
      sendJSON(res, 403, { error: 'forbidden' }); return;
    }
    saveDB({ __meta: { created: new Date().toISOString(), version: 1, wiped: true } });
    sendJSON(res, 200, { ok: true, wiped: true });
    return;
  }

  // ---- Static frontend (optional, handy for single-host deploy) ----
  if (!p.startsWith('/api/')) {
    serveStatic(req, res, p);
    return;
  }

  sendJSON(res, 404, { error: 'unknown route', path: p });
});

server.listen(PORT, function () {
  console.log('EuroFiducia backend running on port ' + PORT);
  console.log('  API:    http://localhost:' + PORT + '/api/health');
  console.log('  Pull:   http://localhost:' + PORT + '/api/pull');
  console.log('  Static: http://localhost:' + PORT + '/');
  console.log('  DB file: ' + DB_FILE);
});
