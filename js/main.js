/* ===================================
   SOLIDBUD LTD – Main JavaScript
   =================================== */

'use strict';

// ===== Header scroll behavior =====
const header = document.getElementById('header');
let lastScrollY = 0;

function handleScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    if (scrollY > 400) {
      backToTop.removeAttribute('hidden');
    } else {
      backToTop.setAttribute('hidden', '');
    }
  }

  // Update active nav link based on scroll position
  updateActiveNavLink();

  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run on load

// ===== Mobile Navigation =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ===== Active Navigation Link =====
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  let currentSection = '';
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (scrollMid >= sectionTop && scrollMid < sectionBottom) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + currentSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== Projects Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInCard 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate name
    const nameField = contactForm.querySelector('#name');
    const nameError = contactForm.querySelector('#name-error');
    if (!nameField.value.trim() || nameField.value.trim().length < 2) {
      showError(nameField, nameError, 'Podaj swoje imię i nazwisko (min. 2 znaki).');
      isValid = false;
    } else {
      clearError(nameField, nameError);
    }

    // Validate email
    const emailField = contactForm.querySelector('#email');
    const emailError = contactForm.querySelector('#email-error');
    // RFC 5322-inspired pattern: rejects consecutive dots, leading/trailing dots in domain
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailField.value.trim() || !emailPattern.test(emailField.value.trim())) {
      showError(emailField, emailError, 'Podaj prawidłowy adres e-mail.');
      isValid = false;
    } else {
      clearError(emailField, emailError);
    }

    // Validate message
    const messageField = contactForm.querySelector('#message');
    const messageError = contactForm.querySelector('#message-error');
    if (!messageField.value.trim() || messageField.value.trim().length < 10) {
      showError(messageField, messageError, 'Wpisz wiadomość (min. 10 znaków).');
      isValid = false;
    } else {
      clearError(messageField, messageError);
    }

    // Validate consent
    const consentField = contactForm.querySelector('#consent');
    const consentError = contactForm.querySelector('#consent-error');
    if (!consentField.checked) {
      consentError.textContent = 'Zgoda na przetwarzanie danych jest wymagana.';
      isValid = false;
    } else {
      consentError.textContent = '';
    }

    if (!isValid) return;

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn__text');
    const btnLoading = submitBtn.querySelector('.btn__loading');
    const formSuccess = document.getElementById('form-success');

    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;

    // TODO: Replace with actual fetch() POST to your backend/API endpoint in production.
    // This simulated delay mimics the loading state for demonstration purposes.
    await new Promise(resolve => setTimeout(resolve, 1200));

    submitBtn.disabled = false;
    if (btnText) btnText.hidden = false;
    if (btnLoading) btnLoading.hidden = true;

    if (formSuccess) {
      formSuccess.removeAttribute('hidden');
      contactForm.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Real-time validation
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      const errorEl = document.getElementById(field.id + '-error');
      if (errorEl && field.value.trim()) {
        clearError(field, errorEl);
      }
    });
  });
}

function showError(field, errorEl, message) {
  if (field) field.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(field, errorEl) {
  if (field) field.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

// ===== Scroll Animation (Intersection Observer) =====
const animatedElements = document.querySelectorAll(
  '.service-card, .project-card, .testimonial-card, .about__content, .about__visual, .contact__info, .contact__form-wrapper'
);

animatedElements.forEach(el => {
  el.classList.add('fade-in-up');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

animatedElements.forEach(el => observer.observe(el));

// ===== Smooth scrolling for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Back to top =====
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== CSS animation for project cards =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
