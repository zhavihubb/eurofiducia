#!/usr/bin/env python3
"""Patch user/dashboard.html with:
 - New sidebar items (Investment Plans, Rules & Regulations)
 - Investment Plans page section
 - Rules & Regulations printable page section
 - Gas fee / auto-activation messaging on deposit page
 - Country-specific deposit methods rendering on deposit page
 - New showPage() routes + loader functions
"""
import io

PATH = "user/dashboard.html"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# ---- 1. SIDEBAR: add Investment Plans after Investments, rename "Account" section to include Rules ----
old_sidebar = (
    '      <div class="dash-nav-item" onclick="showPage(\'invest\')">'
    '<span class="icon">\U0001f4c8</span> <span data-i18n="dash_invest">Investments</span></div>\n'
    '      <div class="dash-nav-section">Funds</div>\n'
)
new_sidebar = (
    '      <div class="dash-nav-item" onclick="showPage(\'invest\')">'
    '<span class="icon">\U0001f4c8</span> <span data-i18n="dash_invest">Investments</span></div>\n'
    '      <div class="dash-nav-item" onclick="showPage(\'plans\')">'
    '<span class="icon">\U0001f680</span> Investment Plans</div>\n'
    '      <div class="dash-nav-section">Funds</div>\n'
)
assert old_sidebar in src, "sidebar invest block not found"
src = src.replace(old_sidebar, new_sidebar, 1)

# Add Rules & Regulations nav item before Settings, change section label
old_sec = (
    '      <div class="dash-nav-item" onclick="showPage(\'support\')">'
    '<span class="icon">\U0001f3a7</span> <span data-i18n="dash_support">Support</span></div>\n'
    '      <div class="dash-nav-section">Account</div>\n'
    '      <div class="dash-nav-item" onclick="showPage(\'settings\')">'
    '<span class="icon">\u2699\ufe0f</span> <span data-i18n="dash_settings">Settings</span></div>\n'
)
new_sec = (
    '      <div class="dash-nav-item" onclick="showPage(\'support\')">'
    '<span class="icon">\U0001f3a7</span> <span data-i18n="dash_support">Support</span></div>\n'
    '      <div class="dash-nav-section">Legal & Account</div>\n'
    '      <div class="dash-nav-item" onclick="showPage(\'rules\')">'
    '<span class="icon">\U0001f4cb</span> Rules & Regulations</div>\n'
    '      <div class="dash-nav-item" onclick="showPage(\'settings\')">'
    '<span class="icon">\u2699\ufe0f</span> <span data-i18n="dash_settings">Settings</span></div>\n'
)
assert old_sec in src, "sidebar account block not found"
src = src.replace(old_sec, new_sec, 1)

# ---- 2. Add "gas fee on us" + "auto-activation" banner ABOVE the crypto-why card on deposit page ----
old_dep_marker = '      <div id="page-deposit" class="dash-page hidden">\n\n        <!-- Why Cryptocurrency first -- explanation card -->'
dep_banner = (
    '      <div id="page-deposit" class="dash-page hidden">\n\n'
    '        <!-- Auto-activation + gas fee on us banner -->\n'
    '        <div class="card" style="max-width:760px;margin:0 auto 24px;border-left:4px solid var(--brand-green);background:linear-gradient(135deg,var(--success-light),var(--info-light));">\n'
    '          <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">\n'
    '            <span style="font-size:2.2rem;line-height:1;">\u26a1</span>\n'
    '            <div style="flex:1;min-width:240px;">\n'
    '              <h3 style="margin:0 0 6px;color:var(--brand-navy);">Activate Your Account & Unlock All Features</h3>\n'
    '              <p class="text-sm" style="margin:0 0 10px;line-height:1.7;">All EuroFiducia features \u2014 <strong>investing, withdrawals, loan disbursement, portfolio rebalancing, and dividend payouts</strong> \u2014 will start working <strong>automatically</strong> after your <strong>first deposit</strong> or after your <strong>loan processing fee</strong> is settled. Make your first payment today and the entire platform unlocks instantly.</p>\n'
    '              <div style="display:flex;flex-wrap:wrap;gap:10px;">\n'
    '                <span class="badge badge-success" style="font-size:0.85rem;padding:6px 12px;">\u26fd Gas Fee Is On Us</span>\n'
    '                <span class="badge badge-info" style="font-size:0.85rem;padding:6px 12px;">\u2705 No Hidden Charges</span>\n'
    '                <span class="badge badge-success" style="font-size:0.85rem;padding:6px 12px;">\U0001f513 Instant Unlock</span>\n'
    '              </div>\n'
    '            </div>\n'
    '          </div>\n'
    '        </div>\n\n'
    '        <!-- Country-specific deposit methods overview -->\n'
    '        <div class="card" style="max-width:760px;margin:0 auto 24px;" id="depositCountryMethods">\n'
    '          <h3 style="margin:0 0 4px;">\U0001f310 Available Deposit Methods for Your Country</h3>\n'
    '          <p class="text-muted text-sm" style="margin:0 0 16px;">All supported payment methods for your country are listed below. Choose any method in the form \u2014 full instructions appear when you select it.</p>\n'
    '          <div id="depositMethodGrid"></div>\n'
    '        </div>\n\n'
    '        <!-- Why Cryptocurrency first -- explanation card -->'
)
assert old_dep_marker in src, "deposit page marker not found"
src = src.replace(old_dep_marker, dep_banner, 1)

