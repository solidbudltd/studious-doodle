/* ===================================
   SOLIDBUD LTD – Kalkulator budowlany
   =================================== */

'use strict';

// ===== Data =====

const CATEGORIES = [
  {
    id: 'tynki',
    name: 'Tynki i malarstwo',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="3" fill="currentColor" opacity="0.12"/><path d="M12 20h24M12 28h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="34" y="24" width="8" height="12" rx="1" fill="currentColor" opacity="0.4"/></svg>',
    services: ['gladz', 'malowanie', 'tynk'],
  },
  {
    id: 'podlogi',
    name: 'Podłogi',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="30" width="36" height="12" rx="2" fill="currentColor" opacity="0.2"/><rect x="6" y="30" width="12" height="12" rx="1" fill="currentColor" opacity="0.4"/><rect x="20" y="30" width="12" height="12" rx="1" fill="currentColor" opacity="0.4"/><rect x="34" y="30" width="8" height="12" rx="1" fill="currentColor" opacity="0.4"/><path d="M6 30L24 10l18 20" stroke="currentColor" stroke-width="2" opacity="0.3"/></svg>',
    services: ['plytki_pod', 'panele', 'wylewka'],
  },
  {
    id: 'sciany',
    name: 'Ściany i płytki',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="2" fill="currentColor" opacity="0.1"/><rect x="6" y="6" width="17" height="17" rx="1" fill="currentColor" opacity="0.3"/><rect x="25" y="6" width="17" height="17" rx="1" fill="currentColor" opacity="0.3"/><rect x="6" y="25" width="17" height="17" rx="1" fill="currentColor" opacity="0.3"/><rect x="25" y="25" width="17" height="17" rx="1" fill="currentColor" opacity="0.3"/></svg>',
    services: ['plytki_sc', 'scianka'],
  },
  {
    id: 'instalacje',
    name: 'Instalacje',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.1"/><path d="M24 10v8M24 30v8M10 24h8M30 24h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.4"/></svg>',
    services: ['el_punkt', 'hyd_punkt'],
  },
  {
    id: 'stolarka',
    name: 'Stolarka',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="2" fill="currentColor" opacity="0.15"/><rect x="14" y="6" width="20" height="38" rx="1" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="25" r="2.5" fill="currentColor" opacity="0.6"/><line x1="14" y1="25" x2="36" y2="25" stroke="currentColor" stroke-width="1.5" opacity="0.3"/></svg>',
    services: ['drzwi', 'okno'],
  },
  {
    id: 'lazienka',
    name: 'Łazienka',
    icon: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="20" width="36" height="22" rx="3" fill="currentColor" opacity="0.15"/><path d="M10 20V12a4 4 0 0 1 4-4 4 4 0 0 1 4 4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="8" y="38" width="6" height="6" rx="1" fill="currentColor" opacity="0.4"/><rect x="34" y="38" width="6" height="6" rx="1" fill="currentColor" opacity="0.4"/></svg>',
    services: ['lazienka'],
  },
];

const SERVICES = {
  gladz:      { name: 'Gładź gipsowa',              unit: 'm²',  price: 15,   max: 500, step: 5,  desc: 'Szpachlowanie i gładzenie ścian i sufitów' },
  malowanie:  { name: 'Malowanie ścian',             unit: 'm²',  price: 8,    max: 500, step: 5,  desc: '2 warstwy farby emulsyjnej' },
  tynk:       { name: 'Tynk maszynowy',              unit: 'm²',  price: 20,   max: 500, step: 5,  desc: 'Tynk gipsowy lub cementowo-wapienny' },
  plytki_pod: { name: 'Płytki podłogowe',            unit: 'm²',  price: 35,   max: 300, step: 5,  desc: 'Układanie i fugowanie – bez materiału' },
  panele:     { name: 'Panele podłogowe',             unit: 'm²',  price: 15,   max: 300, step: 5,  desc: 'Montaż z podkładem – bez materiału' },
  wylewka:    { name: 'Wylewka samopoziomująca',      unit: 'm²',  price: 25,   max: 300, step: 5,  desc: 'Warstwa 3–5 cm – z materiałem' },
  plytki_sc:  { name: 'Płytki ścienne',              unit: 'm²',  price: 40,   max: 300, step: 5,  desc: 'Układanie i fugowanie – bez materiału' },
  scianka:    { name: 'Ścianka działowa GK',          unit: 'm²',  price: 65,   max: 200, step: 5,  desc: 'Podwójna płyta GK, profil 75 mm' },
  el_punkt:   { name: 'Punkt elektryczny',            unit: 'szt', price: 120,  max: 100, step: 1,  desc: 'Gniazdko, włącznik lub wypust oświetleniowy' },
  hyd_punkt:  { name: 'Punkt hydrauliczny',           unit: 'szt', price: 200,  max: 50,  step: 1,  desc: 'Doprowadzenie wody lub odpływ kanalizacyjny' },
  drzwi:      { name: 'Montaż drzwi wewnętrznych',   unit: 'szt', price: 250,  max: 20,  step: 1,  desc: 'Montaż z ościeżnicą regulowaną – bez materiału' },
  okno:       { name: 'Montaż okna',                  unit: 'szt', price: 300,  max: 20,  step: 1,  desc: 'Montaż, uszczelnienie i pianka montażowa' },
  lazienka:   { name: 'Remont łazienki (kompleks)',   unit: 'szt', price: 5000, max: 5,   step: 1,  desc: 'Kompleksowy remont – bez materiałów' },
};

