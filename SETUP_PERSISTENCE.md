# 🔐 EuroFiducia — Data Persistence Setup Guide

## The Problem This Solves

By default, EuroFiducia stores all user accounts, transactions, and settings in the browser's `localStorage`. This means:

- ❌ **Data is lost when you redeploy** the site (new deploy = new origin/cache)
- ❌ **Users can't access their account from a different device** (localStorage is per-browser)
- ❌ **Clearing browser data wipes everything** — all user accounts gone

## The Solution

EuroFiducia now includes an optional **zero-dependency Node.js backend** that acts as a durable, cross-device data store. When configured:

- ✅ All user data syncs to a server-side JSON database (`db.json`)
- ✅ Data survives redeployment — nothing is lost
- ✅ Users can log in from any device and see their full account
- ✅ localStorage becomes a fast cache; the server is the source of truth
- ✅ Works even if the server is temporarily down (graceful degradation to local-only)

---

## Quick Start (Local Development)

### 1. Start the backend server

```bash
cd server
node server.js
```

You'll see:
```
EuroFiducia backend running on port 3000
  API:    http://localhost:3000/api/health
  Pull:   http://localhost:3000/api/pull
  Static: http://localhost:3000/
```

The server also serves the entire frontend, so you can visit `http://localhost:3000` directly.

### 2. Configure the backend URL in the admin dashboard

1. Log in to the admin dashboard (`admin/login.html`)
2. Go to **Settings**
3. Scroll to **"Data Persistence — Backend Server URL"**
4. Enter your server URL (e.g., `http://localhost:3000` for local dev)
5. Click **Save Backend URL**

Once saved, all data automatically syncs. You'll see a green confirmation: *"✓ Backend URL is set. Data syncs to: ..."*

### 3. That's it!

Every user registration, approval, transaction, and wallet change now persists to the server. Open the site on a different device, enter the same backend URL, and all data hydrates automatically.

---

## How It Works

### Architecture

```
Browser (localStorage)  ←→  EuroFiducia Backend (db.json)
     Fast cache                    Source of truth
```

- **On page load:** `sync.js` calls `GET /api/pull` to hydrate localStorage with the server's full database. New devices immediately get all data.
- **On every write:** `EV.store.set()` and `EV.store.push()` are patched to also push the changed key to the server via `PUT /api/key/:key`.
- **Background sync:** Every 30 seconds, `sync.js` flushes all `ev_*` keys to the server via `POST /api/sync` (bulk merge).
- **On page unload:** A final flush runs via `beforeunload` and `visibilitychange` events.
- **Graceful degradation:** If the server is unreachable, the app continues working with localStorage only. No errors, no crashes.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/pull` | Returns the entire database (for hydration) |
| `GET` | `/api/key/:key` | Get a single key's value |
| `PUT` | `/api/key/:key` | Set a single key's value |
| `POST` | `/api/sync` | Bulk merge `{ dump: { key: value } }` — arrays merged by id |
| `POST` | `/api/wipe?token=eurofiducia-reset` | ⚠️ Reset the database (protected by token) |

---

## Hosting the Backend for Free

### Option 1: Render.com (Recommended — Free Tier)

1. Create an account at [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo (or use the EuroFiducia repo)
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** *(leave empty)*
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Click **Create Web Service**
6. Once deployed, copy the URL (e.g., `https://eurofiducia-backend.onrender.com`)
7. Enter this URL in the admin dashboard → Settings → Backend Server URL

> **Note:** Render's free tier sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. This is fine — the app degrades gracefully and resyncs once the server wakes.

### Option 2: Railway.app

1. Create an account at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Set the root directory to `server`
4. Railway auto-detects Node.js and runs `node server.js`
5. Copy the generated URL and enter it in admin settings

### Option 3: VPS with PM2 (Always-On)

```bash
# On your server
cd /path/to/eurofiducia/server
npm install -g pm2
pm2 start server.js --name eurofiducia
pm2 save
pm2 startup  # enables auto-start on reboot

# If behind nginx, proxy /api to port 3000:
# location /api { proxy_pass http://localhost:3000; }
```

---

## Data Safety

- The `db.json` file is the durable source of truth. **Back it up regularly.**
- On Render/Railway, the filesystem is ephemeral on free tiers — data may reset on redeploy. For production, attach a persistent disk (Render: Settings → Disks) or use a VPS.
- To reset the database: `POST /api/wipe?token=eurofiducia-reset` (change this token by setting the `ADMIN_TOKEN` environment variable).
- The wipe endpoint is protected — only someone with the token can reset data.

---

## What Gets Synced?

Everything stored with the `ev_` prefix in localStorage:

| Key Pattern | Content |
|-------------|---------|
| `ev_users` | All user accounts (with account numbers, member IDs, status) |
| `ev_user_tx_<id>` | Per-user transaction history |
| `ev_email_log` | Email notification log |
| `ev_sms_log` | SMS notification log |
| `ev_crypto_wallets` | Admin-configured cryptocurrency wallets |
| `ev_support_*` | Support tickets and AI chat logs |
| `ev_session` | Current user session |
| Other `ev_*` keys | Any additional app state |

---

## Troubleshooting

**"Data isn't syncing"**
- Check that the backend URL is correctly set in admin settings (no trailing slash needed, but it's auto-stripped)
- Verify the server is running: visit `<your-url>/api/health` in a browser
- Check browser console for CORS errors — the backend has permissive CORS headers

**"New device doesn't show data"**
- Make sure the backend URL is set on the new device too (it's stored in localStorage, so each device needs it configured once via admin settings)
- The hydration runs on page load — refresh the page after setting the URL

**"Server keeps sleeping (Render free tier)"**
- Consider upgrading to a paid plan, or using a VPS with PM2
- The app still works while the server sleeps — it just can't sync until it wakes

---

## Without a Backend (Local-Only Mode)

If you don't configure a backend URL, EuroFiducia works exactly as before — all data stays in localStorage. This is fine for development/testing but doesn't provide cross-device persistence. To enable persistence, simply set up the backend and enter the URL in admin settings.
