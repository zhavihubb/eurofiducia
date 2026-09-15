# 🏦 EuroFiducia — Investment Platform

**France 🇫🇷 & Italy 🇮🇹** — A multi-region investment platform built for European and global investors.

![EuroFiducia](https://img.shields.io/badge/EuroFiducia-Investment_Platform-0055A4)
![Languages](https://img.shields.io/badge/Languages-10-008C45)
![Loans](https://img.shields.io/badge/Loan_Types-12-blue)
![Portfolios](https://img.shields.io/badge/Portfolios-8-0A1A3F)
![Persistence](https://img.shields.io/badge/Cross_Device_Persistence-✓-008C45)

---

## 💰 Overview

EuroFiducia is a fully responsive, multi-language investment platform serving French and Italian markets with European and global investment opportunities. The platform includes a complete loan service, bank account verification, email/SMS notification system, motivational email templates, cryptocurrency deposit support, and admin/user dashboards — with optional cross-device data persistence via a lightweight Node.js backend.

## ✨ Features

### 🏦 Loans & Financing (12 Loan Types)
- Personal, Mortgage, Auto, Business, Student, Debt Consolidation
- Home Equity, Bridge, Equipment Financing, Credit Line, Green Energy, Medical
- Interactive loan detail page with specs, features, FAQ, and application process
- Full loan management in admin dashboard

### 🪙 Account Numbers on Approval
- When an admin approves a user account, the system automatically generates:
  - **EuroFiducia Account Number** (format: `EV-YYYY-XXXXXXXX` — unique per user)
  - **Client / Member ID** (format: `EV-CL-XXXXX` — unique per user)
- These identifiers appear on:
  - The **approval email** sent to the user
  - The **user dashboard** (profile/account info section)
  - All **transaction receipts**
  - The **admin user detail view** (gradient identifier card)

### 💳 Registration & Optional Bank Verification
- 5-step registration: Account → Identity → Bank Verification → Profile → Compliance
- **Bank account linking is now OPTIONAL** — users can skip it and add details later
- "No bank account? No problem" info card explains the crypto alternative
- Compliance checkbox only required if bank details are provided
- Country-specific bank details (France, Italy, Germany, EU) when provided
- New accounts under **pending** status until admin approval

### 💰 Cryptocurrency Deposit Support
- **"Why pay with cryptocurrency first?"** explanation card on the deposit page with 6 reasons:
  - 🚀 Instant funding (no 1–2 day SEPA wait)
  - 💰 Lower fees (skip bank charges, stablecoins cost cents)
  - ✅ No bank verification needed (fund before linking a bank)
  - 🌐 Borderless (send from anywhere, 24/7)
  - 🔒 Private & secure (cryptographically secured)
  - ⚡ Recommended for first deposit
- **Cryptocurrency is the default/first deposit method** (marked "Recommended — instant")
- When crypto is selected, admin-configured wallet addresses are displayed with copy buttons
- Safety warning about sending correct coins to correct networks
- Default wallets: BTC, ETH, USDT (admin can add/edit/remove)

### 🔧 Admin Cryptocurrency Wallet Management
- Admin dashboard → Settings → "Cryptocurrency Wallet Management"
- Add, edit, or delete wallet entries (coin name, symbol, network, address, note)
- Changes persist across redeploy/devices via the persistence layer
- Wallets automatically appear to users when they choose crypto deposit

### 🔐 Cross-Device Data Persistence
- **Zero-dependency Node.js backend** (built-in `http` + `fs` only — no npm install needed)
- JSON file database (`db.json`) as the durable, cross-device source of truth
- localStorage becomes a fast cache; server is the source of truth
- **Data survives redeployment and works across devices/browsers**
- Graceful degradation: app works even if server is unreachable
- See [SETUP_PERSISTENCE.md](SETUP_PERSISTENCE.md) for full setup instructions
- Admin can configure the backend URL from Settings → "Data Persistence"

### 📧 Email & SMS Notifications
- All user activities notify user email AND dashboard inbox
- All user activities also notify admin email log
- SMS notifications for key events (account approval, with account numbers)
- Admin Email & SMS Log section

### 🚀 Motivational Email Templates
- 10 pre-built motivational email templates
- Admin can send to single, multiple, or all users
- Personalized with {name} placeholders
- Delivered to user email AND dashboard in official EuroFiducia template

### 💼 Investment Portfolios (8 Portfolios)
- France: Conservative, Balanced, Growth
- Italy: Conservative, Balanced, Growth
- Euro Growth (Balanced + Growth)
- Global Growth
- Transaction generation includes all portfolio types

### 🌍 Multi-Language Support (10 Languages)
- English, Français, Italiano, Español, Deutsch, Português
- العربية, 中文, Русский, हिन्दी
- Admin always sees English; users see their selected native language

### 📱 Responsive Design
- Mobile hamburger menu on all public pages
- Dashboard sidebar toggle for mobile
- All service cards clickable with full detail pages
- Responsive CSS at 968px, 768px, and 600px breakpoints
- All new crypto/account-number components are fully responsive

## 🗂️ Project Structure

```
eurofiducia/
├── index.html              # Landing page
├── markets.html            # Markets & all services overview
├── loans.html              # Full loans service page (12 loan types)
├── portfolios.html         # Investment portfolios
├── about.html              # About EuroFiducia
├── register.html           # 5-step registration (bank linking optional)
├── login.html              # User login
├── reset.html              # Password reset
├── receipt.html            # Transaction receipt (with account numbers)
├── admin/
│   ├── dashboard.html      # Admin dashboard (wallet mgmt + backend URL config)
│   └── login.html          # Admin login
├── user/
│   └── dashboard.html      # User dashboard (crypto deposit + account info)
├── legal/
│   ├── terms.html          # Terms & Conditions
│   ├── privacy.html        # Privacy Policy
│   ├── risk.html           # Risk Disclosure
│   ├── aml.html            # AML / KYC
│   ├── cookies.html        # Cookie Policy
│   ├── fees.html           # Fee Schedule
│   ├── regulatory.html     # Regulatory Info
│   └── complaints.html     # Complaints Procedure
├── server/                 # ← NEW: Persistence backend
│   ├── server.js           # Zero-dep Node.js server (http + fs only)
│   ├── package.json        # No dependencies
│   ├── db.json             # JSON file database (durable store)
│   └── README.md           # Backend hosting guide
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (with crypto/account-number styles)
│   │   └── legal.css       # Legal pages stylesheet
│   ├── js/
│   │   ├── app.js          # Core application logic (crypto module, account gen)
│   │   ├── sync.js         # ← NEW: Client persistence layer
│   │   └── translations.js # 10-language translation engine
│   └── images/             # Platform images
└── data/                   # Data files
```

## 🚀 Getting Started

### Option A: Static Only (No Persistence)

1. Clone the repository:
   ```bash
   git clone https://github.com/frazierjoseph121112-dev/eurofiducia.git
   ```
2. Navigate to the project directory:
   ```bash
   cd eurofiducia
   ```
3. Serve locally:
   ```bash
   python3 -m http.server 8080
   ```
4. Visit `http://localhost:8080`

### Option B: With Persistence Backend (Recommended)

1. Clone and start the backend:
   ```bash
   git clone https://github.com/frazierjoseph121112-dev/eurofiducia.git
   cd eurofiducia/server
   node server.js
   ```
2. Visit `http://localhost:3000` (the server serves the frontend too)
3. Log in to admin → Settings → set the Backend Server URL
4. See [SETUP_PERSISTENCE.md](SETUP_PERSISTENCE.md) for production hosting

### Admin Access
- **URL:** `admin/dashboard.html` (or `admin/login.html`)
- **Email:** `admin@eurofiducia.eu`
- **Password:** `admin123`

## 🛠️ Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage:** localStorage with `ev_` prefix (fast cache) + optional Node.js backend (durable)
- **Backend:** Zero-dependency Node.js (built-in `http` + `fs` only)
- **Translation Engine:** Custom JS-based i18n with 10 languages
- **No build step** — fully static, deployable anywhere

## 🎨 Design System

| Token | Color | Usage |
|-------|-------|-------|
| `--brand-blue` | `#0055A4` | French blue, primary actions |
| `--brand-green` | `#008C45` | Italian green, success states, crypto accents |
| `--brand-navy` | `#0A1A3F` | Deep navy, headers & hero |
| `--accent-gold` | `#C5A572` | Premium accents |

## 📄 License

This project is proprietary. All rights reserved.

---

**EuroFiducia** — Invest Across Global Markets 🌍
