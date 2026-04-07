/* ═══════════════════════════════════════════════════════════════
   SolidBud Ltd — Main JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Year in footer ────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Sticky header ─────────────────────────────────────────
  const header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ─── Mobile nav toggle ─────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function closeNav() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openNav() {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  // ─── Intersection Observer — fade-in on scroll ─────────────
  const fadeElements = document.querySelectorAll(
    '.pillar-card, .stat-card, .about-text, .about-stats, ' +
    '.philosophy-quote, .investors-text, .visual-card, ' +
    '.contact-text, .contact-form'
  );

  if (typeof IntersectionObserver !== 'undefined' && fadeElements.length) {
    // Add initial hidden state via JS (not CSS) so it gracefully degrades
    fadeElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── Contact form (client-side only — no backend yet) ──────
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Placeholder: replace with actual API call / form service
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        showFormMessage(
          'Thank you, ' + name + '! Your message has been received. We\'ll be in touch within one business day.',
          'success'
        );
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(text, type) {
    let msg = document.getElementById('form-message');

    if (!msg) {
      msg = document.createElement('p');
      msg.id = 'form-message';
      msg.style.cssText =
        'padding: 0.85rem 1rem; border-radius: 4px; font-size: 0.88rem; ' +
        'font-weight: 500; margin-top: 0.5rem; text-align: center;';
      form.appendChild(msg);
    }

    if (type === 'success') {
      msg.style.background = 'rgba(212,168,67,0.12)';
      msg.style.color       = '#d4a843';
      msg.style.border      = '1px solid rgba(212,168,67,0.3)';
    } else {
      msg.style.background = 'rgba(220,60,60,0.10)';
      msg.style.color       = '#e06060';
      msg.style.border      = '1px solid rgba(220,60,60,0.25)';
    }

    msg.textContent = text;
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

})();
