// CUSTOM CURSOR
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .proj-card, .cert-card, .avatar-img, .hero-cta, .slider-btn, .exp-slider-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});


// NAVBAR
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});


// REVEAL ON SCROLL
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// SCROLL PROGRESS INDICATOR 
const siFill = document.getElementById('si-fill');
if (siFill) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    siFill.style.height = pct + '%';
  });
}

// ACTIVE NAV HIGHLIGHT
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function setActiveNav(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
}

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveNav(entry.target.id);
    }
  });
}, {
  rootMargin: '-15% 0px -55% 0px',
  threshold: 0
});

sections.forEach(sec => navObserver.observe(sec));

window.addEventListener('scroll', () => {
  const scrollBottom = window.scrollY + window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollBottom >= docHeight - 80) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) setActiveNav(lastSection.id);
  }
});


// SLIDERS
function initSlider(slider, slidesSelector, dotsSelector, prevSelector, nextSelector) {
  const slidesWrap = slider.querySelector(slidesSelector);
  const dotsWrap   = slider.querySelector(dotsSelector);
  const prevBtn    = slider.querySelector(prevSelector);
  const nextBtn    = slider.querySelector(nextSelector);
  const slideEls   = slidesWrap.children;
  const total      = slideEls.length;
  let current      = 0;

  const controls = prevBtn ? prevBtn.closest('.slider-controls, .exp-slider-controls') : null;
  if (total <= 1) {
    if (controls) controls.style.display = 'none';
    return;
  }

  Array.from(slideEls).forEach((_, i) => {
    const d = document.createElement('div');
    d.className = (dotsSelector.includes('exp') ? 'exp-slider-dot' : 'slider-dot') + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    current = (n + total) % total;
    slidesWrap.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('[class*="dot"]').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  setInterval(() => goTo(current + 1), 4000);
}

document.querySelectorAll('[data-slider]').forEach(slider => {
  initSlider(slider, '.lead-slides', '.slider-dots', '.slider-prev', '.slider-next');
});

// LIGHTBOX
const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div class="lb-backdrop"></div>
  <button class="lb-nav lb-nav-prev" id="lb-prev" title="Previous" aria-label="Previous">&#8249;</button>
  <button class="lb-nav lb-nav-next" id="lb-next" title="Next" aria-label="Next">&#8250;</button>
  <div class="lb-container">
    <div class="lb-toolbar">
      <button class="lb-btn" id="lb-zoom-in"  title="Zoom In">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button class="lb-btn" id="lb-zoom-out" title="Zoom Out">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button class="lb-btn" id="lb-download" title="Download">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
      <button class="lb-btn lb-btn--close" id="lb-close" title="Close (Esc)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="lb-img-wrap">
      <img id="lb-img" alt="Image"/>
    </div>
    <div class="lb-counter" id="lb-counter"></div>
    <div class="lb-hint">Scroll to zoom · Arrow keys to navigate · Esc to close</div>
  </div>
`;
document.body.appendChild(lb);

// Gallery state
let lbGallery  = [];  // array of { src, downloadSrc }
let lbIndex    = 0;
let lbScale    = 1;

function lbOpen(gallery, startIndex) {
  lbGallery = gallery;
  lbIndex   = startIndex;
  lbScale   = 1;
  lbRender();
  lb.classList.add('lb-visible');
  document.body.style.overflow = 'hidden';
}

function lbClose() {
  lb.classList.remove('lb-visible');
  document.body.style.overflow = '';
}

function lbRender() {
  const item = lbGallery[lbIndex];
  const img  = document.getElementById('lb-img');
  lbScale = 1;
  img.style.transition = 'none';
  img.style.transform  = 'scale(1)';
  img.src = item.src;

  // Counter
  const counter = document.getElementById('lb-counter');
  if (lbGallery.length > 1) {
    counter.textContent = `${lbIndex + 1} / ${lbGallery.length}`;
    counter.style.display = 'block';
  } else {
    counter.style.display = 'none';
  }

  // Nav arrows visibility
  const prevBtn = document.getElementById('lb-prev');
  const nextBtn = document.getElementById('lb-next');
  prevBtn.style.display = lbGallery.length > 1 ? 'flex' : 'none';
  nextBtn.style.display = lbGallery.length > 1 ? 'flex' : 'none';
}

function lbGoTo(n) {
  lbIndex = (n + lbGallery.length) % lbGallery.length;
  lbRender();
}

function lbZoom(delta) {
  lbScale = Math.min(Math.max(lbScale + delta, 0.5), 4);
  const img = document.getElementById('lb-img');
  img.style.transition = 'transform 0.25s ease';
  img.style.transform  = `scale(${lbScale})`;
}

async function lbDownload(src) {
  try {
    const res  = await fetch(src);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = src.split('/').pop() || 'image';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch {
    const a = document.createElement('a');
    a.href = src; a.download = src.split('/').pop() || 'image';
    a.target = '_blank'; a.click();
  }
}

// Leadership sliders
document.querySelectorAll('[data-slider]').forEach(slider => {
  const imgs = Array.from(slider.querySelectorAll('.lead-slide img'));
  const gallery = imgs.map(img => ({ src: img.src, downloadSrc: img.closest('.lead-slide').querySelector('.slide-dl-btn')?.dataset.src || img.src }));
  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => lbOpen(gallery, i));
  });
});

// Cert cards
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.cert-action-btn')) return;
    const img = card.querySelector('.cert-img');
    if (img) lbOpen([{ src: img.src, downloadSrc: img.src }], 0);
  });
});

// Avatar
const avatarImg = document.querySelector('.avatar-img');
if (avatarImg) avatarImg.addEventListener('click', () => lbOpen([{ src: avatarImg.src, downloadSrc: avatarImg.src }], 0));

// Download buttons in sliders
document.querySelectorAll('.slide-dl-btn').forEach(btn => {
  btn.addEventListener('click', (e) => { e.stopPropagation(); lbDownload(btn.dataset.src); });
});

// Toolbar & nav events
document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); lbGoTo(lbIndex - 1); });
document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); lbGoTo(lbIndex + 1); });
document.getElementById('lb-zoom-in').addEventListener('click',  (e) => { e.stopPropagation(); lbZoom(0.3); });
document.getElementById('lb-zoom-out').addEventListener('click', (e) => { e.stopPropagation(); lbZoom(-0.3); });
document.getElementById('lb-close').addEventListener('click',    (e) => { e.stopPropagation(); lbClose(); });
document.getElementById('lb-download').addEventListener('click', (e) => {
  e.stopPropagation();
  lbDownload(lbGallery[lbIndex]?.downloadSrc || lbGallery[lbIndex]?.src);
});

lb.querySelector('.lb-backdrop').addEventListener('click', lbClose);

lb.querySelector('.lb-img-wrap').addEventListener('wheel', (e) => {
  e.preventDefault();
  lbZoom(e.deltaY < 0 ? 0.15 : -0.15);
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('lb-visible')) return;
  if (e.key === 'Escape')                   lbClose();
  if (e.key === 'ArrowLeft')                lbGoTo(lbIndex - 1);
  if (e.key === 'ArrowRight')               lbGoTo(lbIndex + 1);
  if (e.key === '+' || e.key === '=')       lbZoom(0.3);
  if (e.key === '-')                        lbZoom(-0.3);
});


// 7. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


// 8. PAGE LOAD FADE 
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});

// EDU TABS
const eduTabs   = document.querySelectorAll('.edu-tab');
const eduTabsEl = document.querySelector('.edu-tabs');
const TAB_GROW_DURATION = 420; // ms — matches CSS transition 0.45s

function moveIndicator(activeTab) {
  if (!eduTabsEl) return;
  let bar = eduTabsEl.querySelector('.edu-tab-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'edu-tab-bar';
    eduTabsEl.appendChild(bar);
  }

  requestAnimationFrame(() => {
    const tabRect  = activeTab.getBoundingClientRect();
    const wrapRect = eduTabsEl.getBoundingClientRect();
    bar.style.left  = (tabRect.left - wrapRect.left) + 'px';
    bar.style.width = tabRect.width + 'px';
  });
}

const tabOrder = Array.from(eduTabs);
let switching = false;

eduTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (switching || tab.classList.contains('active')) return;
    switching = true;

    const target     = tab.dataset.tab;
    const currentActive = document.querySelector('.edu-tab.active');
    const currentIdx = currentActive ? tabOrder.indexOf(currentActive) : 0;
    const nextIdx    = tabOrder.indexOf(tab);
    const goingRight = nextIdx > currentIdx; // Education(0)→Experience(1) = right

    eduTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    moveIndicator(tab);

    setTimeout(() => {
      document.querySelectorAll('.edu-panel').forEach(p => {
        p.classList.remove('active', 'slide-left', 'slide-right');
      });

      const panel = document.getElementById('panel-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.classList.add(goingRight ? 'slide-left' : 'slide-right');
      }

      switching = false;
    }, TAB_GROW_DURATION);
  });
});

window.addEventListener('load', () => {
  const activeTab = document.querySelector('.edu-tab.active');
  if (activeTab) {
    setTimeout(() => moveIndicator(activeTab), 100);
  }
});

// LEADERSHIP ACCORDION
document.querySelectorAll('[data-acc]').forEach(acc => {
  const header  = acc.querySelector('.lead-acc-header');
  header.addEventListener('click', () => {
    const isOpen = acc.classList.contains('open');
    document.querySelectorAll('[data-acc].open').forEach(a => a.classList.remove('open'));
    if (!isOpen) {
      acc.classList.add('open');
      acc.querySelectorAll('[data-slider]:not([data-slider-init])').forEach(slider => {
        slider.setAttribute('data-slider-init', '1');
        initGallerySlider(slider);
      });
    }
  });
});

// GALLERY SLIDER
function initGallerySlider(slider) {
  const slidesWrap = slider.querySelector('.lead-slides');
  const dotsWrap   = slider.querySelector('.slider-dots');
  const prevBtn    = slider.querySelector('.slider-prev');
  const nextBtn    = slider.querySelector('.slider-next');
  const slideEls   = Array.from(slidesWrap.children);
  const total      = slideEls.length;
  let current      = 0;

  const controls   = slider.querySelector('.slider-controls');
  if (total <= 1) { if (controls) controls.style.display = 'none'; return; }

  slideEls.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    current = (n + total) % total;
    slidesWrap.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

  // Wire lightbox
  slideEls.forEach((slide, i) => {
    const img = slide.querySelector('img');
    if (img) img.addEventListener('click', () => {
      const gallery = slideEls.map(s => ({ src: s.querySelector('img')?.src, downloadSrc: s.querySelector('.slide-dl-btn')?.dataset.src }));
      lbOpen(gallery, i);
    });
  });
}

document.querySelectorAll('.cert-card-v2').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.cert-card-v2-dl')) return;
    const img = card.querySelector('img');
    if (img) lbOpen([{ src: img.src, downloadSrc: img.src }], 0);
  });
});

document.querySelectorAll('.cert-exp-item').forEach(item => {
  const imgWrap = item.querySelector('.cert-exp-img-wrap');
  if (!imgWrap) return;
  const img = imgWrap.querySelector('img');
  if (!img) return;
  imgWrap.style.cursor = 'zoom-in';
  imgWrap.addEventListener('click', () => {
    lbOpen([{ src: img.src, downloadSrc: img.src }], 0);
  });
});

// INTERACTIVE EFFECTS
(function() {
  const el = document.querySelector('.hero-tags');
  const hero = document.getElementById('home');
  if (!el || !hero) return;

  const words    = ['Community Leader', 'Servant', 'Biker'];
  const separator = '  ·  ';
  const fullText  = words.join(separator);

  let activeInterval = null;
  let isAnimating    = false;

  function startTyping() {
    if (isAnimating) return;
    isAnimating = true;
    if (activeInterval) clearInterval(activeInterval);

    el.textContent = '';
    el.classList.remove('typing-done');
    let i = 0;

    activeInterval = setInterval(() => {
      el.textContent = fullText.slice(0, i + 1);
      i++;
      if (i >= fullText.length) {
        clearInterval(activeInterval);
        el.classList.add('typing-done');
        isAnimating = false;
      }
    }, 55);
  }

  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startTyping();
    });
  }, { threshold: 0.4 });

  heroObs.observe(hero);
  startTyping();
})();


// NUMBER COUNTER
(function() {
  const counters = document.querySelectorAll('.meta-num[data-count]');
  if (!counters.length) return;

  const activeAnimations = new Map();

  function animateCounter(el) {
    if (activeAnimations.has(el)) cancelAnimationFrame(activeAnimations.get(el));

    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const decimals = (String(target).split('.')[1] || '').length;
    const duration = 1800;
    const start    = performance.now();

    el.classList.add('counting');

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = eased * target;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        const raf = requestAnimationFrame(tick);
        activeAnimations.set(el, raf);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
        el.classList.remove('counting');
        activeAnimations.delete(el);
      }
    }

    const raf = requestAnimationFrame(tick);
    activeAnimations.set(el, raf);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounter(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => obs.observe(el));
})();


// TILT EFFECT
(function() {
  const card = document.querySelector('.proj-card--featured');
  if (!card) return;

  const MAX = 8;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    const rotY =  x * MAX * 2;
    const rotX = -y * MAX;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
})();

// CURSOR "VIEW"
(function() {
  const ring      = document.getElementById('cursorRing');
  const viewLabel = document.getElementById('cursorViewLabel');
  if (!ring || !viewLabel) return;

  let labelX = 0, labelY = 0;

  document.addEventListener('mousemove', (e) => {
    labelX = e.clientX;
    labelY = e.clientY;
    viewLabel.style.left = labelX + 'px';
    viewLabel.style.top  = labelY + 'px';
  });

  const images = document.querySelectorAll(
    '.exp-img-block .lead-slide img, .lead-gallery .lead-slide img, .cert-card-v2 img, .avatar-img'
  );

  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      ring.classList.add('on-image');
      viewLabel.classList.add('visible');
    });
    img.addEventListener('mouseleave', () => {
      ring.classList.remove('on-image');
      viewLabel.classList.remove('visible');
    });
  });
})();

// FLOATING PARTICLES
(function() {
  const container = document.getElementById('globalParticles');
  if (!container) return;

  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = 2 + Math.random() * 4;
    const left  = Math.random() * 100;
    const delay = Math.random() * 20;
    const dur   = 14 + Math.random() * 18;
    const drift = (Math.random() - 0.5) * 100;
    const alpha = 0.3 + Math.random() * 0.35;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      --drift: ${drift}px;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      opacity: 0;
      background: rgba(${120 + Math.round(Math.random()*60)}, ${60 + Math.round(Math.random()*60)}, 255, ${alpha});
    `;
    container.appendChild(p);
  }
})();

