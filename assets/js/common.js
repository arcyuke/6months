const IS_MOBILE_BASIC = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
const SITE_ROOT = IS_MOBILE_BASIC ? '../' : '';
const VERSION_STORAGE_KEY = '6months-view-mode';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TELEGRAM_CHANNEL = 'https://t.me/polGodaa';
const TIKTOK_URL = 'https://www.tiktok.com/@6ixmonth.s';

(function bootstrapRefreshStyles() {
  document.querySelectorAll('link[href*="archive-smolder.css"]').forEach((link) => link.remove());
  const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.href.includes('/assets/css/refresh.css'));
  if (existing) {
    existing.href = `${SITE_ROOT}assets/css/refresh.css?v=refresh4`;
    existing.dataset.sixmRefresh = '4';
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${SITE_ROOT}assets/css/refresh.css?v=refresh4`;
  link.dataset.sixmRefresh = '4';
  document.head.append(link);
})();

function cartIconSvg() {
  return `<svg class="cart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3.5 4.5h2.2l1.4 9.1h10.1l2.1-6.5H7.1M9.2 18.5a1.25 1.25 0 1 0 0 .01M17.2 18.5a1.25 1.25 0 1 0 0 .01" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function pageForVersion(targetVersion) {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  params.delete('view');
  params.set('view', targetVersion);
  const search = `?${params.toString()}`;

  if (targetVersion === 'desktop') {
    if (/\/mobilebasic\/product\.html$/.test(path)) return `../product_months.html${search}`;
    if (/\/mobilebasic\/bag\.html$/.test(path)) return `../bag.html${search}`;
    if (/\/mobilebasic\/about\.html$/.test(path)) return `../about.html${search}`;
    if (/\/mobilebasic\/privacy\.html$/.test(path)) return `../privacy.html${search}`;
    return `../index.html${search}`;
  }

  if (/\/product_months\.html$/.test(path)) return `mobilebasic/product.html${search}`;
  if (/\/bag\.html$/.test(path)) return `mobilebasic/bag.html${search}`;
  if (/\/about\.html$/.test(path)) return `mobilebasic/about.html${search}`;
  if (/\/privacy\.html$/.test(path)) return `mobilebasic/privacy.html${search}`;
  return `mobilebasic/${search}`;
}

function normalizeHeader() {
  document.querySelectorAll('.site-header .nav-links').forEach((links) => {
    const cart = IS_MOBILE_BASIC ? '' : `
      <a class="cart-icon-link" href="bag.html" aria-label="корзина">
        ${cartIconSvg()}
        <span class="cart-icon-count" id="cart-count">0</span>
      </a>`;
    links.innerHTML = `
      <a class="header-telegram" href="${TELEGRAM_CHANNEL}" target="_blank" rel="noreferrer">telegram</a>
      ${cart}`;
  });
}

function footerMarkup() {
  const switchMode = IS_MOBILE_BASIC ? 'desktop' : 'mobile';
  const switchLabel = IS_MOBILE_BASIC ? 'полная версия' : 'мобильная версия';
  const switchHref = pageForVersion(switchMode);
  return `
    <footer class="main-footer">
      <div class="footer-content footer-refresh">
        <nav class="footer-nav" aria-label="нижняя навигация">
          <a href="${TELEGRAM_CHANNEL}" target="_blank" rel="noreferrer">telegram</a>
          <a href="${TIKTOK_URL}" target="_blank" rel="noreferrer">tik tok</a>
          <a href="about.html">история</a>
          <a href="privacy.html">конфиденциальность</a>
          <a href="${switchHref}" data-view-switch="${switchMode}">${switchLabel}</a>
          <a class="admin-entry" href="${SITE_ROOT}admin.html" aria-label="редактор">глав.net</a>
        </nav>
      </div>
      <div class="footer-bottom"><span data-current-year></span></div>
    </footer>`;
}

function mountFooter() {
  document.querySelectorAll('[data-site-footer]').forEach((node) => { node.innerHTML = footerMarkup(); });
  document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-view-switch]').forEach((link) => {
    link.addEventListener('click', () => {
      try { localStorage.setItem(VERSION_STORAGE_KEY, link.dataset.viewSwitch); }
      catch { /* query parameter still switches the version */ }
    });
  });
}

function getSharedCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart_guest')) || [];
    return cart.reduce((sum, item) => sum + Math.max(0, Number(item.quantity || 0)), 0);
  } catch {
    return 0;
  }
}

function updateSharedCartCount() {
  const value = String(getSharedCartCount());
  document.querySelectorAll('#cart-count').forEach((node) => { node.textContent = value; });
}

function mountMobileCartDock() {
  if (!IS_MOBILE_BASIC || /\/mobilebasic\/bag\.html$/.test(window.location.pathname)) return;
  const dock = document.createElement('a');
  dock.className = 'mobile-cart-dock';
  dock.href = 'bag.html';
  dock.setAttribute('aria-label', 'открыть корзину');
  dock.innerHTML = `${cartIconSvg()}<span class="mobile-cart-count" id="cart-count">0</span>`;
  document.body.append(dock);
}

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initReveal() {
  const nodes = document.querySelectorAll('[data-reveal]');
  if (!nodes.length) return;
  if (!('IntersectionObserver' in window) || REDUCED_MOTION) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -10px' });
  nodes.forEach((node) => observer.observe(node));
}

const SCRAMBLE_CHARS = '01<>/\\[]{}#%*+=░▒▓';
function scrambleText(node, target, duration = 360) {
  if (!node) return;
  if (REDUCED_MOTION) { node.textContent = target; return; }
  const started = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - started) / duration);
    const fixed = Math.floor(target.length * p);
    let out = '';
    for (let i = 0; i < target.length; i += 1) {
      const ch = target[i];
      if (ch === ' ') out += ' ';
      else if (i < fixed) out += ch;
      else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    node.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else node.textContent = target;
  };
  requestAnimationFrame(step);
}

function railMarkup() {
  const words = ['6 months', 'distressed', 'reflective', 'hand made', 'baggy', 'one piece', 'cut / wear', 'black', 'street', '2026', 'raw finish'];
  const block = words.map((word) => `<div class="hero-rail-word">${word}</div>`).join('');
  return `<aside class="hero-rail" aria-hidden="true"><div class="hero-rail-track">${block}${block}</div></aside>`;
}

function marqueeMarkup() {
  const text = 'одежда  ·  вещи  ·  одежда  ·  каталог  ·  шмот  ·  6 months  ·  ';
  return `<div class="fashion-marquee" aria-hidden="true"><div class="fashion-marquee-track"><span>${text}${text}</span><span>${text}${text}</span></div></div>`;
}

function initHomeRefresh() {
  const hero = document.querySelector('.hero');
  if (!hero || !document.getElementById('catalog')) return;

  document.body.classList.remove('home-burn-page', 'brand-intro-pending', 'brand-burn-active', 'brand-intro-done');
  document.body.classList.add('home-page', 'home-refresh');
  hero.classList.add('hero-refresh');

  hero.querySelectorAll('.hero-note, .hero-actions-refresh').forEach((node) => node.remove());
  const content = hero.querySelector('.hero-content');
  if (content) content.innerHTML = '';

  if (!hero.querySelector('.hero-rail')) hero.insertAdjacentHTML('beforeend', railMarkup());
  if (!document.querySelector('.fashion-marquee')) hero.insertAdjacentHTML('afterend', marqueeMarkup());

  const heading = document.querySelector('.catalog-section .section-heading h2');
  if (heading) {
    heading.textContent = 'одежда';
    heading.dataset.target = 'одежда';
  }
  document.querySelector('.process-section')?.remove();
}

function initFirstScrollGate() {
  let activated = false;
  const activate = () => {
    if (activated) return;
    activated = true;
    document.body.classList.add('has-user-scrolled');
    const heading = document.querySelector('.catalog-section .section-heading h2');
    if (heading) scrambleText(heading, heading.dataset.target || 'одежда', 420);
    window.dispatchEvent(new CustomEvent('sixm:firstscroll'));
  };

  if (window.scrollY > 6) activate();
  window.addEventListener('scroll', () => { if (window.scrollY > 6) activate(); }, { passive: true });
  window.addEventListener('wheel', activate, { passive: true, once: true });
  window.addEventListener('touchmove', activate, { passive: true, once: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) activate();
  }, { once: true });
}

