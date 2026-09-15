#!/usr/bin/env python3
"""Patch admin/dashboard.html with:
 - Template editor UI (edit subject/body inline, save via EV.templates.edit, reset)
 - SMS broadcast section on templates page
 - Investment Plans management page (edit ROI/min, reset)
 - Deposit bank details editor on settings page
 - New sidebar items + showAdminPage routes
"""
import io

PATH = "admin/dashboard.html"

with io.open(PATH, "r", encoding="utf-8") as f:
    src = f.read()

# ---- 1. SIDEBAR: add Investment Plans Management + Deposit Settings nav items ----
old_nav = (
    '      <div class="dash-nav-item" onclick="showAdminPage(\'products\')">'
    '<span class="icon">\U0001f4c8</span> <span data-i18n="admin_products">Investments</span></div>\n'
    '      <div class="dash-nav-item" onclick="showAdminPage(\'loans\')">'
    '<span class="icon">\U0001f4b0</span> Loan Management</div>\n'
)
new_nav = (
    '      <div class="dash-nav-item" onclick="showAdminPage(\'products\')">'
    '<span class="icon">\U0001f4c8</span> <span data-i18n="admin_products">Investments</span></div>\n'
    '      <div class="dash-nav-item" onclick="showAdminPage(\'investplans\')">'
    '<span class="icon">\U0001f680</span> Investment Plans</div>\n'
    '      <div class="dash-nav-item" onclick="showAdminPage(\'loans\')">'
    '<span class="icon">\U0001f4b0</span> Loan Management</div>\n'
)
assert old_nav in src, "admin nav products/loans block not found"
src = src.replace(old_nav, new_nav, 1)

# ---- 2. Update showAdminPage routes + adminTitles ----
old_show = (
    "  if(page==='templates')loadTemplates();\n"
    "  if(page==='messages')loadMessaging();\n"
)
new_show = (
    "  if(page==='templates')loadTemplates();\n"
    "  if(page==='messages')loadMessaging();\n"
    "  if(page==='investplans')loadAdminInvestPlans();\n"
    "  if(page==='settings')loadDepositBankEditor();\n"
)
assert old_show in src, "showAdminPage routes not found"
src = src.replace(old_show, new_show, 1)

# Also update settings route that already exists - add loadDepositBankEditor
old_settings_route = "  if (page === 'settings' && typeof loadAdminBackendURL === 'function') loadAdminBackendURL();\n"
new_settings_route = (
    "  if (page === 'settings' && typeof loadAdminBackendURL === 'function') loadAdminBackendURL();\n"
    "  if (page === 'settings' && typeof loadDepositBankEditor === 'function') loadDepositBankEditor();\n"
)
assert old_settings_route in src, "settings route not found"
src = src.replace(old_settings_route, new_settings_route, 1)

# Update adminTitles map
old_titles = (
    "var adminTitles = {\n"
    "  overview:'Dashboard Overview',pending:'Pending Account Verification',users:'User Management',generate:'Generate Transactions',\n"
    "  transactions:'All Transactions',templates:'Motivational Email Templates',messages:'Messaging Center',support:'Support Inbox',\n"
    "  compliance:'Compliance Center',products:'Investment Products',loans:'Loan Management',emaillog:'Email & SMS Log',\n"
    "  reports:'Reports',settings:'Admin Settings'\n"
    "};\n"
)
new_titles = (
    "var adminTitles = {\n"
    "  overview:'Dashboard Overview',pending:'Pending Account Verification',users:'User Management',generate:'Generate Transactions',\n"
    "  transactions:'All Transactions',templates:'Motivational Email Templates',messages:'Messaging Center',support:'Support Inbox',\n"
    "  compliance:'Compliance Center',products:'Investment Products',investplans:'Investment Plans Management',loans:'Loan Management',emaillog:'Email & SMS Log',\n"
    "  reports:'Reports',settings:'Admin Settings'\n"
    "};\n"
)
assert old_titles in src, "adminTitles not found"
src = src.replace(old_titles, new_titles, 1)