# ---- 3. Add Investment Plans page AFTER the invest page div ----
# Find the end of page-invest div
old_invest_end = (
    '        <div class="cat-grid" id="investGrid"></div>\n'
    '      </div>\n\n'
    '      <!-- ===== DEPOSIT ===== -->\n'
)
plans_page = (
    '        <div class="cat-grid" id="investGrid"></div>\n'
    '      </div>\n\n'
    '      <!-- ===== INVESTMENT PLANS (TERM-BASED ROI) ===== -->\n'
    '      <div id="page-plans" class="dash-page hidden">\n'
    '        <div class="card mb-6">\n'
    '          <h3>\U0001f680 Term-Based Investment Plans</h3>\n'
    '          <p class="text-muted text-sm mt-2">Choose a plan that fits your goals. Fast plans mature in 24\u201348 hours, while longer plans reward your patience with higher ROI. The <strong>gas fee is on us</strong> \u2014 every dollar you invest goes to work for you.</p>\n'
    '        </div>\n'
    '        <div id="plansGrid"></div>\n'
    '        <!-- Invest modal/flow -->\n'
    '        <div class="card mt-6" id="planInvestCard" style="display:none;border:2px solid var(--brand-blue);max-width:640px;margin:24px auto;">\n'
    '          <h4 style="margin-bottom:4px;">\U0001f4b0 Invest in <span id="planInvestName" style="color:var(--brand-blue);"></span></h4>\n'
    '          <p class="text-muted text-sm" style="margin-bottom:20px;" id="planInvestDesc"></p>\n'
    '          <form onsubmit="return doPlanInvest(event)">\n'
    '            <input type="hidden" id="planInvestId">\n'
    '            <div class="form-group">\n'
    '              <label class="form-label">Investment Amount (USD)</label>\n'
    '              <input type="number" class="form-input" id="planInvestAmount" step="0.01" required placeholder="200.00">\n'
    '              <p class="text-sm text-muted" style="margin:6px 0 0;" id="planInvestMinHint"></p>\n'
    '            </div>\n'
    '            <div id="planInvestPreview" style="display:none;background:var(--bg-alt);border-radius:12px;padding:16px;margin:16px 0;"></div>\n'
    '            <div class="flex gap-6" style="flex-wrap:wrap;">\n'
    '              <button type="submit" class="btn btn-green">Confirm Investment \u2192</button>\n'
    '              <button type="button" class="btn btn-ghost" onclick="cancelPlanInvest()">Cancel</button>\n'
    '            </div>\n'
    '          </form>\n'
    '        </div>\n'
    '        <!-- Active investments list -->\n'
    '        <div class="card mt-6">\n'
    '          <h4 style="margin-bottom:16px;">\U0001f4cb Your Active Investments</h4>\n'
    '          <div id="userInvestments"></div>\n'
    '        </div>\n'
    '      </div>\n\n'
    '      <!-- ===== DEPOSIT ===== -->\n'
)
assert old_invest_end in src, "invest page end marker not found"
src = src.replace(old_invest_end, plans_page, 1)

# ---- 4. Add Rules & Regulations page BEFORE the messages page ----
old_msg_marker = '      <!-- ===== MESSAGES ===== -->\n      <div id="page-messages" class="dash-page hidden">'
rules_page = (
    '      <!-- ===== RULES & REGULATIONS ===== -->\n'
    '      <div id="page-rules" class="dash-page hidden">\n'
    '        <div class="card ev-printable" style="max-width:860px;margin:0 auto;" id="rulesCard">\n'
    '          <div class="ev-print-head">\n'
    '            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">\n'
    '              <div>\n'
    '                <h2 style="margin:0 0 4px;color:var(--brand-navy);">EuroFiducia \u2014 Rules & Regulations</h2>\n'
    '                <p class="text-muted text-sm" style="margin:0;">Effective Date: January 1, 2025 &nbsp;\u00b7&nbsp; Document Version 2.1</p>\n'
    '              </div>\n'
    '              <button class="btn btn-primary btn-sm no-print" onclick="window.print()">\U0001f5a8\ufe0f Print / Save as PDF</button>\n'
    '            </div>\n'
    '          </div>\n'
    '          <div class="ev-print-body" id="rulesContent"></div>\n'
    '          <div class="ev-print-foot no-print" style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);text-align:center;">\n'
    '            <p class="text-muted text-sm">Need a copy? Click <strong>Print / Save as PDF</strong> to save this document. You can also view our <a href="../legal/terms.html">Terms of Service</a> and <a href="../legal/privacy.html">Privacy Policy</a>.</p>\n'
    '          </div>\n'
    '        </div>\n'
    '      </div>\n\n'
    '      <!-- ===== MESSAGES ===== -->\n'
    '      <div id="page-messages" class="dash-page hidden">'
)
assert old_msg_marker in src, "messages page marker not found"
src = src.replace(old_msg_marker, rules_page, 1)

