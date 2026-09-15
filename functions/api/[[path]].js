/**
 * EuroFiducia — Cloudflare Pages Functions backend (free tier)
 * ============================================================
 * Drop-in port of server/server.js for Cloudflare Pages.
 * - Storage: Cloudflare KV (bound as EV_DB) — free tier: 100k reads/day, 1k writes/day
 * - Email:   Resend API via fetch (set RESEND_API_KEY + EMAIL_FROM secrets in dashboard)
 * - Endpoints (identical to the Node version):
 *     GET  /api/health
 *     GET  /api/data
 *     GET  /api/pull
 *     GET/PUT /api/key/:key
 *     POST /api/sync      { dump: {...} }
 *     POST /api/email     { to, subject, body, opts }
 *     POST /api/sms       { to, message, opts }
 *     POST /api/wipe?token=...
 *
 * KV layout: single JSON blob under key "db" (mirrors the original db.json),
 * stored without __meta in a separate "__meta" key for housekeeping.
 * Change detection: /api/sync only WRITES when incoming data differs from
 * stored data — so the frontend's 30-second auto-flush costs reads (free:
 * 100k/day) instead of writes (1k/day) when nothing changed.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const p = url.pathname;
  const method = request.method;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const json = (code, obj) =>
    new Response(JSON.stringify(obj), {
      status: code,
      headers: { 'Content-Type': 'application/json', ...cors }
    });

  const kv = env.EV_DB;
  if (!kv) {
    return json(503, { error: 'KV namespace EV_DB not bound' });
  }

  const DB_KEY = 'db';
  const META_KEY = '__meta';

  async function loadDB() {
    try {
      const raw = await kv.get(DB_KEY);
      if (raw === null) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  async function saveDB(db) {
    db.__meta = db.__meta || {};
    db.__meta.lastWrite = new Date().toISOString();
    // Store meta separately so /api/pull can simply strip it
    const meta = db.__meta;
    delete db.__meta;
    await kv.put(DB_KEY, JSON.stringify(db));
    await kv.put(META_KEY, JSON.stringify(meta));
    return true;
  }

  async function readBody() {
    try {
      const text = await request.text();
      if (!text) return {};
      return JSON.parse(text);
    } catch (e) {
      return { __parseError: true };
    }
  }

  // ---------- GET routes ----------
  if (p === '/api/health') {
    return json(200, { ok: true, version: 1, time: new Date().toISOString(), runtime: 'cloudflare-pages' });
  }

  if (p === '/api/data' && method === 'GET') {
    const db = await loadDB();
    const meta = await kv.get(META_KEY);
    if (meta) db.__meta = JSON.parse(meta);
    return json(200, db);
  }

  if (p === '/api/pull' && method === 'GET') {
    const db = await loadDB();
    return json(200, db);
  }

  // ---------- /api/key/:key ----------
  const keyMatch = p.match(/^\/api\/key\/(.+)$/);
  if (keyMatch && (method === 'GET' || method === 'PUT')) {
    const key = decodeURIComponent(keyMatch[1]);
    if (!key) return json(400, { error: 'missing key' });
    const db = await loadDB();
    if (method === 'GET') {
      return json(200, { key: key, value: db[key] !== undefined ? db[key] : null });
    }
    // PUT
    const body = await readBody();
    if (body.__parseError) return json(400, { error: 'invalid JSON' });
    db[key] = body.value !== undefined ? body.value : null;
    await saveDB(db);
    return json(200, { ok: true, key: key });
  }

  // ---------- POST /api/sync ----------
  if (p === '/api/sync' && method === 'POST') {
    const body = await readBody();
    if (body.__parseError) return json(400, { error: 'invalid JSON' });
    const dump = body.dump || {};
    const db = await loadDB();
    let count = 0;
    for (const k in dump) {
      if (k === '__meta') continue;
      // Merge arrays intelligently: union + update by id (same as Node server)
      if (Array.isArray(db[k]) && Array.isArray(dump[k])) {
        const seen = new Set(db[k].map((x) => (x && x.id ? String(x.id) : JSON.stringify(x))));
        dump[k].forEach((item) => {
          const id = item && item.id ? String(item.id) : JSON.stringify(item);
          if (!seen.has(id)) { db[k].push(item); seen.add(id); count++; }
        });
        db[k] = db[k].map((existing) => {
          if (!existing || !existing.id) return existing;
          const updated = dump[k].find((x) => x && x.id === existing.id);
          return updated ? Object.assign({}, existing, updated) : existing;
        });
      } else {
        // Change detection: skip write-count inflation by only counting real changes
        if (JSON.stringify(db[k]) !== JSON.stringify(dump[k])) { db[k] = dump[k]; count++; }
      }
    }
    if (count > 0) {
      await saveDB(db); // one KV write per flush that actually changed something
      return json(200, { ok: true, merged: count });
    }
    // Nothing changed — NO write performed (protects the 1k writes/day free limit)
    return json(200, { ok: true, merged: 0, noop: true });
  }

  // ---------- POST /api/email ----------
  if (p === '/api/email' && method === 'POST') {
    const body = await readBody();
    if (body.__parseError) return json(400, { error: 'invalid JSON' });
    const emailTo = body.to || '';
    const emailSubject = body.subject || '(no subject)';
    const emailBody = body.body || '';
    const emailOpts = body.opts || {};
    if (!emailTo) return json(400, { error: 'missing "to" field' });

    const emailRecord = {
      id: 'E' + Date.now() + Math.random().toString(36).slice(2, 5),
      to: emailTo, subject: emailSubject, body: emailBody,
      time: new Date().toISOString(),
      type: emailOpts.type || 'notification',
      template: emailOpts.template || null,
      read: false
    };
    const db = await loadDB();
    if (!db['email_log']) db['email_log'] = [];
    db['email_log'].push(emailRecord);
    if (emailOpts.userId) {
      const userKey = 'user_emails_' + emailOpts.userId;
      if (!db[userKey]) db[userKey] = [];
      db[userKey].push(emailRecord);
    }
    await saveDB(db);

    // Attempt REAL delivery via Resend
    const result = await sendRealEmail(env, emailTo, emailSubject, emailBody, emailOpts);
    return json(200, {
      ok: true,
      id: emailRecord.id,
      simulated: result.simulated,
      delivered: result.ok && !result.simulated,
      detail: result.detail
    });
  }

  // ---------- POST /api/sms ----------
  if (p === '/api/sms' && method === 'POST') {
    const body = await readBody();
    if (body.__parseError) return json(400, { error: 'invalid JSON' });
    const smsTo = body.to || '';
    const smsMsg = body.message || '';
    const smsOpts = body.opts || {};
    if (!smsTo) return json(400, { error: 'missing "to" field' });

    const smsRecord = {
      id: 'S' + Date.now() + Math.random().toString(36).slice(2, 5),
      to: smsTo, message: smsMsg,
      time: new Date().toISOString(),
      type: smsOpts.type || 'sms_notification',
      read: false
    };
    const db = await loadDB();
    if (!db['sms_log']) db['sms_log'] = [];
    db['sms_log'].push(smsRecord);
    if (smsOpts.userId) {
      const smsUserKey = 'user_sms_' + smsOpts.userId;
      if (!db[smsUserKey]) db[smsUserKey] = [];
      db[smsUserKey].push(smsRecord);
    }
    await saveDB(db);
    // Real SMS needs a provider (Twilio etc.) — not configured
    return json(200, { ok: true, id: smsRecord.id, simulated: true, detail: 'SMS provider not configured' });
  }

  // ---------- POST /api/wipe ----------
  if (p === '/api/wipe' && method === 'POST') {
    const token = url.searchParams.get('token');
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
      return json(403, { error: 'forbidden' });
    }
    await kv.put(DB_KEY, '{}');
    await kv.put(META_KEY, JSON.stringify({ created: new Date().toISOString(), version: 1, wiped: true }));
    return json(200, { ok: true, wiped: true });
  }

  return json(404, { error: 'unknown route', path: p });
}

/**
 * Send a real email via the Resend API using fetch.
 * Set RESEND_API_KEY + EMAIL_FROM as encrypted secrets in
 * Pages project → Settings → Environment variables.
 */
async function sendRealEmail(env, to, subject, body, opts) {
  opts = opts || {};
  const RESEND_API_KEY = env.RESEND_API_KEY || '';
  const EMAIL_FROM = env.EMAIL_FROM || 'EuroFiducia <noreply@eurofiducia.com>';
  if (!RESEND_API_KEY) {
    return { ok: true, simulated: true, detail: 'No RESEND_API_KEY configured' };
  }
  const payload = { from: EMAIL_FROM, to: to, subject: subject, text: body };
  if (/<[a-z][\s\S]*>/i.test(body)) payload.html = body;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return { ok: true, simulated: false, detail: 'Sent via Resend' };
    }
    const errText = await res.text();
    return { ok: false, simulated: true, detail: 'Resend API error: ' + res.status + ' ' + errText };
  } catch (e) {
    return { ok: false, simulated: true, detail: 'Network error: ' + e.message };
  }
}