(function() {
  const label = document.getElementById('si-label');
  if (!label) return;

  const sectionMap = [
    { id: 'home',       name: 'HOME'       },
    { id: 'about',      name: 'ABOUT'      },
    { id: 'experience', name: 'EXPERIENCE' },
    { id: 'education',  name: 'EDUCATION'  },
    { id: 'projects',   name: 'PROJECTS'   },
    { id: 'contact',    name: 'CONTACT'    },
  ];

  function updateLabel() {
    let current = sectionMap[0].name;
    for (const s of sectionMap) {
      const el = document.getElementById(s.id);
      if (el && window.scrollY >= el.offsetTop - 160) current = s.name;
    }
    if (label.textContent !== current) {
      label.style.opacity = '0';
      setTimeout(() => {
        label.textContent = current;
        label.style.opacity = '1';
      }, 200);
    }
  }

  window.addEventListener('scroll', updateLabel, { passive: true });
  updateLabel();
})();

// ── HERO ANIMATED TAGLINE ────────────────────────────
(function() {
  const el = document.getElementById('heroTagline');
  if (!el) return;

  const words = ['learner', 'builder', 'servant'];
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    if (pause) { pause = false; setTimeout(type, 1800); return; }

    const word = words[wordIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) { deleting = true; pause = true; setTimeout(type, 50); return; }
      setTimeout(type, 80);
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 45);
    }
  }

  setTimeout(type, 800);
})();
