# EuroFiducia — Free Hosting on Cloudflare Pages ($0, no credit card)

This guide explains how the platform runs **100% free** on Cloudflare's free tier.

## Architecture

| Piece | Service | Cost |
|---|---|---|
| Website (HTML/CSS/JS) | Cloudflare Pages | $0 |
| Backend API (`/api/*`) | Cloudflare Pages Functions (`functions/api/[[path]].js`) | $0 (100k requests/day) |
| Database (user accounts, transactions, emails) | Cloudflare KV (bound as `EV_DB`) | $0 (100k reads/day, 1k writes/day) |
| Domain DNS (`eurofiducia.com`) | Cloudflare DNS | $0 |
| SSL certificate (https + padlock) | Cloudflare Universal SSL | $0 (automatic) |
| Real email notifications | Resend (free tier) | $0 (100 emails/day, 3,000/month) |

## Why this works

The original backend (`server/server.js`) was a Node.js server with a JSON file database. Cloudflare's free tier doesn't offer persistent disks, so the backend has been ported to a **Cloudflare Pages Function** that stores the same data in **Cloudflare KV** — with identical API responses, so the frontend (`assets/js/sync.js`) works without any changes.

Change-detection in `/api/sync` means the frontend's 30-second auto-flush only consumes a KV **write** when data actually changed (reads are 100× cheaper on the free tier), so the daily 1,000-write allowance goes a very long way.

## Setup (already configured in this repo)

1. **Cloudflare Pages project** — connected to GitHub repo `zhavihubb/eurofiducia`, branch `main`, build command: none, output dir: `/`
2. **KV namespace** — create one named `eurofiducia-db`, bind it as `EV_DB` (Pages → Settings → Bindings → Add → KV namespace)
3. **Environment variables** (Pages → Settings → Environment variables):
   - `RESEND_API_KEY` — from your Resend account (send- API key)
   - `EMAIL_FROM` — `EuroFiducia <noreply@eurofiducia.com>`
   - `AMP_ADMIN_ALERTS` — optional switch
4. **Custom domain** — Pages → Custom domains → Add `eurofiducia.com` (and `www`) after the zone is in Cloudflare
5. ***Personal email* — Email Routing (free) → `support@`, `admin@` → forward to your personal inbox. These are forwarding addresses, not storage mailboxes.**

## Limitations of the free tier (honesty box)

- KV is *eventually consistent*: a write in one region can take a few seconds (~up to 60s worst case) to appear in another region. For this platform (user accounts, deposit records) that's fine.
- 1,000 KV writes/day on the free plan — the change-detection in `/api/sync` means only actual changes count, so you'd need ~33 changes/minute sustained to hit it.
- Resend free tier can only send to **your own verified address** until your domain is verified in Resend; after domain verification you can send to any address.
- Admin dashboard (`/admin/`) is not linked from any public page — it's unlisted but not auth-hardened; treat the ADMIN_TOKEN as the real protection.

## Local testing

The Node version (`server/server.js`) still runs locally: `npm start` → `http://localhost:3000` — use it if you ever want a local dev copy. The Cloudflare version is what runs in production.