# ---- 3. Add template editor section to the templates page ----
# Insert an editor panel right after the preview div, before the "3. Select Recipients" card
old_tpl_preview_end = (
    '            <div id="templatePreview" class="template-preview" style="color:var(--text-secondary);font-style:italic;">\n'
    '              Select a template from the left to see a preview here.\n'
    '            </div>\n'
    '\n'
    '            <div class="card mt-6">\n'
    '              <h4 style="margin-bottom:16px;">3. Select Recipients</h4>\n'
)
new_tpl_preview_end = (
    '            <div id="templatePreview" class="template-preview" style="color:var(--text-secondary);font-style:italic;">\n'
    '              Select a template from the left to see a preview here.\n'
    '            </div>\n'
    '\n'
    '            <!-- Template Editor (edit subject/body, persists via EV.templates.edit) -->\n'
    '            <div class="card mt-6" id="tplEditorCard" style="display:none;border:2px solid var(--brand-blue);">\n'
    '              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">\n'
    '                <h4 style="margin:0;">\u270f\ufe0f Edit Template</h4>\n'
    '                <div>\n'
    '                  <button class="btn btn-ghost btn-sm" onclick="resetTemplate()">\u21ba Reset to Default</button>\n'
    '                  <button class="btn btn-ghost btn-sm" onclick="closeTplEditor()">\u2715 Close Editor</button>\n'
    '                </div>\n'
    '              </div>\n'
    '              <p class="text-muted text-sm" style="margin:0 0 16px;">Edit the subject and message body below. Changes are saved permanently and used in all future sends. Use <code>{name}</code> as a placeholder for the recipient\'s name. Click <strong>Save Changes</strong> to persist.</p>\n'
    '              <div class="form-group">\n'
    '                <label class="form-label">Template Name</label>\n'
    '                <input type="text" class="form-input" id="tplEditName" readonly style="background:var(--bg-alt);">\n'
    '              </div>\n'
    '              <div class="form-group">\n'
    '                <label class="form-label">Subject Line</label>\n'
    '                <input type="text" class="form-input" id="tplEditSubject">\n'
    '              </div>\n'
    '              <div class="form-group">\n'
    '                <label class="form-label">Message Body (use {name} for personalization)</label>\n'
    '                <textarea class="form-textarea" id="tplEditBody" rows="10"></textarea>\n'
    '              </div>\n'
    '              <div class="flex gap-2" style="flex-wrap:wrap;">\n'
    '                <button class="btn btn-green" onclick="saveTemplateEdit()">\u2705 Save Changes</button>\n'
    '                <button class="btn btn-ghost" onclick="resetTemplate()">\u21ba Reset to Default</button>\n'
    '                <button class="btn btn-ghost" onclick="closeTplEditor()">Cancel</button>\n'
    '              </div>\n'
    '            </div>\n'
    '\n'
    '            <!-- SMS Broadcast section -->\n'
    '            <div class="card mt-6" style="border-left:4px solid var(--brand-green);">\n'
    '              <h4 style="margin-bottom:4px;">\U0001f4f1 Motivational SMS Broadcast</h4>\n'
    '              <p class="text-muted text-sm" style="margin-bottom:16px;">Send a short motivational SMS to all users who opted in to SMS notifications. SMS is delivered to their registered phone number. Use <code>{name}</code> for personalization (keep under 160 characters).</p>\n'
    '              <div class="form-group">\n'
    '                <label class="form-label">SMS Message <span class="text-muted text-sm" id="smsCharCount">(0 / 160)</span></label>\n'
    '                <textarea class="form-textarea" id="smsBroadcastText" rows="3" maxlength="320" placeholder="e.g. Hi {name}, your EuroFiducia portfolio is growing! Start your 24-hour fast plan today and earn +15% ROI by tomorrow. The gas fee is on us! \u2014 EuroFiducia" oninput="updateSMSCharCount()"></textarea>\n'
    '              </div>\n'
    '              <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">\n'
    '                <button class="btn btn-green btn-lg" onclick="broadcastSMS()">\U0001f4f2 Send SMS to All Opted-In Users</button>\n'
    '                <span class="text-muted text-sm" id="smsOptInCount"></span>\n'
    '              </div>\n'
    '            </div>\n'
    '\n'
    '            <div class="card mt-6">\n'
    '              <h4 style="margin-bottom:16px;">3. Select Recipients</h4>\n'
)
assert old_tpl_preview_end in src, "template preview end not found"
src = src.replace(old_tpl_preview_end, new_tpl_preview_end, 1)

