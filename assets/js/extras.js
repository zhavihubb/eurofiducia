/* ===== EuroFiducia Extras — Market Ticker + Cookie Consent ===== */
(function() {
  'use strict';

  // ===== MARKET TICKER =====
  function initMarketTicker() {
    var ticker = document.getElementById('marketTicker');
    if (!ticker) return;

    var instruments = [
      { name: 'CAC 40', val: 7587.42, unit: '', dp: 2 },
      { name: 'FTSE MIB', val: 33280.15, unit: '', dp: 2 },
      { name: 'DAX 40', val: 18724.68, unit: '', dp: 2 },
      { name: 'EUR/USD', val: 1.0852, unit: '', dp: 4 },
      { name: 'EUR/GBP', val: 0.8534, unit: '', dp: 4 },
      { name: 'Gold', val: 2418.50, unit: '$', dp: 2 },
      { name: 'Brent Oil', val: 82.37, unit: '$', dp: 2 },
      { name: 'BTC/EUR', val: 64250.00, unit: '€', dp: 0 },
      { name: 'ETH/EUR', val: 3180.45, unit: '€', dp: 2 },
      { name: 'US 10Y', val: 4.285, unit: '', dp: 3, suffix: '%' },
      { name: 'Bund 10Y', val: 2.412, unit: '', dp: 3, suffix: '%' },
      { name: 'BTP 10Y', val: 3.768, unit: '', dp: 3, suffix: '%' }
    ];

    // Random starting changes
    instruments.forEach(function(inst) {
      inst.chg = (Math.random() * 2 - 1) * (inst.name.indexOf('/') >= 0 ? 0.8 : 1.5);
      inst.suffix = inst.suffix || '';
    });

    function formatVal(inst) {
      return inst.unit + inst.val.toFixed(inst.dp) + inst.suffix;
    }
    function formatChg(inst) {
      var pct = (inst.chg / inst.val * 100);
      var sign = pct >= 0 ? '+' : '';
      return sign + pct.toFixed(2) + '%';
    }

    function render() {
      var html = instruments.map(function(inst) {
        var cls = inst.chg >= 0 ? 'up' : 'down';
        return '<span class="ticker-item"><span class="tkr-name">' + inst.name + '</span><span class="tkr-val">' + formatVal(inst) + '</span><span class="tkr-chg ' + cls + '">' + formatChg(inst) + '</span></span>';
      }).join('');
      // Duplicate for seamless loop
      ticker.innerHTML = '<div class="ticker-track">' + html + html + '</div>';
    }

    function updatePrices() {
      instruments.forEach(function(inst) {
        // Small random walk
        var volatility = inst.name.indexOf('/') >= 0 ? 0.003 : 0.0015;
        var change = inst.val * volatility * (Math.random() * 2 - 1);
        inst.val = Math.max(0.01, inst.val + change);
        inst.chg = inst.chg + change;
        // Decay old change slightly
        inst.chg = inst.chg * 0.95;
      });
      render();
    }

    render();
    setInterval(updatePrices, 8000);
  }

  // ===== COOKIE CONSENT =====
  function initCookieConsent() {
    if (localStorage.getItem('ev_cookie_consent')) return;
    var existing = document.querySelector('.cookie-consent');
    if (existing) {
      setTimeout(function() { existing.classList.add('show'); }, 1500);
      return;
    }
  }

  function acceptCookies() {
    localStorage.setItem('ev_cookie_consent', 'accepted');
    var el = document.querySelector('.cookie-consent');
    if (el) el.classList.remove('show');
  }
  function declineCookies() {
    localStorage.setItem('ev_cookie_consent', 'declined');
    var el = document.querySelector('.cookie-consent');
    if (el) el.classList.remove('show');
  }

  // Expose for inline onclick handlers
  window.EVExtras = {
    acceptCookies: acceptCookies,
    declineCookies: declineCookies
  };

  // Initialize on DOM ready
  function init() {
    initMarketTicker();
    initCookieConsent();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===== FAQ ACCORDION (global) ===== */
window.toggleFaq = function(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
};

/* ===== COUNT-UP STATS ===== */
function initCountUp() {
  var els = document.querySelectorAll('.count-up');
  if (!els.length) return;
  var animate = function(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  els.forEach(function(el) { observer.observe(el); });
}
document.addEventListener('DOMContentLoaded', initCountUp);
if (document.readyState === 'interactive' || document.readyState === 'complete') initCountUp();