function initHistoryRotator() {
  const placeholder = document.querySelector('.mobile-placeholder');
  if (!placeholder) return;

  const slides = [
    { top: '6 MONTHS', accent: 'ПОЛ ГОДА', bottom: 'так переводится название' },
    { top: '6 MONTHS / 01', accent: 'СЛЕДЫ ВРЕМЕНИ', bottom: 'порезы, ручная обработка, вещи с характером' },
    { top: '6 MONTHS / 02', accent: 'СВЕТ ВНУТРИ', bottom: 'reflective детали отвечают на вспышку и улицу' },
    { top: '6 MONTHS / 03', accent: 'НЕ КОНВЕЙЕР', bottom: 'маленькие партии и ручная работа' },
    { top: '6 MONTHS / 04', accent: 'НОСИТЬ / ЖИТЬ', bottom: 'одежда меняется вместе с человеком' }
  ];
  const positions = [
    ['35%', '34%'], ['64%', '30%'], ['42%', '68%'], ['68%', '64%'], ['52%', '47%']
  ];

  placeholder.innerHTML = `<div class="history-rotator" aria-live="polite"><span class="history-top"></span><strong class="history-accent"></strong><span class="history-bottom"></span></div>`;
  const rotator = placeholder.querySelector('.history-rotator');
  const top = rotator.querySelector('.history-top');
  const accent = rotator.querySelector('.history-accent');
  const bottom = rotator.querySelector('.history-bottom');
  let index = 0;
  let timer = null;

  const render = (animated = true) => {
    const slide = slides[index];
    const pos = positions[index % positions.length];
    rotator.style.setProperty('--x', pos[0]);
    rotator.style.setProperty('--y', pos[1]);
    accent.dataset.text = slide.accent;
    if (animated) {
      scrambleText(top, slide.top, 220);
      scrambleText(accent, slide.accent, 380);
      scrambleText(bottom, slide.bottom, 460);
    } else {
      top.textContent = slide.top;
      accent.textContent = slide.accent;
      bottom.textContent = slide.bottom;
    }
  };

  const next = () => {
    rotator.classList.add('glitch-hit');
    index = (index + 1) % slides.length;
    window.setTimeout(() => {
      render(true);
      rotator.classList.remove('glitch-hit');
    }, 70);
  };

  render(false);
  const start = () => {
    if (timer || REDUCED_MOTION) return;
    render(true);
    timer = window.setInterval(next, 1750);
  };

  if (document.body.classList.contains('has-user-scrolled')) start();
  else window.addEventListener('sixm:firstscroll', start, { once: true });
}

function initPageTransitions() {
  requestAnimationFrame(() => document.body.classList.add('page-ready'));
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
    document.body.classList.add('page-ready');
  });

  if (REDUCED_MOTION) return;
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 110);
  });
}

function initImageGuard() {
  const selector = '.product-image img, .gallery-main img, .gallery-thumb img';
  const guard = (root = document) => {
    root.querySelectorAll?.(selector).forEach((img) => {
      img.draggable = false;
      img.setAttribute('draggable', 'false');
    });
  };
  guard();
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) guard(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('dragstart', (event) => {
    if (event.target.closest?.('.product-image, .gallery-main, .gallery-thumb')) event.preventDefault();
  });
  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest?.('.product-image, .gallery-main, .gallery-thumb')) event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  normalizeHeader();
  mountFooter();
  mountMobileCartDock();
  updateSharedCartCount();
  initHeader();
  initHomeRefresh();
  initFirstScrollGate();
  initHistoryRotator();
  initReveal();
  initPageTransitions();
  initImageGuard();

  window.addEventListener('storage', updateSharedCartCount);
  window.addEventListener('focus', updateSharedCartCount);
});
