/* MOON Foundation – main.js v2 */

// ── Preloader ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  const pl = document.getElementById('preloader');
  if (pl) setTimeout(() => pl.classList.add('out'), 500);
});

// ── Navbar ─────────────────────────────────────────────────────
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  nav?.classList.toggle('scrolled', scrolled);
  btt?.classList.toggle('show', scrolled);
}, { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Hamburger ──────────────────────────────────────────────────
const hbg = document.getElementById('hbg');
const navLinks = document.getElementById('navLinks');
hbg?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  const [a, b, c] = hbg.querySelectorAll('span');
  if (navLinks?.classList.contains('open')) {
    a.style.transform = 'rotate(45deg) translate(5px,5px)';
    b.style.opacity = '0';
    c.style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    [a, b, c].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('#navLinks a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    hbg?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Active nav ─────────────────────────────────────────────────
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a:not(.nav-donate)').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === page) a.classList.add('active');
  });
})();

// ── Scroll reveal ──────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.sr, .sr-l, .sr-r').forEach(el => revealObs.observe(el));

// ── Counter animation ──────────────────────────────────────────
function countTo(el, target, dur = 2000) {
  let start = 0;
  const step = target / (dur / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString('en-IN');
    if (start >= target) clearInterval(timer);
  }, 16);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      countTo(e.target, parseInt(e.target.dataset.target));
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

// ── Progress bars ──────────────────────────────────────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w; barObs.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('.prog-bar-fill').forEach(b => barObs.observe(b));

// ── Testimonial slider ─────────────────────────────────────────
(function () {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const dots = document.getElementById('testiDots');
  const slides = track.querySelectorAll('.testi-slide');
  let cur = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 't-dot' + (i === 0 ? ' on' : '');
    d.onclick = () => go(i);
    dots?.appendChild(d);
  });

  function go(n) {
    cur = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
    reset();
  }
  function reset() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); }

  document.getElementById('testiPrev')?.addEventListener('click', () => go(cur - 1));
  document.getElementById('testiNext')?.addEventListener('click', () => go(cur + 1));
  reset();
})();

// ── Donate: amount & purpose ───────────────────────────────────
(function () {
  const amtBtns  = document.querySelectorAll('.amt-btn');
  const purpBtns = document.querySelectorAll('.purp-btn');
  const custom   = document.getElementById('customAmt');
  const submitBtn= document.getElementById('donateSubmit');
  let amount = 1000;

  function updateBtn() {
    const v = custom?.value ? parseInt(custom.value) : amount;
    if (submitBtn) submitBtn.textContent = `Donate ₹${v.toLocaleString('en-IN')} via Razorpay →`;
  }

  amtBtns.forEach(b => b.addEventListener('click', () => {
    amtBtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    amount = parseInt(b.dataset.amount);
    if (custom) custom.value = '';
    updateBtn();
  }));

  custom?.addEventListener('input', updateBtn);

  purpBtns.forEach(b => b.addEventListener('click', () => {
    purpBtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
  }));

  updateBtn();
})();

// ── Razorpay payment ───────────────────────────────────────────
window.initRazorpay = function () {
  const form = document.getElementById('donateForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const amtBtn   = document.querySelector('.amt-btn.on');
    const custom   = document.getElementById('customAmt');
    const amount   = custom?.value ? parseInt(custom.value) : parseInt(amtBtn?.dataset.amount || 1000);
    const purpose  = document.querySelector('.purp-btn.on')?.textContent.trim() || 'General';
    const name     = document.getElementById('donorName')?.value || '';
    const email    = document.getElementById('donorEmail')?.value || '';
    const phone    = document.getElementById('donorPhone')?.value || '';
    const pan      = document.getElementById('donorPAN')?.value || '';

    const KEY = document.getElementById('donateForm')?.dataset.rzpKey || '';

    if (!KEY || KEY === 'YOUR_RAZORPAY_KEY_HERE') {
      alert('⚠️ Razorpay Key not configured.\n\nSteps:\n1. Sign up free at razorpay.com\n2. Go to Settings → API Keys\n3. Copy your Key ID\n4. Replace YOUR_RAZORPAY_KEY_HERE in donate.html');
      return;
    }

    const options = {
      key: KEY,
      amount: amount * 100,
      currency: 'INR',
      name: 'MOON Foundation',
      description: 'Donation – ' + purpose,
      image: 'assets/favicon.svg',
      handler: function (response) {
        document.getElementById('donateForm').style.display = 'none';
        document.getElementById('donateSuccess').style.display = 'block';
        document.getElementById('paymentId').textContent = response.razorpay_payment_id;
      },
      prefill: { name, email, contact: phone },
      notes: { purpose, pan },
      theme: { color: '#16a34a' },
      modal: { escape: true }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => alert('Payment failed. Please try again.'));
    rzp.open();
  });
};

// ── Gallery filter & lightbox ──────────────────────────────────
(function () {
  const filterBtns = document.querySelectorAll('.gf-btn');
  const items      = document.querySelectorAll('.gf-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.filter;
      items.forEach(item => { item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none'; });
    });
  });

  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let idx = 0;
  const vis = () => [...items].filter(i => i.style.display !== 'none');

  items.forEach(item => item.addEventListener('click', () => {
    const v = vis();
    idx = v.indexOf(item);
    show(v[idx]);
  }));
  function show(item) {
    if (!lb || !item) return;
    lbImg.src = item.querySelector('img')?.src || '';
    lbCap.textContent = item.dataset.cap || '';
    lb.classList.add('open');
  }
  document.getElementById('lbClose')?.addEventListener('click', () => lb.classList.remove('open'));
  lb?.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
  document.getElementById('lbPrev')?.addEventListener('click', () => { const v = vis(); idx = (idx-1+v.length)%v.length; show(v[idx]); });
  document.getElementById('lbNext')?.addEventListener('click', () => { const v = vis(); idx = (idx+1)%v.length; show(v[idx]); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowLeft')  document.getElementById('lbPrev')?.click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext')?.click();
  });
})();

// ── Contact form ───────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  const orig = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  await new Promise(r => setTimeout(r, 1000));
  e.target.style.display = 'none';
  document.getElementById('contactSuccess').style.display = 'block';
  btn.textContent = orig;
  btn.disabled = false;
});

// ── Smooth anchor ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Add SR classes to elements ─────────────────────────────────
document.querySelectorAll('.prog-card, .impact-card, .team-card, .event-card, .mvv-card, .gf-item').forEach((el, i) => {
  el.classList.add('sr');
  if (i % 3 === 1) el.classList.add('d1');
  if (i % 3 === 2) el.classList.add('d2');
});
