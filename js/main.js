/* ===== MOON FOUNDATION – MAIN JAVASCRIPT ===== */

// ── Preloader ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }
});

// ── Navbar scroll behaviour ────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
    backToTop?.classList.add('visible');
  } else {
    navbar?.classList.remove('scrolled');
    backToTop?.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile hamburger ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    hamburger?.classList.remove('active');
    hamburger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Particle system ────────────────────────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 10}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ── Counter animation ──────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num, .impact-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        animateCounter(entry.target, parseInt(entry.target.dataset.target));
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}
initCounters();

// ── Scroll reveal ──────────────────────────────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}
initScrollReveal();

// ── Progress bars ──────────────────────────────────────────────────
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('animated'); }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => observer.observe(b));
}
initProgressBars();

// ── Testimonial slider ─────────────────────────────────────────────
function initTestiSlider() {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  let current = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    resetTimer();
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  document.getElementById('testiPrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('testiNext')?.addEventListener('click', () => goTo(current + 1));

  resetTimer();
}
initTestiSlider();

// ── Active nav link ────────────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.split('#')[0];
    a.classList.toggle('active', href === path);
  });
}
setActiveNav();

// ── Form handling ──────────────────────────────────────────────────
function initForms() {
  document.querySelectorAll('form.ajax-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1200));
      form.style.display = 'none';
      const success = form.nextElementSibling;
      if (success?.classList.contains('form-success')) success.style.display = 'block';
      btn.textContent = original;
      btn.disabled = false;
    });
  });
}
initForms();

// ── Donate amount selector ─────────────────────────────────────────
function initDonateButtons() {
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (customInput) customInput.value = '';
    });
  });
  customInput?.addEventListener('input', () => {
    amountBtns.forEach(b => b.classList.remove('selected'));
  });

  const purposeBtns = document.querySelectorAll('.purpose-btn');
  purposeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      purposeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}
initDonateButtons();

// ── Smooth anchor scroll ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Add reveal classes dynamically ────────────────────────────────
document.querySelectorAll('.pillar-card, .event-card, .impact-card, .team-card, .gallery-item').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('delay-1');
  if (i % 4 === 2) el.classList.add('delay-2');
  if (i % 4 === 3) el.classList.add('delay-3');
});

document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.mission-text, .story-text').forEach(el => el.classList.add('reveal-right'));
document.querySelectorAll('.mission-visual, .story-image-box').forEach(el => el.classList.add('reveal-left'));
