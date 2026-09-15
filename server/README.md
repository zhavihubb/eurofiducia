# EuroFiducia Persistence Backend

This is a **zero-dependency** Node.js server (uses only built-in `http` + `fs` modules — no `npm install` needed) that stores **all** EuroFiducia data in a single `db.json` file on the server.

## Why it exists

The original EuroFiducia app stored everything in the browser's `localStorage`. That means:

- ❌ Data is wiped when the static site is **redeployed** (new build = fresh browser storage)
- ❌ Data is **per-device / per-browser** — logging in on a new phone loses everything
- ❌ There is no shared admin/user state

This backend fixes all three. The browser `localStorage` now acts only as a **fast cache**; the server `db.json` is the **durable, cross-device source of truth**.

## How it works

1. The frontend loads `assets/js/sync.js` **after** `app.js`.
2. `sync.js` patches `EV.store` so every `set()`/`push()` also pushes the value to the server.
3. On page load, `EV.sync.hydrate()` pulls the whole server DB and merges it into `localStorage` — so a user on a **new device** instantly gets all their data back.
4. A background timer flushes local changes every 30 seconds (and on page unload).

If the server is unreachable, the app keeps working on `localStorage` alone (graceful degradation — no broken pages).

## Running it

```bash
cd server
node server.js
# → EuroFiducia backend running on port 3000
```

Optional env vars:

- `PORT` — port to listen on (default `3000`)
- `ADMIN_TOKEN` — token required to wipe the DB via `/api/wipe`

## Hosting it for free

### Option A — Render.com (recommended, free tier)
1. Create a new **Web Service** on https://render.com
2. Connect this repo / folder
3. Build command: *(leave empty)*
4. Start command: `node server/server.js`
5. Add env var `PORT=10000` (Render sets this automatically; the server reads `process.env.PORT`)
6. Deploy. You get a URL like `https://eurofiducia-backend.onrender.com`
7. In the frontend, set `EV.sync.serverURL = 'https://eurofiducia-backend.onrender.com'` (see below).

> Render free tier spins down after 15 min of inactivity and wakes on the next request (a few seconds delay). For production, a $7/mo instance stays always-on.

### Option B — Railway.app
1. New project → deploy from repo
2. Start command: `node server/server.js`
3. Railway gives you a persistent URL.

### Option C — Any VPS (always-on)
```bash
npm install -g pm2
pm2 start server/server.js --name eurofiducia
pm2 save
pm2 startup   # auto-restart on reboot
```
Then put nginx in front for HTTPS.

## Connecting the frontend

Open `assets/js/sync.js` and set:

```js
EV.sync.serverURL = 'https://your-backend-url.example.com';
```

Or, even better, set it dynamically so it works in any environment — add this right before `</body>` in your HTML pages (after `sync.js` is loaded):

```html
<script>
  // Point sync at your deployed backend (leave empty for local-only / dev)
  if (window.EV && EV.sync) EV.sync.init('https://your-backend-url.example.com');
</script>
```

If you leave `serverURL` empty, sync is skipped and the app behaves exactly as before (localStorage only). This is handy for quick local development.

## API reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/pull` | Returns the entire DB (all `ev_*` keys) for client hydration |
| GET | `/api/key/:key` | Get a single key's value |
| PUT | `/api/key/:key` | Set a single key's value (`{ "value": ... }`) |
| POST | `/api/sync` | Bulk merge (`{ "dump": { key: value, ... } }`) — arrays merged by `id` |
| GET | `/api/data` | Raw full DB (admin/debug) |
| POST | `/api/wipe?token=XXX` | Reset the DB (danger zone) |

## Data safety

- `db.json` is rewritten on every change (atomic-enough for this scale; for high traffic, swap in SQLite later).
- **Commit `db.json` to git** so a fresh deploy starts with the last known state. The server updates it at runtime.
- Back up `db.json` periodically (it is one file — just copy it).