# ---- 5. Update showPage() routes ----
old_showpage = (
    "  if (page==='overview') loadOverview();\n"
    "  if (page==='portfolio') loadPortfolio();\n"
    "  if (page==='invest') loadInvest();\n"
    "  if (page==='deposit') loadDeposit();\n"
)
new_showpage = (
    "  if (page==='overview') loadOverview();\n"
    "  if (page==='portfolio') loadPortfolio();\n"
    "  if (page==='invest') loadInvest();\n"
    "  if (page==='plans') loadPlans();\n"
    "  if (page==='deposit') loadDeposit();\n"
    "  if (page==='rules') loadRules();\n"
)
assert old_showpage in src, "showPage routes not found"
src = src.replace(old_showpage, new_showpage, 1)

# Also update the titles map
old_titles = "messages:'dash_messages',emails:'Email Inbox',sms:'SMS Notifications',support:'dash_support',settings:'dash_settings'};"
new_titles = "messages:'dash_messages',emails:'Email Inbox',sms:'SMS Notifications',support:'dash_support',rules:'Rules & Regulations',plans:'Investment Plans',settings:'dash_settings'};"
assert old_titles in src, "titles map not found"
src = src.replace(old_titles, new_titles, 1)

# ---- 6. Add new loader functions ----
# Insert after the loadInvest() function's closing (right before loadDeposit)
# Find a unique anchor: the line "function loadDeposit() {"
new_functions = r'''
// ===== INVESTMENT PLANS (term-based ROI) =====
function loadPlans() {
  var plans = EV.investPlans.getAll();
  var html = '<div class="cat-grid">';
  plans.forEach(function(p){
    var termLabel = p.termHours < 24 ? p.termHours + 'h' : p.termHours < 720 ? Math.round(p.termHours/24)+' days' : p.termHours < 8760 ? Math.round(p.termHours/720)+' months' : '1 year';
    var fastBadge = p.category === 'fast' ? '<span class="badge badge-success" style="position:absolute;top:12px;right:12px;font-size:0.7rem;">\u26a1 '+p.badge+'</span>' : '<span class="badge badge-info" style="position:absolute;top:12px;right:12px;font-size:0.7rem;">'+p.badge+'</span>';
    var minLabel = p.minAmount >= 200 ? '$' + p.minAmount + ' min' : '$' + p.minAmount + ' min';
    html += '<div class="cat-card" style="position:relative;cursor:pointer;" onclick="openPlanInvest(\''+p.id+'\')">'+
      fastBadge+
      '<div class="cat-icon">'+p.icon+'</div>'+
      '<h3>'+p.name+'</h3>'+
      '<p class="text-muted text-sm" style="min-height:40px;">'+p.desc+'</p>'+
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0;border-top:1px solid var(--border);padding-top:12px;">'+
        '<div><div class="text-muted text-sm">Term</div><strong>'+termLabel+'</strong></div>'+
        '<div><div class="text-muted text-sm">Min. Amount</div><strong>'+minLabel+'</strong></div>'+
      '</div>'+
      '<div style="background:var(--success-light);border-radius:8px;padding:10px;margin-bottom:12px;text-align:center;">'+
        '<div class="text-muted text-sm">ROI (profit)</div>'+
        '<div style="font-size:1.6rem;font-weight:800;color:var(--brand-green);">+'+p.roiPct+'%</div>'+
      '</div>'+
      '<button class="btn btn-green btn-sm btn-block">Invest Now \u2192</button>'+
    '</div>';
  });
  html += '</div>';
  document.getElementById('plansGrid').innerHTML = html;
  loadUserInvestments();
}
function openPlanInvest(planId) {
  var plan = EV.investPlans.getOne(planId);
  if (!plan) return;
  document.getElementById('planInvestId').value = planId;
  document.getElementById('planInvestName').textContent = plan.name;
  document.getElementById('planInvestDesc').textContent = plan.desc;
  var amtInput = document.getElementById('planInvestAmount');
  amtInput.min = plan.minAmount;
  amtInput.placeholder = plan.minAmount.toFixed(2);
  document.getElementById('planInvestMinHint').innerHTML = 'Minimum investment: <strong>$' + plan.minAmount.toFixed(2) + '</strong>. You will earn <strong>+' + plan.roiPct + '%</strong> ROI at maturity (' + (plan.termHours<24 ? plan.termHours+' hours' : Math.round(plan.termHours/24)+' days') + ').';
  document.getElementById('planInvestPreview').style.display = 'none';
  document.getElementById('planInvestCard').style.display = 'block';
  amtInput.oninput = updatePlanPreview;
  document.getElementById('planInvestCard').scrollIntoView({behavior:'smooth',block:'center'});
}
function cancelPlanInvest() {
  document.getElementById('planInvestCard').style.display = 'none';
  document.getElementById('planInvestAmount').value = '';
  document.getElementById('planInvestPreview').style.display = 'none';
}
function updatePlanPreview() {
  var planId = document.getElementById('planInvestId').value;
  var plan = EV.investPlans.getOne(planId);
  if (!plan) return;
  var amount = parseFloat(document.getElementById('planInvestAmount').value);
  var preview = document.getElementById('planInvestPreview');
  if (!amount || amount <= 0) { preview.style.display = 'none'; return; }
  var roi = amount * (plan.roiPct / 100);
  var total = amount + roi;
  var maturity = new Date(Date.now() + plan.termHours * 3600 * 1000);
  var termLabel = plan.termHours < 24 ? plan.termHours + ' hours' : Math.round(plan.termHours/24) + ' days';
  preview.innerHTML = '<h5 style="margin:0 0 10px;color:var(--brand-blue);">\U0001f4ca Investment Summary</h5>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;font-size:0.9rem;">' +
    '<div><span class="text-muted">Principal:</span> <strong>$' + amount.toFixed(2) + '</strong></div>' +
    '<div><span class="text-muted">Plan:</span> <strong>' + plan.name + '</strong></div>' +
    '<div><span class="text-muted">Term:</span> <strong>' + termLabel + '</strong></div>' +
    '<div><span class="text-muted">ROI (' + plan.roiPct + '%):</span> <strong style="color:var(--brand-green);">+$' + roi.toFixed(2) + '</strong></div>' +
    '<div><span class="text-muted">Total Return:</span> <strong style="color:var(--brand-navy);font-size:1.1rem;">$' + total.toFixed(2) + '</strong></div>' +
    '<div><span class="text-muted">Matures:</span> <strong>' + EV.util.formatDate(maturity.toISOString()) + '</strong></div>' +
    '</div>';
  preview.style.display = 'block';
}
function doPlanInvest(e) {
  e.preventDefault();
  var user = EV.auth.currentUser();
  var planId = document.getElementById('planInvestId').value;
  var amount = document.getElementById('planInvestAmount').value;
  var result = EV.investPlans.create(user.id, planId, amount, {source:'dashboard'});
  if (!result) {
    EV.notify.toast('Error', 'Could not create investment. Please try again.', 'danger');
    return false;
  }
  if (result.error) {
    EV.notify.toast('Investment Error', result.error, 'warning');
    return false;
  }
  EV.notify.toast('Investment Confirmed! \U0001f389', 'You invested $' + result.principal.toFixed(2) + ' in ' + result.planName + '. Projected return: $' + result.totalReturn.toFixed(2) + ' at maturity.', 'success');
  // Send confirmation email
  var termLabel = result.planName.indexOf('24')>=0 ? '24 hours' : result.planName.indexOf('48')>=0 ? '48 hours' : Math.round((new Date(result.maturityDate)-new Date(result.startDate))/86400000)+' days';
  EV.mail.send(user.email, 'Investment Confirmed \u2014 ' + result.planName,
    'Dear ' + user.firstName + ',\n\nYour investment has been confirmed.\n\nPlan: ' + result.planName + '\nPrincipal: $' + result.principal.toFixed(2) + '\nROI: +' + result.roiPct + '% ($' + result.roiAmount.toFixed(2) + ')\nTotal Return at Maturity: $' + result.totalReturn.toFixed(2) + '\nStart Date: ' + EV.util.formatDateTime(result.startDate) + '\nMaturity Date: ' + EV.util.formatDateTime(result.maturityDate) + '\nTerm: ' + termLabel + '\n\nYour investment is now active and earning. You will receive a notification when it matures and your returns are credited.\n\nThe gas fee is on us \u2014 every cent of your investment is working for you.\n\nThe EuroFiducia Investment Team',
    {type:'investment_confirmed', userId:user.id});
  if (user.smsOptIn && user.phone) {
    EV.mail.sendSMS(user.phone, 'EuroFiducia: Investment confirmed! ' + result.planName + ' - $' + result.principal.toFixed(2) + ' invested. Projected return: $' + result.totalReturn.toFixed(2) + ' at maturity.', {type:'investment_confirmed', userId:user.id});
  }
  cancelPlanInvest();
  loadUserInvestments();
  loadOverview();
  return false;
}
function loadUserInvestments() {
  var user = EV.auth.currentUser();
  var list = EV.investPlans.listForUser(user.id);
  var html = list.length ? list.map(function(inv){
    var pct = EV.investPlans.progress(inv);
    var now = Date.now();
    var matured = new Date(inv.maturityDate).getTime() <= now;
    var statusBadge = matured ? '<span class="badge badge-success">Matured</span>' : '<span class="badge badge-info">Active \u00b7 ' + pct + '%</span>';
    var progressBar = '<div style="background:var(--bg-alt);border-radius:8px;height:8px;margin:8px 0;overflow:hidden;"><div style="background:linear-gradient(90deg,var(--brand-blue),var(--brand-green));height:100%;width:'+pct+'%;transition:width 0.5s;"></div></div>';
    return '<div style="padding:16px 0;border-bottom:1px solid var(--border);">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">'+
        '<div><strong>'+inv.planName+'</strong>'+
        '<div class="text-muted text-sm">Started: '+EV.util.formatDate(inv.startDate)+' \u00b7 Matures: '+EV.util.formatDate(inv.maturityDate)+'</div>'+
        '</div>'+
        statusBadge+
      '</div>'+
      '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:0.9rem;">'+
        '<div><span class="text-muted">Principal:</span> <strong>$'+inv.principal.toFixed(2)+'</strong></div>'+
        '<div><span class="text-muted">ROI ('+inv.roiPct+'%):</span> <strong style="color:var(--brand-green);">+$'+inv.roiAmount.toFixed(2)+'</strong></div>'+
        '<div><span class="text-muted">Total Return:</span> <strong style="color:var(--brand-navy);">$'+inv.totalReturn.toFixed(2)+'</strong></div>'+
      '</div>'+
      progressBar+
    '</div>';
  }).join('') : '<p class="text-muted text-sm">No active investments yet. Choose a plan above to start earning ROI.</p>';
  var el = document.getElementById('userInvestments');
  if (el) el.innerHTML = html;
}

// ===== RULES & REGULATIONS (printable) =====
function loadRules() {
  var el = document.getElementById('rulesContent');
  if (!el) return;
  if (el.dataset.loaded === '1') return; // already rendered
  el.innerHTML = getRulesContent();
  el.dataset.loaded = '1';
}
function getRulesContent() {
  return '' +
  '<div class="ev-rules-section"><h3>1. Account Opening & Eligibility</h3><p>1.1 EuroFiducia services are available to individuals aged 18 years and above who are legal residents of a supported European country (France, Italy, Germany, Spain, Portugal, Belgium, Netherlands, and other EU/EEA jurisdictions as supported).</p><p>1.2 Each individual may hold only one (1) EuroFiducia account. Multiple accounts registered to the same person may be suspended without notice.</p><p>1.3 All account holders must complete identity verification (KYC) by providing a valid government-issued identification document and proof of address before withdrawals or loan disbursements can be processed.</p><p>1.4 Account credentials (email and password) are confidential. The account holder is responsible for all activity conducted under their account.</p></div>' +
  '<div class="ev-rules-section"><h3>2. Deposits & Funding</h3><p>2.1 The minimum first deposit is \u20ac100.00 (one hundred euros) or the equivalent in the selected payment currency.</p><p>2.2 Accepted deposit methods include cryptocurrency (BTC, USDT, USDC, and others as listed on the deposit page), SEPA bank transfer, card payment (Visa/Mastercard), open banking, and country-specific local payment rails as displayed on the deposit page for the user\u2019s country.</p><p>2.3 <strong>Gas and network fees are covered by EuroFiducia.</strong> The user is not charged blockchain network fees for cryptocurrency deposits or investment-related transactions. EuroFiducia absorbs all gas fees on behalf of its clients.</p><p>2.4 <strong>Auto-activation:</strong> All platform features \u2014 including investing, withdrawals, loan disbursement, portfolio rebalancing, dividend payouts, and real-time analytics \u2014 activate automatically upon confirmation of the user\u2019s first deposit or settlement of the loan processing fee. No further manual activation is required.</p><p>2.5 Deposits must originate from an account or wallet held in the account holder\u2019s own name. Third-party deposits will be rejected and returned to the source.</p><p>2.6 EuroFiducia reserves the right to request additional documentation for any deposit exceeding \u20ac10,000 to comply with anti-money-laundering (AML) regulations.</p></div>' +
  '<div class="ev-rules-section"><h3>3. Investment Plans & Returns</h3><p>3.1 EuroFiducia offers term-based investment plans: 24-Hour Fast Plan, 48-Hour Fast Plan, Weekly Plan, Monthly Plan, Quarterly Plan, and Yearly Plan, each with a templated ROI as displayed on the Investment Plans page.</p><p>3.2 Fast plans (24-hour and 48-hour) require a minimum investment of $200.00. All other plans require a minimum investment of $100.00.</p><p>3.3 The stated ROI percentage represents the profit returned to the investor in addition to the principal, credited upon plan maturity. For example, a 15% ROI on a $200 investment returns $230 total ($200 principal + $30 profit).</p><p>3.4 Investment returns are credited to the account holder\u2019s EuroFiducia balance upon maturity and are available for withdrawal, reinvestment, or transfer in accordance with these rules.</p><p>3.5 Investment plans are non-cancelable once confirmed. Early withdrawal before maturity is not permitted for term-locked plans.</p><p>3.6 EuroFiducia may, at its discretion, adjust ROI rates for new investments. Existing investments retain the ROI rate in effect at the time of confirmation.</p></div>' +
  '<div class="ev-rules-section"><h3>4. Loans & Processing Fees</h3><p>4.1 EuroFiducia offers personal, mortgage, auto, business, student, debt consolidation, home equity, bridge, equipment, credit line, green energy, and medical loans to eligible users.</p><p>4.2 A mandatory processing fee of 5% of the approved loan amount is required before disbursement. This fee is settled in cryptocurrency (BTC or USDT) to the escrow wallet addresses provided upon approval.</p><p>4.3 <strong>Full refund guarantee:</strong> If a loan is not approved or cannot be disbursed, the processing fee is refunded in full within 48 hours.</p><p>4.4 Loan disbursement occurs within 24 hours of fee settlement to the account holder\u2019s verified bank account.</p><p>4.5 All loan repayments are due according to the agreed schedule. Late payments may incur additional charges and affect the account holder\u2019s standing.</p></div>' +
  '<div class="ev-rules-section"><h3>5. Withdrawals</h3><p>5.1 Withdrawals are processed to the account holder\u2019s verified bank account only. Withdrawals to third-party accounts are not permitted.</p><p>5.2 Standard withdrawal processing time is 3\u20135 business days. All withdrawals pass through compliance verification.</p><p>5.3 The minimum withdrawal amount is \u20ac50.00.</p><p>5.4 EuroFiducia does not charge withdrawal fees. Intermediary bank charges, if any, are borne by the receiving bank.</p></div>' +
  '<div class="ev-rules-section"><h3>6. Security & Account Protection</h3><p>6.1 Account holders must maintain the confidentiality of their login credentials and enable two-factor authentication where available.</p><p>6.2 EuroFiducia employs industry-standard encryption, segregated client accounts, and auditable escrow wallets for all client funds.</p><p>6.3 The account holder must notify EuroFiducia immediately of any unauthorized access, suspicious activity, or loss of credentials. EuroFiducia is not liable for losses resulting from the account holder\u2019s failure to safeguard credentials.</p><p>6.4 All cryptocurrency transactions are recorded on-chain with permanent transaction hashes as legal proof of payment.</p></div>' +
  '<div class="ev-rules-section"><h3>7. Compliance & Regulatory</h3><p>7.1 EuroFiducia operates in compliance with applicable European Union financial regulations, including GDPR, AMLD5, and PSD2 directives.</p><p>7.2 EuroFiducia reserves the right to suspend or close accounts suspected of fraudulent activity, money laundering, or violation of these rules.</p><p>7.3 Account holders consent to identity verification, transaction monitoring, and reporting to regulatory authorities as required by law.</p></div>' +
  '<div class="ev-rules-section"><h3>8. Communication & Notifications</h3><p>8.1 EuroFiducia delivers official communications \u2014 including deposit confirmations, investment updates, loan notices, and motivational/educational content \u2014 to the account holder\u2019s registered email address and dashboard inbox.</p><p>8.2 Account holders who opt in to SMS notifications receive alerts to their registered mobile number for deposits, withdrawals, account updates, and motivational messages.</p><p>8.3 Account holders are responsible for keeping their contact information current. EuroFiducia is not liable for communications not received due to outdated contact details.</p></div>' +
  '<div class="ev-rules-section"><h3>9. Prohibited Activities</h3><p>9.1 The following activities are strictly prohibited and may result in immediate account termination: (a) use of the platform for illegal or fraudulent purposes; (b) market manipulation or exploitation of platform features; (c) creating multiple accounts to abuse promotions; (d) sharing account access with unauthorized third parties; (e) reverse-engineering or scraping platform data.</p></div>' +
  '<div class="ev-rules-section"><h3>10. Amendments</h3><p>10.1 EuroFiducia reserves the right to amend these Rules & Regulations at any time. Material changes will be communicated to account holders via email and dashboard notification at least 14 days before taking effect.</p><p>10.2 Continued use of the platform after the effective date of any amendment constitutes acceptance of the revised rules.</p></div>' +
  '<div class="ev-rules-section"><h3>11. Limitation of Liability</h3><p>11.1 EuroFiducia\u2019s liability for any claim arising out of or relating to these rules or the platform is limited to the total amount of fees paid by the account holder to EuroFiducia in the preceding 12 months.</p><p>11.2 EuroFiducia is not liable for indirect, incidental, or consequential damages, or for losses caused by factors outside its reasonable control (including but not limited to blockchain network congestion, third-party bank delays, or regulatory actions).</p></div>' +
  '<div class="ev-rules-section"><h3>12. Governing Law & Disputes</h3><p>12.1 These Rules & Regulations are governed by the laws of the French Republic. Any dispute shall be subject to the exclusive jurisdiction of the courts of Paris, France, unless otherwise required by mandatory consumer protection law.</p><p>12.2 Account holders are encouraged to first contact EuroFiducia support to resolve any dispute amicably before pursuing legal action.</p></div>' +
  '<div style="margin-top:32px;padding-top:16px;border-top:2px solid var(--brand-navy);text-align:center;"><p class="text-sm" style="margin:0;">For questions about these Rules & Regulations, contact <strong>compliance@eurofiducia.eu</strong> or open a support ticket from your dashboard.</p><p class="text-sm text-muted" style="margin:8px 0 0;">\u00a9 2025 EuroFiducia SAS. All rights reserved. Document ID: EV-RR-2025-v2.1</p></div>';
}

// ===== COUNTRY-SPECIFIC DEPOSIT METHODS (rendering) =====
function loadDeposit() {
  var user = EV.auth.currentUser();
  var txs = EV.store.get('user_tx_'+user.id, []);
  var balance = 0;
  txs.forEach(function(tx){ if(tx.type==='deposit')balance+=tx.amount; if(tx.type==='withdrawal')balance-=tx.amount; });
  document.getElementById('depBalance').textContent = EV.util.formatMoney(balance);
  // Render country-specific method overview
  renderCountryDepositMethods(user.country);
  // Populate the method dropdown with country-aware options
  populateDepositMethodDropdown(user.country);
  // Show crypto wallets by default since crypto is the recommended first method
  if (document.getElementById('depMethod') && document.getElementById('depMethod').value === 'Cryptocurrency') {
    renderCryptoWallets();
  }
}
function renderCountryDepositMethods(country) {
  var methods = EV.depositMethods.forCountry(country);
  var countryNames = {FR:'France',IT:'Italy',DE:'Germany',ES:'Spain',PT:'Portugal',BE:'Belgium',NL:'Netherlands',other:'Your Region'};
  var countryName = countryNames[country] || countryNames.other;
  var html = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span class="badge badge-info" style="font-size:0.85rem;">\U0001f310 ' + countryName + '</span><span class="text-muted text-sm">' + methods.length + ' payment methods available</span></div>';
  html += '<div class="ev-deposit-method-grid">';
  methods.forEach(function(m){
    var isCrypto = m.kind === 'crypto';
    var cardStyle = isCrypto ? 'border:2px solid var(--brand-green);background:var(--success-light);' : '';
    var recommendedTag = isCrypto ? '<span class="badge badge-success" style="font-size:0.7rem;margin-left:6px;">Recommended</span>' : '';
    var gasTag = isCrypto ? '<div style="margin-top:6px;font-size:0.8rem;color:var(--brand-green);font-weight:600;">\u26fd Gas fee is ON US</div>' : '';
    html += '<div class="ev-deposit-method-card" style="'+cardStyle+'">'+
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">'+
        '<span style="font-size:1.8rem;">'+m.icon+'</span>'+
        '<div><strong style="font-size:1rem;">'+m.label+recommendedTag+'</strong><div class="text-muted text-sm">'+m.desc+'</div></div>'+
      '</div>'+
      (m.note ? '<div class="text-sm text-muted" style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border);">\u2139\ufe0f '+m.note+'</div>' : '')+
      gasTag+
      ((m.iban && (m.kind==='bank'||m.kind==='openbanking'||m.kind==='local')) ? '<div style="margin-top:8px;font-size:0.85rem;background:var(--bg-alt);border-radius:8px;padding:10px;">'+
        '<div><span class="text-muted">Beneficiary:</span> <strong>'+m.beneficiary+'</strong></div>'+
        '<div><span class="text-muted">Bank:</span> '+m.bankName+'</div>'+
        '<div><span class="text-muted">IBAN:</span> <code style="word-break:break-all;">'+m.iban+'</code></div>'+
        '<div><span class="text-muted">BIC/SWIFT:</span> <code>'+m.bic+'</code></div>'+
        '</div>' : '')+
    '</div>';
  });
  html += '</div>';
  var el = document.getElementById('depositMethodGrid');
  if (el) el.innerHTML = html;
}
function populateDepositMethodDropdown(country) {
  var methods = EV.depositMethods.forCountry(country);
  var sel = document.getElementById('depMethod');
  if (!sel) return;
  var currentVal = sel.value;
  // Build option labels
  var options = methods.map(function(m){
    var label = m.icon + ' ' + m.label;
    if (m.kind === 'crypto') label += ' (Recommended \u2014 instant)';
    return '<option value="'+m.label+'">'+label+'</option>';
  }).join('');
  sel.innerHTML = options;
  // Preserve selection if still valid, else default to crypto
  var stillValid = methods.some(function(m){ return m.label === currentVal; });
  sel.value = stillValid ? currentVal : 'Cryptocurrency';
  onDepositMethodChange();
}
'''
old_load_deposit = "function loadDeposit() {\n  var user = EV.auth.currentUser();\n  var txs = EV.store.get('user_tx_'+user.id, []);\n  var balance = 0;\n  txs.forEach(function(tx){ if(tx.type==='deposit')balance+=tx.amount; if(tx.type==='withdrawal')balance-=tx.amount; });\n  document.getElementById('depBalance').textContent = EV.util.formatMoney(balance);\n  // Show crypto wallets by default since crypto is the recommended first method\n  if (document.getElementById('depMethod') && document.getElementById('depMethod').value === 'Cryptocurrency') {\n    renderCryptoWallets();\n  }\n}\n"
assert old_load_deposit in src, "loadDeposit function not found"
src = src.replace(old_load_deposit, new_functions + "\n", 1)