# Also add an "Edit" button to the template selection. Modify loadTemplates rendering.
old_load_templates = (
    '  var html = EV.emailTemplates.map(function(tpl){\n'
    '    return \'<div class="template-card" id="tplCard_\'+tpl.id+\'" onclick="selectTemplate(\\\'\'+tpl.id+\'\\\')">\'+\n'
    '      \'<div class="flex justify-between items-center"><div><span class="tpl-icon">\'+tpl.icon+\'</span> <strong>\'+tpl.name+\'</strong></div></div>\'+\n'
    '      \'<p class="text-muted text-sm mt-2" style="margin:8px 0 0;">\'+tpl.subject+\'</p>\'+\n'
    '    \'</div>\';\n'
    '  }).join(\'\');\n'
)
new_load_templates = (
    '  var html = EV.emailTemplates.map(function(tpl){\n'
    '    var editedBadge = EV.templates.getOne(tpl.id) && EV.store.get(\'edited_email_templates\',{})[tpl.id] ? \' <span class="badge badge-success" style="font-size:0.6rem;">Edited</span>\' : \'\';\n'
    '    return \'<div class="template-card" id="tplCard_\'+tpl.id+\'" onclick="selectTemplate(\\\'\'+tpl.id+\'\\\')">\'+\n'
    '      \'<div class="flex justify-between items-center"><div><span class="tpl-icon">\'+tpl.icon+\'</span> <strong>\'+tpl.name+\'</strong>\'+editedBadge+\'</div><button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openTplEditor(\\\'\'+tpl.id+\'\\\')">\u270f\ufe0f</button></div>\'+\n'
    '      \'<p class="text-muted text-sm mt-2" style="margin:8px 0 0;">\'+tpl.subject+\'</p>\'+\n'
    '    \'</div>\';\n'
    '  }).join(\'\');\n'
)
assert old_load_templates in src, "loadTemplates template list render not found"
src = src.replace(old_load_templates, new_load_templates, 1)

# ---- 4. Add Investment Plans Management page BEFORE the settings page ----
old_settings_page = '      <div id="apage-settings" class="dash-page hidden">\n'
investplans_page = (
    '      <!-- ===== INVESTMENT PLANS MANAGEMENT ===== -->\n'
    '      <div id="apage-investplans" class="dash-page hidden">\n'
    '        <div class="card mb-6">\n'
    '          <h3>\U0001f680 Investment Plans Management</h3>\n'
    '          <p class="text-muted text-sm mt-2">Edit the ROI percentage, minimum amount, and description for each term-based investment plan. Changes are saved permanently and reflected on the user dashboard immediately. Click <strong>Reset All</strong> to restore default values.</p>\n'
    '        </div>\n'
    '        <div id="adminPlansGrid"></div>\n'
    '        <div class="card mt-6" style="text-align:center;">\n'
    '          <button class="btn btn-ghost" onclick="resetAllInvestPlans()">\u21ba Reset All Plans to Defaults</button>\n'
    '        </div>\n'
    '      </div>\n\n'
    '      <div id="apage-settings" class="dash-page hidden">\n'
)
assert old_settings_page in src, "settings page marker not found"
src = src.replace(old_settings_page, investplans_page, 1)

