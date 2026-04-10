/* ═══════════════════════════════════════════════════════════════
   SolidBud Ltd — Kalkulator JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const VAT_RATE = 0.20;

  // ─── Definicja usług ───────────────────────────────────────
  // unit: 'm2' | 'mb' | 'szt'
  const SERVICES = [
    {
      id: 'malowanie',
      group: 'Wykończenie wnętrz',
      name: 'Malowanie',
      desc: 'Malowanie ścian i sufitów — 2 warstwy',
      price: 8,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'gipsowanie',
      group: 'Wykończenie wnętrz',
      name: 'Gipsowanie / tynkowanie',
      desc: 'Gładź gipsowa, wyrównanie ścian',
      price: 15,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'plytki',
      group: 'Wykończenie wnętrz',
      name: 'Układanie płytek',
      desc: 'Glazura / terakota, fugowanie',
      price: 35,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'biala_zabudowa',
      group: 'Wykończenie wnętrz',
      name: 'Biała zabudowa',
      desc: 'Montaż zabudowy meblowej / szaf wnękowych',
      price: 150,
      unit: 'mb',
      unitLabel: 'm.b.'
    },
    {
      id: 'karpety',
      group: 'Podłogi',
      name: 'Wykładzina / karpety',
      desc: 'Układanie wykładziny dywanowej',
      price: 12,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'panele',
      group: 'Podłogi',
      name: 'Panele podłogowe',
      desc: 'Montaż paneli laminowanych / drewnianych',
      price: 15,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'gumolit',
      group: 'Podłogi',
      name: 'Gumolit / winyl',
      desc: 'Wykładzina PVC, gumolit przemysłowy',
      price: 18,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'elewacja',
      group: 'Prace zewnętrzne',
      name: 'Elewacja zewnętrzna',
      desc: 'Tynk elewacyjny, ocieplenie, malowanie',
      price: 45,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'deking',
      group: 'Prace zewnętrzne',
      name: 'Deking',
      desc: 'Taras drewniany / kompozytowy',
      price: 55,
      unit: 'm2',
      unitLabel: 'm²'
    },
    {
      id: 'kuchnia',
      group: 'Inne usługi',
      name: 'Montaż kuchni',
      desc: 'Złożenie i montaż mebli kuchennych',
      price: 500,
      unit: 'szt',
      unitLabel: 'kuchnia'
    }
  ];

  // ─── Stan ──────────────────────────────────────────────────
  const state = {};
  SERVICES.forEach(function (s) {
    state[s.id] = { active: false, qty: 0 };
  });

  // ─── Render kart usług ─────────────────────────────────────
  function renderCards() {
    const container = document.getElementById('calc-services');
    if (!container) return;

    // Grupuj usługi
    const groups = {};
    SERVICES.forEach(function (s) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    });

    Object.keys(groups).forEach(function (groupName) {
      const groupEl = document.createElement('div');
      groupEl.className = 'calc-group';

      const titleEl = document.createElement('h3');
      titleEl.className = 'calc-group-title';
      titleEl.textContent = groupName;
      groupEl.appendChild(titleEl);

      groups[groupName].forEach(function (s) {
        groupEl.appendChild(buildCard(s));
      });

      container.appendChild(groupEl);
    });
  }

  function buildCard(s) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.id = 'card-' + s.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', 'false');

    // Checkbox icon
    card.innerHTML =
      '<div class="service-check" aria-hidden="true">' +
        '<svg width="13" height="10" viewBox="0 0 13 10" fill="none">' +
          '<path d="M1 5L4.5 8.5L11.5 1" stroke="#0a0a0f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</div>' +
      '<div class="service-info">' +
        '<div class="service-name">' + s.name + '</div>' +
        '<div class="service-unit-price">' + s.desc + ' — £' + s.price.toFixed(2) + ' / ' + s.unitLabel + '</div>' +
      '</div>' +
      '<div class="service-qty">' +
        '<label for="qty-' + s.id + '">' + s.unitLabel + '</label>' +
        '<input type="number" id="qty-' + s.id + '" min="0" step="0.5" value="" placeholder="0" disabled />' +
      '</div>';

    // Click / keyboard to toggle
    function toggleCard(e) {
      // Don't toggle when clicking the input directly
      if (e.target && e.target.tagName === 'INPUT') return;
      toggle(s.id);
    }

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(s.id);
      }
    });

    // Input change
    const input = card.querySelector('input');
    input.addEventListener('input', function () {
      var val = parseFloat(this.value);
      state[s.id].qty = isNaN(val) || val < 0 ? 0 : val;
      updateSummary();
    });

    return card;
  }

  // ─── Toggle usługi ─────────────────────────────────────────
  function toggle(id) {
    state[id].active = !state[id].active;

    const card = document.getElementById('card-' + id);
    const input = document.getElementById('qty-' + id);

    if (state[id].active) {
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      input.disabled = false;
      input.focus();
      if (!state[id].qty) state[id].qty = 0;
    } else {
      card.classList.remove('active');
      card.setAttribute('aria-pressed', 'false');
      input.disabled = true;
      input.value = '';
      state[id].qty = 0;
    }

    updateSummary();
  }

  // ─── Aktualizacja podsumowania ─────────────────────────────
  function updateSummary() {
    const itemsEl = document.getElementById('summary-items');
    const emptyEl = document.getElementById('summary-empty');
    const nettoEl = document.getElementById('summary-netto');
    const vatEl   = document.getElementById('summary-vat');
    const bruttoEl = document.getElementById('summary-brutto');

    const active = SERVICES.filter(function (s) { return state[s.id].active; });

    if (active.length === 0) {
      itemsEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      nettoEl.textContent  = '£0.00';
      vatEl.textContent    = '£0.00';
      bruttoEl.textContent = '£0.00';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    itemsEl.innerHTML = '';

    var netto = 0;

    active.forEach(function (s) {
      var qty  = state[s.id].qty || 0;
      var line = s.price * qty;
      netto   += line;

      // Update line total on card
      var cardEl = document.getElementById('card-' + s.id);
      var lineEl = cardEl.querySelector('.service-line-total');
      if (!lineEl) {
        lineEl = document.createElement('span');
        lineEl.className = 'service-line-total';
        cardEl.appendChild(lineEl);
      }
      lineEl.textContent = qty > 0 ? '£' + line.toFixed(2) : '—';

      // Summary row
      var row = document.createElement('div');
      row.className = 'summary-item';
      row.innerHTML =
        '<span class="summary-item-name">' + s.name + '</span>' +
        '<span class="summary-item-qty">' + (qty > 0 ? qty + ' ' + s.unitLabel : '—') + '</span>' +
        '<span class="summary-item-val">' + (qty > 0 ? '£' + line.toFixed(2) : '—') + '</span>';
      itemsEl.appendChild(row);
    });

    var vat    = netto * VAT_RATE;
    var brutto = netto + vat;

    nettoEl.textContent  = '£' + netto.toFixed(2);
    vatEl.textContent    = '£' + vat.toFixed(2);
    bruttoEl.textContent = '£' + brutto.toFixed(2);
  }

  // ─── Reset ─────────────────────────────────────────────────
  function resetAll() {
    SERVICES.forEach(function (s) {
      state[s.id] = { active: false, qty: 0 };
      var card  = document.getElementById('card-' + s.id);
      var input = document.getElementById('qty-' + s.id);
      if (card)  { card.classList.remove('active'); card.setAttribute('aria-pressed', 'false'); }
      if (input) { input.disabled = true; input.value = ''; }
      // remove line total
      var cardEl = document.getElementById('card-' + s.id);
      var lineEl = cardEl && cardEl.querySelector('.service-line-total');
      if (lineEl) lineEl.textContent = '';
    });
    updateSummary();
  }

  // ─── Drukuj ────────────────────────────────────────────────
  function printQuote() {
    window.print();
  }

  // ─── Kopiuj / Wyślij ──────────────────────────────────────
  function copyQuote() {
    var active = SERVICES.filter(function (s) { return state[s.id].active && state[s.id].qty > 0; });
    if (active.length === 0) {
      showToast('Najpierw wybierz usługi i podaj ilość.');
      return;
    }

    var lines = ['Wycena SolidBud Ltd\n'];
    var netto = 0;
    active.forEach(function (s) {
      var qty  = state[s.id].qty;
      var line = s.price * qty;
      netto   += line;
      lines.push(s.name + ': ' + qty + ' ' + s.unitLabel + ' × £' + s.price.toFixed(2) + ' = £' + line.toFixed(2));
    });

    var vat    = netto * VAT_RATE;
    var brutto = netto + vat;

    lines.push('');
    lines.push('Netto:  £' + netto.toFixed(2));
    lines.push('VAT 20%: £' + vat.toFixed(2));
    lines.push('BRUTTO: £' + brutto.toFixed(2));
    lines.push('\nwww.solidbud.co.uk');

    var text = lines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Wycena skopiowana do schowka!');
      });
    } else {
      // fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Wycena skopiowana do schowka!');
    }
  }

  // ─── Toast ─────────────────────────────────────────────────
  function showToast(msg) {
    var toast = document.getElementById('calc-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }

  // ─── Init ──────────────────────────────────────────────────
  function init() {
    renderCards();
    updateSummary();

    var btnReset = document.getElementById('btn-reset');
    var btnPrint = document.getElementById('btn-print');
    var btnCopy  = document.getElementById('btn-copy');

    if (btnReset) btnReset.addEventListener('click', resetAll);
    if (btnPrint) btnPrint.addEventListener('click', printQuote);
    if (btnCopy)  btnCopy.addEventListener('click',  copyQuote);

    // Sticky header scroll
    var header = document.getElementById('site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }, { passive: true });
    }

    // Mobile nav
    var toggle  = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        var open = navLinks.classList.contains('open');
        navLinks.classList.toggle('open', !open);
        toggle.classList.toggle('open', !open);
        toggle.setAttribute('aria-expanded', String(!open));
        document.body.style.overflow = open ? '' : 'hidden';
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Year footer
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