# ---- 7. Update onDepositMethodChange to also show bank instructions for non-crypto methods ----
old_onchange = (
    "function onDepositMethodChange() {\n"
    "  var method = document.getElementById('depMethod').value;\n"
    "  var box = document.getElementById('cryptoWalletBox');\n"
    "  if (method === 'Cryptocurrency') {\n"
    "    renderCryptoWallets();\n"
    "  } else {\n"
    "    box.innerHTML = '';\n"
    "  }\n"
    "}\n"
)
new_onchange = (
    "function onDepositMethodChange() {\n"
    "  var method = document.getElementById('depMethod').value;\n"
    "  var box = document.getElementById('cryptoWalletBox');\n"
    "  var user = EV.auth.currentUser();\n"
    "  if (method === 'Cryptocurrency') {\n"
    "    renderCryptoWallets();\n"
    "  } else {\n"
    "    // Show bank/local transfer instructions for non-crypto methods\n"
    "    var methods = EV.depositMethods.forCountry(user ? user.country : 'other');\n"
    "    var m = methods.find(function(x){ return x.label === method; });\n"
    "    if (m && (m.iban || m.kind === 'card' || m.kind === 'openbanking' || m.kind === 'local')) {\n"
    "      var html = '<div class=\"card\" style=\"background:var(--info-light);padding:16px;border-radius:8px;\">';\n"
    "      html += '<div style=\"display:flex;align-items:center;gap:10px;margin-bottom:10px;\"><span style=\"font-size:1.6rem;\">'+m.icon+'</span><strong>'+m.label+'</strong></div>';\n"
    "      html += '<p class=\"text-sm\" style=\"margin:0 0 10px;\">'+m.desc+'</p>';\n"
    "      if (m.note) html += '<p class=\"text-sm text-muted\" style=\"margin:0 0 10px;\">\u2139\ufe0f '+m.note+'</p>';\n"
    "      if (m.iban) {\n"
    "        var ref = m.reference ? m.reference.replace('{accountNumber}', (user && user.accountNumber) || 'EV-XXXX') : 'EV-DEP';\n"
    "        html += '<div style=\"background:#fff;border-radius:8px;padding:12px;font-size:0.9rem;\">';\n"
    "        html += '<div style=\"margin-bottom:6px;\"><span class=\"text-muted\">Beneficiary:</span> <strong>'+m.beneficiary+'</strong></div>';\n"
    "        html += '<div style=\"margin-bottom:6px;\"><span class=\"text-muted\">Bank:</span> '+m.bankName+'</div>';\n"
    "        html += '<div style=\"margin-bottom:6px;\"><span class=\"text-muted\">IBAN:</span> <code style=\"word-break:break-all;font-weight:700;\">'+m.iban+'</code></div>';\n"
    "        html += '<div style=\"margin-bottom:6px;\"><span class=\"text-muted\">BIC/SWIFT:</span> <code style=\"font-weight:700;\">'+m.bic+'</code></div>';\n"
    "        html += '<div><span class=\"text-muted\">Reference:</span> <code style=\"font-weight:700;color:var(--brand-blue);\">'+ref+'</code></div>';\n"
    "        html += '</div>';\n"
    "        html += '<p class=\"text-sm text-muted\" style=\"margin:10px 0 0;\">\u26a0\ufe0f Use the reference above so we can match your deposit automatically. Funds arrive in 1\u20132 business days for SEPA, or instantly for local instant rails.</p>';\n"
    "      } else if (m.kind === 'card') {\n"
    "        html += '<p class=\"text-sm text-muted\" style=\"margin:8px 0 0;\">\u26a0\ufe0f A 3-D Secure verification may be required by your bank. Click Confirm Deposit to proceed to the payment gateway.</p>';\n"
    "      } else if (m.kind === 'openbanking') {\n"
    "        html += '<p class=\"text-sm text-muted\" style=\"margin:8px 0 0;\">\u26a0\ufe0f You will be redirected to your bank\u2019s app or website to authorize the payment. No card details are shared with EuroFiducia.</p>';\n"
    "      }\n"
    "      html += '</div>';\n"
    "      box.innerHTML = html;\n"
    "    } else {\n"
    "      box.innerHTML = '';\n"
    "    }\n"
    "  }\n"
    "}\n"
)
assert old_onchange in src, "onDepositMethodChange not found"
src = src.replace(old_onchange, new_onchange, 1)

with io.open(PATH, "w", encoding="utf-8") as f:
    f.write(src)

print("OK - user/dashboard.html patched")
print("New length:", len(src))