# ---- 5. Add deposit bank details editor to settings page ----
# Insert after the crypto wallet "Add new wallet" section, before the Email Notifications divider
old_email_notif = (
    '          <div class="divider"></div>\n'
    '          <h4 style="margin-bottom:16px;">Email Notifications</h4>\n'
)
bank_editor = (
    '          <div class="divider"></div>\n'
    '          <h4 style="margin-bottom:4px;">\U0001f3eb Deposit Bank Details (SEPA / Wire)</h4>\n'
    '          <p class="text-muted text-sm" style="margin-bottom:16px;">These bank beneficiary details are shown to users on the deposit page for SEPA transfers, local bank rails, and country-specific methods. Edit the fields below and click <strong>Save Bank Details</strong> to persist changes across all devices.</p>\n'
    '          <div id="depositBankEditor"></div>\n'
    '          <div class="divider"></div>\n'
    '          <h4 style="margin-bottom:16px;">Email Notifications</h4>\n'
)
assert old_email_notif in src, "email notifications section not found"
src = src.replace(old_email_notif, bank_editor, 1)

# ---- 6. Add new functions: template editor, SMS broadcast, invest plans mgmt, bank editor ----
# Insert after the sendTemplate() function
old_send_tpl_end = (
    "    'success');\n"
    "}\n\n"
    "// ===== MESSAGING =====\n"
)
new_functions_block = r'''    'success');
}

// ===== TEMPLATE EDITOR =====
function openTplEditor(tplId) {
  var tpl = EV.templates.getOne(tplId);
  if (!tpl) return;
  selectTemplate(tplId);
  document.getElementById('tplEditName').value = tpl.name;
  document.getElementById('tplEditSubject').value = tpl.subject;
  document.getElementById('tplEditBody').value = tpl.body;
  document.getElementById('tplEditorCard').style.display = 'block';
  document.getElementById('tplEditorCard').scrollIntoView({behavior:'smooth',block:'center'});
}
function closeTplEditor() {
  document.getElementById('tplEditorCard').style.display = 'none';
}
function saveTemplateEdit() {
  if (!selectedTemplate) { EV.notify.toast('Error','Select a template first','danger'); return; }
  var name = document.getElementById('tplEditName').value;
  var subject = document.getElementById('tplEditSubject').value.trim();
  var body = document.getElementById('tplEditBody').value.trim();
  if (!subject || !body) { EV.notify.toast('Error','Subject and body cannot be empty','danger'); return; }
  EV.templates.edit(selectedTemplate.id, {subject: subject, body: body});
  EV.notify.toast('Template Saved! \u2705', 'Changes to "' + selectedTemplate.name + '" have been saved permanently.', 'success');
  selectedTemplate = EV.templates.getOne(selectedTemplate.id);
  selectTemplate(selectedTemplate.id);
  loadTemplates();
  closeTplEditor();
}
function resetTemplate() {
  if (!selectedTemplate) { EV.notify.toast('Error','Select a template first','danger'); return; }
  EV.templates.reset(selectedTemplate.id);
  EV.notify.toast('Template Reset \u21ba', '"' + selectedTemplate.name + '" has been restored to its default content.', 'info');
  selectedTemplate = EV.templates.getOne(selectedTemplate.id);
  selectTemplate(selectedTemplate.id);
  loadTemplates();
  closeTplEditor();
}

// ===== SMS BROADCAST =====
function updateSMSCharCount() {
  var text = document.getElementById('smsBroadcastText').value || '';
  var el = document.getElementById('smsCharCount');
  if (el) el.textContent = '(' + text.length + ' / 160)';
  // Update opted-in count
  var users = EV.store.get('users', []);
  var optedIn = users.filter(function(u){ return u.smsOptIn && u.phone; }).length;
  var countEl = document.getElementById('smsOptInCount');
  if (countEl) countEl.textContent = optedIn + ' user(s) opted in to SMS';
}
function broadcastSMS() {
  var text = document.getElementById('smsBroadcastText').value.trim();
  if (!text) { EV.notify.toast('Error','Please enter an SMS message','danger'); return; }
  if (text.length > 320) { EV.notify.toast('Message Too Long','SMS should be under 160 characters (max 320 allowed).','warning'); return; }
  var users = EV.store.get('users', []);
  var optedIn = users.filter(function(u){ return u.smsOptIn && u.phone; });
  if (optedIn.length === 0) { EV.notify.toast('No Recipients','No users have opted in to SMS notifications yet.','warning'); return; }
  var sent = 0;
  optedIn.forEach(function(u){
    var msg = text.replace(/{name}/g, u.firstName);
    EV.mail.sendSMS(u.phone, msg, {type:'motivational_sms', userId:u.id, isMotivational:true});
    sent++;
  });
  // Log as admin message
  var adminMsgs = EV.store.get('admin_messages', []);
  adminMsgs.push({
    id: 'AM'+Date.now(),
    subject: '[SMS Broadcast] Motivational SMS',
    body: text,
    target: 'sms_optin',
    count: sent,
    time: new Date().toISOString(),
    isMotivational: true,
    channel: 'sms'
  });
  EV.store.set('admin_messages', adminMsgs);
  EV.notify.toast('SMS Broadcast Sent! \U0001f4f2', 'Motivational SMS delivered to ' + sent + ' opted-in user(s).', 'success');
  document.getElementById('smsBroadcastText').value = '';
  updateSMSCharCount();
}

// ===== INVESTMENT PLANS MANAGEMENT =====
function loadAdminInvestPlans() {
  var plans = EV.investPlans.getAll();
  var html = '<div class="cat-grid">';
  plans.forEach(function(p){
    var termLabel = p.termHours < 24 ? p.termHours + 'h' : p.termHours < 720 ? Math.round(p.termHours/24)+' days' : p.termHours < 8760 ? Math.round(p.termHours/720)+' months' : '1 year';
    var editedBadge = EV.store.get('edited_invest_plans',{})[p.id] ? ' <span class="badge badge-success" style="font-size:0.6rem;">Edited</span>' : '';
    html += '<div class="cat-card" style="position:relative;">'+
      '<div style="position:absolute;top:12px;right:12px;"><span class="badge badge-info" style="font-size:0.7rem;">'+p.badge+'</span>'+editedBadge+'</div>'+
      '<div class="cat-icon">'+p.icon+'</div>'+
      '<h3>'+p.name+'</h3>'+
      '<p class="text-muted text-sm">Term: <strong>'+termLabel+'</strong></p>'+
      '<div class="form-group" style="margin-top:12px;">'+
        '<label class="form-label">ROI % (profit)</label>'+
        '<input type="number" class="form-input" id="planRoi_'+p.id+'" value="'+p.roiPct+'" step="0.1" min="0">'+
      '</div>'+
      '<div class="form-group">'+
        '<label class="form-label">Min. Amount ($)</label>'+
        '<input type="number" class="form-input" id="planMin_'+p.id+'" value="'+p.minAmount+'" step="1" min="1">'+
      '</div>'+
      '<div class="form-group">'+
        '<label class="form-label">Description</label>'+
        '<textarea class="form-textarea" id="planDesc_'+p.id+'" rows="3" style="font-size:0.85rem;">'+p.desc+'</textarea>'+
      '</div>'+
      '<div class="flex gap-2" style="flex-wrap:wrap;">'+
        '<button class="btn btn-green btn-sm btn-block" onclick="saveAdminPlan(\''+p.id+'\')">\u2705 Save</button>'+
        '<button class="btn btn-ghost btn-sm btn-block" onclick="resetAdminPlan(\''+p.id+'\')">\u21ba Reset</button>'+
      '</div>'+
    '</div>';
  });
  html += '</div>';
  document.getElementById('adminPlansGrid').innerHTML = html;
}
function saveAdminPlan(planId) {
  var roi = parseFloat(document.getElementById('planRoi_'+planId).value);
  var minAmt = parseFloat(document.getElementById('planMin_'+planId).value);
  var desc = document.getElementById('planDesc_'+planId).value.trim();
  if (isNaN(roi) || roi < 0) { EV.notify.toast('Error','ROI must be a positive number','danger'); return; }
  if (isNaN(minAmt) || minAmt < 1) { EV.notify.toast('Error','Minimum amount must be at least $1','danger'); return; }
  var changes = {roiPct: roi, minAmount: minAmt};
  if (desc) changes.desc = desc;
  EV.investPlans.edit(planId, changes);
  var plan = EV.investPlans.getOne(planId);
  EV.notify.toast('Plan Saved! \u2705', '"' + plan.name + '" updated \u2014 ROI: +' + roi + '%, Min: $' + minAmt, 'success');
  loadAdminInvestPlans();
}
function resetAdminPlan(planId) {
  EV.investPlans.reset(planId);
  var plan = EV.investPlans.getOne(planId);
  EV.notify.toast('Plan Reset \u21ba', '"' + plan.name + '" restored to default values.', 'info');
  loadAdminInvestPlans();
}
function resetAllInvestPlans() {
  if (!confirm('Reset ALL investment plans to their default values? This cannot be undone.')) return;
  EV.investPlans.resetAll();
  EV.notify.toast('All Plans Reset \u21ba', 'All investment plans have been restored to defaults.', 'info');
  loadAdminInvestPlans();
}

// ===== DEPOSIT BANK DETAILS EDITOR =====
function loadDepositBankEditor() {
  var bank = EV.depositMethods.getBank();
  var el = document.getElementById('depositBankEditor');
  if (!el) return;
  el.innerHTML = ''+
    '<div class="grid-2" style="gap:12px;">'+
      '<div class="form-group"><label class="form-label">Beneficiary Name</label><input type="text" class="form-input" id="bankBeneficiary" value="'+(bank.beneficiary||'')+'"></div>'+
      '<div class="form-group"><label class="form-label">Bank Name</label><input type="text" class="form-input" id="bankName" value="'+(bank.bankName||'')+'"></div>'+
      '<div class="form-group"><label class="form-label">IBAN</label><input type="text" class="form-input" id="bankIban" value="'+(bank.iban||'')+'" style="font-family:monospace;"></div>'+
      '<div class="form-group"><label class="form-label">BIC / SWIFT</label><input type="text" class="form-input" id="bankBic" value="'+(bank.bic||'')+'" style="font-family:monospace;"></div>'+
      '<div class="form-group"><label class="form-label">Reference Prefix</label><input type="text" class="form-input" id="bankRefPrefix" value="'+(bank.referencePrefix||'')+'" style="font-family:monospace;"><p class="text-sm text-muted" style="margin:6px 0 0;">Used to generate unique deposit references (prefix + account number).</p></div>'+
    '</div>'+
    '<div class="flex gap-2" style="flex-wrap:wrap;margin-top:12px;">'+
      '<button class="btn btn-green" onclick="saveDepositBank()">\u2705 Save Bank Details</button>'+
      '<button class="btn btn-ghost" onclick="resetDepositBank()">\u21ba Reset to Default</button>'+
    '</div>';
}
function saveDepositBank() {
  var bank = {
    beneficiary: document.getElementById('bankBeneficiary').value.trim(),
    bankName: document.getElementById('bankName').value.trim(),
    iban: document.getElementById('bankIban').value.trim(),
    bic: document.getElementById('bankBic').value.trim(),
    referencePrefix: document.getElementById('bankRefPrefix').value.trim() || 'EV-DEP'
  };
  if (!bank.beneficiary || !bank.iban) { EV.notify.toast('Error','Beneficiary name and IBAN are required','danger'); return; }
  EV.depositMethods.saveBank(bank);
  EV.notify.toast('Bank Details Saved! \u2705', 'Deposit bank details have been updated and will appear on all users\' deposit pages.', 'success');
}
function resetDepositBank() {
  EV.depositMethods.resetBank();
  EV.notify.toast('Bank Details Reset \u21ba', 'Deposit bank details restored to defaults.', 'info');
  loadDepositBankEditor();
}

// ===== MESSAGING =====
'''
assert old_send_tpl_end in src, "sendTemplate end marker not found"
src = src.replace(old_send_tpl_end, new_functions_block, 1)

# ---- 7. Update loadTemplates to also init SMS char count ----
old_load_templates_start = "function loadTemplates() {\n  // Populate multi-select\n"
new_load_templates_start = "function loadTemplates() {\n  updateSMSCharCount();\n  // Populate multi-select\n"
assert old_load_templates_start in src, "loadTemplates start not found"
src = src.replace(old_load_templates_start, new_load_templates_start, 1)

with io.open(PATH, "w", encoding="utf-8") as f:
    f.write(src)

print("OK - admin/dashboard.html patched")
print("New length:", len(src))
