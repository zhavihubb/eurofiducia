#!/usr/bin/env python3
import io

APP = '/workspace/eurofiducia/assets/js/app.js'
with io.open(APP, 'r', encoding='utf-8') as f:
    src = f.read()

marker = "// ===================== UTILITIES ====================="
assert marker in src

INSERT = r'''// ===================== COUNTRY-SPECIFIC DEPOSIT METHODS =====================
// Each supported country gets its own visible set of deposit methods shown on
// the user's Deposit page. Methods include cryptocurrency (always available,
// gas fee covered by EuroFiducia), SEPA / local bank transfer with country-specific
// beneficiary instructions, card payment, open banking / instant payment rails,
// and (where relevant) local mobile/retail cash options. Admin can edit the bank
// beneficiary details from the dashboard and the edits persist via EV.store.
EV.depositMethods = {
  // Default bank beneficiary + per-country local payment details. Editable.
  _defaultsBank: {
    beneficiary: 'EUROFIDUCIA SAS',
    bankName: 'BNP Paribas \u2014 EuroFiducia Client Account',
    iban: 'FR76 3000 4028 3700 0123 4567 890',
    bic: 'BNPAFRPP',
    referencePrefix: 'EV-DEP'
  },
  // Helper: get the (editable) bank beneficiary block.
  getBank: function() {
    return EV.store.get('deposit_bank_details', null) || this._defaultsBank;
  },
  saveBank: function(bank) {
    EV.store.set('deposit_bank_details', bank);
    return bank;
  },
  resetBank: function() {
    EV.store.set('deposit_bank_details', null);
    return this._defaultsBank;
  },
  // Master method catalog. Each entry: {id,icon,label,desc,fields,note,kind}
  // kind: 'crypto' | 'bank' | 'card' | 'openbanking' | 'local'
  _methodCatalog: {
    crypto: {
      id:'crypto', icon:'\ud83d\udcb0', label:'Cryptocurrency', kind:'crypto',
      desc:'Instant funding \u2014 confirmed in minutes. The GAS FEE IS ON US. No bank verification needed. Recommended for your first deposit.',
      note:'Send the matching coin to the address shown. We cover all network fees.'
    },
    sepa: {
      id:'sepa', icon:'\ud83c\udfeb', label:'SEPA Bank Transfer', kind:'bank',
      desc:'Standard SEPA credit transfer in euros. Funds arrive within 1\u20132 business days. Free for the user; EuroFiducia covers intermediary charges.',
      note:'Use your unique reference so we can match your deposit automatically.'
    },
    card: {
      id:'card', icon:'\ud83d\udcb3', label:'Card Payment', kind:'card',
      desc:'Instant funding with Visa or Mastercard. Funds credited within minutes.',
      note:'A 3-D Secure verification may be required by your bank.'
    },
    openbanking: {
      id:'openbanking', icon:'\ud83d\udd17', label:'Open Banking / Instant', kind:'openbanking',
      desc:'Pay directly from your bank app via open banking. Instant settlement, no card details shared.',
      note:'Available for most European banks.'
    }
  },
  // Per-country local payment rails (in addition to crypto + SEPA + card).
  _countryLocal: {
    FR: [
      { id:'fr_inst', icon:'\u26a1', label:'Instant Payment (SEPA Inst)', kind:'openbanking',
        desc:'French SEPA Instant transfer \u2014 funds credited in under 10 seconds, 24/7.',
        note:'Supported by Cr\u00e9dit Agricole, BNP Paribas, Soci\u00e9t\u00e9 G\u00e9n\u00e9rale, La Banque Postale and others.' },
      { id:'fr_livret', icon:'\ud83d\udcb5', label:'Livret / LDDS Transfer', kind:'bank',
        desc:'Transfer from your Livret A or LDDS savings account to your EuroFiducia account.',
        note:'Regulated savings withdrawals may take 1\u20132 business days.' }
    ],
    IT: [
      { id:'it_bonifico', icon:'\ud83c\udfeb', label:'Bonifico Immediato (SCT Inst)', kind:'openbanking',
        desc:'Italian instant bank transfer (SCT Inst) \u2014 funds credited within seconds.',
        note:'Supported by UniCredit, Intesa Sanpaolo, BancPosta and others.' },
      { id:'it_postagiro', icon:'\ud83d\udcc7', label:'Bollettino / Postagiro', kind:'local',
        desc:'Pay via Poste Italiane (Postagiro or postal bulletin). Available nationwide.',
        note:'Allow 1\u20133 business days for postal settlement.' }
    ],
    DE: [
      { id:'de_ueberweisung', icon:'\u26a1', label:'Echtzeit\u00fcberweisung (SCT Inst)', kind:'openbanking',
        desc:'German real-time instant transfer \u2014 funds credited within seconds.',
        note:'Supported by Sparkassen, Volksbanken, Deutsche Bank, Commerzbank and others.' },
      { id:'de_giropay', icon:'\ud83d\udd17', label:'giropay', kind:'openbanking',
        desc:'Pay directly from your German online banking via giropay. Instant.',
        note:'No card required \u2014 authorise in your banking app.' }
    ],
    ES: [
      { id:'es_bizum', icon:'\ud83d\udcf1', label:'Bizum', kind:'local',
        desc:'Instant P2P payment via Bizum from your Spanish bank app.',
        note:'Bizum transfers are instant and free for the user.' },
      { id:'es_inst', icon:'\u26a1', label:'Transferencia Instant\u00e1nea (SCT Inst)', kind:'openbanking',
        desc:'Spanish instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by BBVA, Santander, CaixaBank, Sabadell and others.' }
    ],
    PT: [
      { id:'pt_mb', icon:'\ud83d\udcb3', label:'MB WAY', kind:'local',
        desc:'Instant payment via MB WAY from your Portuguese bank app or card.',
        note:'MB WAY transfers are instant and widely available in Portugal.' },
      { id:'pt_inst', icon:'\u26a1', label:'Transfer\u00eancia Instant\u00e2nea (SCT Inst)', kind:'openbanking',
        desc:'Portuguese instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by Novobanco, BCP, BPI, Caixa Geral and others.' }
    ],
    BE: [
      { id:'be_inst', icon:'\u26a1', label:'Instant Bank Transfer (SCT Inst)', kind:'openbanking',
        desc:'Belgian instant SEPA transfer \u2014 funds credited within seconds.',
        note:'Supported by KBC, Belfius, ING Belgium, BNP Paribas Fortis and others.' }
    ],
    NL: [
      { id:'nl_ideal', icon:'\ud83d\udd17', label:'iDEAL', kind:'openbanking',
        desc:'Pay instantly via iDEAL from your Dutch bank. The most popular online payment method in the Netherlands.',
        note:'Supported by ABN AMRO, ING, Rabobank, SNS and others. Instant.' }
    ],
    other: [
      { id:'intl_swift', icon:'\ud83c\udf10', label:'International Wire (SWIFT)', kind:'bank',
        desc:'International wire transfer in EUR or your local currency.',
        note:'SWIFT transfers may take 2\u20135 business days. EuroFiducia covers receiving fees.' }
    ]
  },
  // Build the full list of deposit methods for a given country code.
  // Order: crypto first (recommended), then SEPA, then country-local rails,
  // then card and open banking.
  forCountry: function(country) {
    country = country || 'other';
    var bank = this.getBank();
    var local = this._countryLocal[country] || this._countryLocal['other'];
    var methods = [];
    // Crypto first
    methods.push(this._enrich(this._methodCatalog.crypto, bank));
    // SEPA (bank) \u2014 only meaningful for SEPA countries
    if (country !== 'other') {
      methods.push(this._enrich(this._methodCatalog.sepa, bank));
    } else {
      methods.push(this._enrich(this._methodCatalog.intl || this._methodCatalog.sepa, bank));
    }
    // Country-local rails
    local.forEach(function(m){ methods.push(this._enrich(m, bank)); }, this);
    // Card + open banking
    methods.push(this._enrich(this._methodCatalog.card, bank));
    methods.push(this._enrich(this._methodCatalog.openbanking, bank));
    // De-duplicate by id
    var seen = {}; var out = [];
    methods.forEach(function(m){ if(!seen[m.id]){ seen[m.id]=1; out.push(m); } });
    return out;
  },
  // Attach bank beneficiary details (iban/bic/beneficiary/reference) to a method.
  _enrich: function(method, bank) {
    var m = Object.assign({}, method);
    if (m.kind === 'bank' || m.kind === 'openbanking' || m.kind === 'local') {
      m.beneficiary = bank.beneficiary;
      m.bankName = bank.bankName;
      m.iban = bank.iban;
      m.bic = bank.bic;
      m.reference = bank.referencePrefix + '-{accountNumber}';
    }
    return m;
  }
};

// ===================== INVESTMENT PLANS (TERM-BASED ROI) =====================
// Term-based investment plans. Users pick a plan, enter an amount, and the
// platform creates an investment with a maturity date and projected ROI.
// Fast plans (24h / 48h) start from a minimum of $200. Longer plans offer
// higher ROI in exchange for a longer lock-up. Admin can edit ROI/min amounts
// and the edits persist via EV.store under 'edited_invest_plans'.
// roiPct is the RETURN (profit) as a percentage of principal for the full term.
EV._investPlansDefaults = [
  { id:'fast24',  name:'24-Hour Fast Plan',   icon:'\u26a1',  termHours:24,    roiPct:15,   minAmount:200,  category:'fast',     badge:'FAST',  desc:'Lightning-fast 24-hour plan. Principal + 15% ROI credited at maturity. Minimum $200.' },
  { id:'fast48',  name:'48-Hour Fast Plan',   icon:'\u23f1',  termHours:48,    roiPct:25,   minAmount:200,  category:'fast',     badge:'FAST',  desc:'48-hour fast plan. Principal + 25% ROI credited at maturity. Minimum $200.' },
  { id:'weekly',  name:'Weekly Plan',         icon:'\ud83d\uddd3', termHours:168,    roiPct:45,   minAmount:100,  category:'short',    badge:'7 DAYS',desc:'7-day plan. Principal + 45% ROI at maturity. Reinvest weekly to compound.' },
  { id:'monthly', name:'Monthly Plan',        icon:'\ud83d\udcc5', termHours:720,    roiPct:90,   minAmount:100,  category:'medium',   badge:'30 DAYS',desc:'30-day plan. Principal + 90% ROI at maturity. A balance of speed and growth.' },
  { id:'quarter', name:'Quarterly Plan',      icon:'\ud83c\udfa9', termHours:2160,   roiPct:180,  minAmount:100,  category:'medium',   badge:'90 DAYS',desc:'90-day plan. Principal + 180% ROI at maturity. Enhanced returns for patience.' },
  { id:'yearly',  name:'Yearly Plan',         icon:'\ud83c\udf89', termHours:8760,   roiPct:420,  minAmount:100,  category:'long',     badge:'365 DAYS',desc:'365-day plan. Our highest ROI \u2014 principal + 420% at maturity. For long-term wealth.' }
];

EV.investPlans = {
  // Return effective list (edited overrides merged over defaults).
  getAll: function() {
    var edited = EV.store.get('edited_invest_plans', {});
    return EV._investPlansDefaults.map(function(p){
      return edited[p.id] ? Object.assign({}, p, edited[p.id]) : p;
    });
  },
  getOne: function(id) {
    return this.getAll().find(function(p){ return p.id === id; }) || null;
  },
  edit: function(id, changes) {
    var edited = EV.store.get('edited_invest_plans', {});
    edited[id] = Object.assign({}, edited[id] || {}, changes);
    EV.store.set('edited_invest_plans', edited);
    return this.getOne(id);
  },
  reset: function(id) {
    var edited = EV.store.get('edited_invest_plans', {});
    delete edited[id];
    EV.store.set('edited_invest_plans', edited);
    return this.getOne(id);
  },
  resetAll: function() {
    EV.store.set('edited_invest_plans', {});
    return this.getAll();
  },
  // Validate an investment amount against a plan's minimum.
  validateAmount: function(plan, amount) {
    var amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return { ok:false, msg:'Please enter a valid amount.' };
    if (amt < plan.minAmount) {
      return { ok:false, msg:'The minimum for the ' + plan.name + ' is $' + plan.minAmount + '. Please enter at least $' + plan.minAmount + '.' };
    }
    return { ok:true, amount: amt };
  },
  // Create an investment record + maturity schedule for a user.
  // Returns the created investment object.
  create: function(userId, planId, amount, opts) {
    opts = opts || {};
    var plan = this.getOne(planId);
    if (!plan) return null;
    var v = this.validateAmount(plan, amount);
    if (!v.ok) return { error: v.msg };
    var amt = v.amount;
    var roi = amt * (plan.roiPct / 100);
    var now = new Date();
    var maturity = new Date(now.getTime() + plan.termHours * 3600 * 1000);
    var inv = {
      id: 'INV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase(),
      userId: userId,
      planId: plan.id,
      planName: plan.name,
      category: plan.category,
      principal: parseFloat(amt.toFixed(2)),
      roiPct: plan.roiPct,
      roiAmount: parseFloat(roi.toFixed(2)),
      totalReturn: parseFloat((amt + roi).toFixed(2)),
      startDate: now.toISOString(),
      maturityDate: maturity.toISOString(),
      status: 'active',
      source: opts.source || 'dashboard'
    };
    var list = EV.store.get('user_investments_' + userId, []);
    list.push(inv);
    EV.store.set('user_investments_' + userId, list);
    // Record a purchase-type transaction so it shows in Transactions + receipts.
    EV.tx.generate(userId, {
      type: 'purchase',
      amount: amt,
      method: 'Platform',
      date: now.toISOString(),
      description: 'Investment: ' + plan.name
    });
    return inv;
  },
  // List a user's investments (newest first).
  listForUser: function(userId) {
    var list = EV.store.get('user_investments_' + userId, []);
    return list.slice().sort(function(a,b){ return new Date(b.startDate) - new Date(a.startDate); });
  },
  // Compute progress percentage for an active investment.
  progress: function(inv) {
    var now = Date.now();
    var start = new Date(inv.startDate).getTime();
    var end = new Date(inv.maturityDate).getTime();
    if (now >= end) return 100;
    return Math.max(0, Math.min(100, Math.round((now - start) / (end - start) * 100)));
  }
};

'''

src = src.replace(marker, INSERT + marker, 1)
with io.open(APP, 'w', encoding='utf-8') as f:
    f.write(src)
print("OK - inserted EV.depositMethods + EV.investPlans")
print("New length:", len(src))