// ===== State =====

const state = {};
Object.keys(SERVICES).forEach(key => { state[key] = 0; });

// ===== Helpers =====

function formatGBP(amount) {
  return amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// ===== Rendering =====

function renderCalculator() {
  const form = document.getElementById('calc-form');
  if (!form) return;

  form.innerHTML = CATEGORIES.map(cat => `
    <div class="calc__category" id="cat-${cat.id}">
      <button class="calc__category-toggle" aria-expanded="true" aria-controls="cat-body-${cat.id}" data-cat="${cat.id}" type="button">
        <span class="calc__category-icon">${cat.icon}</span>
        <span class="calc__category-name">${cat.name}</span>
        <span class="calc__category-subtotal" id="cat-sub-${cat.id}">£0</span>
        <svg class="calc__category-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="calc__category-body" id="cat-body-${cat.id}">
        ${cat.services.map(key => renderServiceItem(key)).join('')}
      </div>
    </div>
  `).join('');
}

function renderServiceItem(key) {
  const s = SERVICES[key];
  const id = `qty-${key}`;
  const rangeid = `range-${key}`;
  return `
    <div class="calc__item" data-key="${key}">
      <div class="calc__item-top">
        <div class="calc__item-meta">
          <p class="calc__item-name">${s.name}</p>
          <p class="calc__item-desc">${s.desc}</p>
        </div>
        <div class="calc__item-rate-badge">
          <span class="calc__item-rate">${formatGBP(s.price)}</span>
          <span class="calc__item-unit">/ ${s.unit}</span>
        </div>
      </div>
      <div class="calc__item-controls">
        <div class="calc__qty-group">
          <button class="calc__qty-btn" type="button" data-action="dec" data-key="${key}" aria-label="Zmniejsz ilość">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <input
            type="number"
            class="calc__qty-input"
            id="${id}"
            data-key="${key}"
            value="0"
            min="0"
            max="${s.max}"
            step="${s.step}"
            aria-label="Ilość – ${s.name}"
          />
          <button class="calc__qty-btn" type="button" data-action="inc" data-key="${key}" aria-label="Zwiększ ilość">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span class="calc__qty-unit-label">${s.unit}</span>
        </div>
        <div class="calc__item-subtotal" id="sub-${key}">£0</div>
      </div>
      <input
        type="range"
        class="calc__slider"
        id="${rangeid}"
        data-key="${key}"
        min="0"
        max="${s.max}"
        step="${s.step}"
        value="0"
        aria-label="Suwak – ${s.name}"
      />
      <div class="calc__slider-labels">
        <span>0</span>
        <span>${Math.round(s.max / 2)} ${s.unit}</span>
        <span>${s.max} ${s.unit}</span>
      </div>
    </div>
  `;
}

// ===== Calculation =====

function updateItem(key) {
  const qty = state[key];
  const subtotal = qty * SERVICES[key].price;

  const subEl = document.getElementById(`sub-${key}`);
  if (subEl) subEl.textContent = formatGBP(subtotal);

  const qtyInput = document.getElementById(`qty-${key}`);
  if (qtyInput && Number(qtyInput.value) !== qty) qtyInput.value = qty;

  const rangeInput = document.getElementById(`range-${key}`);
  if (rangeInput && Number(rangeInput.value) !== qty) rangeInput.value = qty;
}

function updateSummary() {
  const breakdown = document.getElementById('calc-breakdown');
  const totalNetEl = document.getElementById('calc-total-net');
  const totalVatEl = document.getElementById('calc-total-vat');
  const totalGrossEl = document.getElementById('calc-total-gross');
  const vatRow = document.getElementById('calc-vat-row');
  const grossRow = document.getElementById('calc-gross-row');
  const mobileTotalEl = document.getElementById('calc-mobile-total');
  const mobileBar = document.getElementById('calc-mobile-bar');

  // Compute category subtotals
  const catTotals = {};
  let grandTotal = 0;

  CATEGORIES.forEach(cat => {
    let catSum = 0;
    cat.services.forEach(key => {
      catSum += state[key] * SERVICES[key].price;
    });
    catTotals[cat.id] = catSum;
    grandTotal += catSum;

    // Update category header subtotal
    const catSubEl = document.getElementById(`cat-sub-${cat.id}`);
    if (catSubEl) {
      catSubEl.textContent = catSum > 0 ? formatGBP(catSum) : '£0';
      catSubEl.classList.toggle('calc__category-subtotal--active', catSum > 0);
    }
  });

  // Build breakdown list
  const activeLines = [];
  CATEGORIES.forEach(cat => {
    cat.services.forEach(key => {
      const qty = state[key];
      if (qty > 0) {
        activeLines.push({ key, qty, subtotal: qty * SERVICES[key].price });
      }
    });
  });

  if (activeLines.length === 0) {
    breakdown.innerHTML = `
      <li class="calc__breakdown-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>
        <span>Ustaw ilości prac po lewej stronie</span>
      </li>`;
  } else {
    breakdown.innerHTML = activeLines.map(({ key, qty, subtotal }) => {
      const s = SERVICES[key];
      return `
        <li class="calc__breakdown-item">
          <span class="calc__breakdown-name">${s.name}</span>
          <span class="calc__breakdown-qty">${qty} ${s.unit}</span>
          <span class="calc__breakdown-subtotal">${formatGBP(subtotal)}</span>
        </li>`;
    }).join('');
  }

  // VAT
  const vatChecked = document.getElementById('calc-vat') && document.getElementById('calc-vat').checked;
  const vatAmount = grandTotal * 0.20;
  const grossAmount = grandTotal + vatAmount;

  if (totalNetEl) totalNetEl.textContent = formatGBP(grandTotal);
  if (vatRow) vatRow.hidden = !vatChecked;
  if (grossRow) grossRow.hidden = !vatChecked;
  if (totalVatEl) totalVatEl.textContent = formatGBP(vatAmount);
  if (totalGrossEl) totalGrossEl.textContent = formatGBP(grossAmount);

  // Mobile bar
  if (mobileBar) {
    if (grandTotal > 0) {
      mobileBar.removeAttribute('hidden');
    } else {
      mobileBar.setAttribute('hidden', '');
    }
  }
  if (mobileTotalEl) {
    const displayTotal = vatChecked ? grossAmount : grandTotal;
    mobileTotalEl.textContent = formatGBP(displayTotal);
  }
}

function setQty(key, rawValue) {
  const s = SERVICES[key];
  const clamped = clamp(Math.round(rawValue / s.step) * s.step, 0, s.max);
  state[key] = clamped;
  updateItem(key);
  updateSummary();
}

// ===== Event listeners =====

function attachListeners() {
  const form = document.getElementById('calc-form');
  if (!form) return;

  // +/− buttons (event delegation)
  form.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc__qty-btn');
    if (!btn) return;
    const key = btn.dataset.key;
    const action = btn.dataset.action;
    const s = SERVICES[key];
    const delta = action === 'inc' ? s.step : -s.step;
    setQty(key, state[key] + delta);
  });

  // Number input change (event delegation)
  form.addEventListener('change', (e) => {
    if (e.target.classList.contains('calc__qty-input')) {
      const key = e.target.dataset.key;
      setQty(key, Number(e.target.value));
    }
    if (e.target.classList.contains('calc__slider')) {
      const key = e.target.dataset.key;
      setQty(key, Number(e.target.value));
    }
  });

  // Slider live input (event delegation)
  form.addEventListener('input', (e) => {
    if (e.target.classList.contains('calc__slider')) {
      const key = e.target.dataset.key;
      const qty = Number(e.target.value);
      state[key] = qty;
      updateItem(key);
      updateSummary();
    }
    if (e.target.classList.contains('calc__qty-input')) {
      const key = e.target.dataset.key;
      // Update slider position live while typing
      const rangeEl = document.getElementById(`range-${key}`);
      const val = Number(e.target.value);
      if (rangeEl && !isNaN(val)) rangeEl.value = val;
    }
  });

  // Category accordion toggles
  form.addEventListener('click', (e) => {
    const toggle = e.target.closest('.calc__category-toggle');
    if (!toggle) return;
    const catId = toggle.dataset.cat;
    const body = document.getElementById(`cat-body-${catId}`);
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('collapsed', expanded);
    toggle.classList.toggle('collapsed', expanded);
  });

  // VAT toggle
  const vatCheckbox = document.getElementById('calc-vat');
  if (vatCheckbox) {
    vatCheckbox.addEventListener('change', updateSummary);
  }

  // Reset button
  const resetBtn = document.getElementById('calc-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Object.keys(state).forEach(key => { state[key] = 0; });
      Object.keys(SERVICES).forEach(key => {
        const qtyEl = document.getElementById(`qty-${key}`);
        const rangeEl = document.getElementById(`range-${key}`);
        if (qtyEl) qtyEl.value = 0;
        if (rangeEl) rangeEl.value = 0;
        updateItem(key);
      });
      updateSummary();
    });
  }

  // Print button
  const printBtn = document.getElementById('calc-print');
  if (printBtn) {
    printBtn.addEventListener('click', () => { window.print(); });
  }
}

// ===== Init =====

function initCalculator() {
  renderCalculator();
  attachListeners();
  updateSummary();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
