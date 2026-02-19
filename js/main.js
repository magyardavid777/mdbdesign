document.addEventListener('DOMContentLoaded', () => {

/* ===== LOADER ===== */
const loader = document.getElementById('loader');
function hideLoader() {
  setTimeout(() => loader.classList.add('out'), 800);
}
if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader);
  // Fallback - mindenképpen eltűnik 2.5 másodperc után
  setTimeout(hideLoader, 2500);
}

/* ===== HEADER SCROLL ===== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== BURGER MENU ===== */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ===== ACTIVE NAV ===== */
const navAs = document.querySelectorAll('.nav-links a');
const secs  = document.querySelectorAll('section[id]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.35 });
secs.forEach(s => secObs.observe(s));

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

function addReveal(selector, cls = 'reveal') {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add(cls);
    if (i > 0) el.classList.add(`delay-${Math.min(i, 3)}`);
    revealObs.observe(el);
  });
}
addReveal('.service-card');
addReveal('.pitem');
addReveal('.tcard');
addReveal('.pcard:not(.pricing-grid .pcard)'); // skip portfolio pcard confusion
document.querySelectorAll('.pricing-grid .pcard, .section-head, .about-grid, .contact-grid, .services-quote, .about-img-wrap').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ===== SERVICES ACCORDION ===== */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    serviceCards.forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
  });
});

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portItems  = document.querySelectorAll('.pitem');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.style.display = show ? '' : 'none';
      if (show) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        setTimeout(() => {
          item.style.transition = 'opacity .4s ease, transform .4s ease';
          item.style.opacity = '1';
          item.style.transform = 'none';
        }, 20);
      }
    });
  });
});

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Küldés...';
    btn.disabled = true;
    setTimeout(() => {
      btn.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    }, 1000);
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== SUBTLE CURSOR TRAIL (desktop) ===== */
if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;pointer-events:none;z-index:9999;
    width:8px;height:8px;border-radius:50%;
    background:var(--red,#e63030);opacity:0;
    transition:opacity .3s,transform .15s;
    transform:translate(-50%,-50%);
  `;
  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:32px;height:32px;border-radius:50%;
    border:1px solid rgba(230,48,48,.35);opacity:0;
    transform:translate(-50%,-50%);
    transition:opacity .3s,left .12s ease,top .12s ease;
  `;
  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    cursor.style.opacity = '1';
    ring.style.left = mx + 'px'; ring.style.top = my + 'px';
    ring.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.querySelectorAll('a, button, .service-card, .pitem, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1)';
    });
  });
}

}); // end DOMContentLoaded
