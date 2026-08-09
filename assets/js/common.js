const IS_MOBILE_BASIC = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
const SITE_ROOT = IS_MOBILE_BASIC ? '../' : '';
const VERSION_STORAGE_KEY = '6months-view-mode';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TELEGRAM_CHANNEL = 'https://t.me/polGodaa';
const TIKTOK_URL = 'https://www.tiktok.com/@6ixmonth.s';

(function bootstrapRefreshStyles() {
  document.querySelectorAll('link[href*="archive-smolder.css"]').forEach((link) => link.remove());
  const existing = [...document.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.href.includes('/assets/css/refresh.css'));
  if (existing) { existing.dataset.sixmRefresh = '1'; return; }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${SITE_ROOT}assets/css/refresh.css?v=refresh1`;
  link.dataset.sixmRefresh = '1';
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
    links.innerHTML = `
      <a class="cart-icon-link" href="bag.html" aria-label="корзина">
        ${cartIconSvg()}
        <span class="cart-icon-count" id="cart-count">0</span>
      </a>`;
  });
}

function footerMarkup() {
  const switchMode = IS_MOBILE_BASIC ? 'desktop' : 'mobile';
  const switchLabel = IS_MOBILE_BASIC ? 'полная версия' : 'мобильная версия';
  const switchHref = pageForVersion(switchMode);
  return `
    <footer class="main-footer">
      <div class="footer-content footer-refresh">
        <div class="footer-primary">
          <span class="footer-dot" aria-hidden="true"></span>
          <span>6 months / independent</span>
        </div>
        <nav class="footer-nav" aria-label="нижняя навигация">
          <a href="${TELEGRAM_CHANNEL}" target="_blank" rel="noreferrer">telegram</a>
          <a href="${TIKTOK_URL}" target="_blank" rel="noreferrer">tik tok</a>
          <a href="about.html">история</a>
          <a href="privacy.html">конфиденциальность</a>
          <a class="admin-entry" href="${SITE_ROOT}admin.html">глав.net</a>
          <a href="${switchHref}" data-view-switch="${switchMode}">${switchLabel}</a>
        </nav>
      </div>
      <div class="footer-bottom"><span data-current-year></span></div>
    </footer>`;
}

function mountFooter() {
  document.querySelectorAll('[data-site-footer]').forEach((node) => {
    node.innerHTML = footerMarkup();
  });
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
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
  }, { threshold: 0.1, rootMargin: '0px 0px -24px' });
  nodes.forEach((node) => observer.observe(node));
}

function initCatalogNavigation() {
  const catalog = document.getElementById('catalog');
  if (!catalog) return;
  document.querySelectorAll('a[href="#catalog"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      catalog.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initHomeRefresh() {
  const hero = document.querySelector('.hero');
  if (!hero || !document.getElementById('catalog')) return;

  document.body.classList.remove('home-burn-page', 'brand-intro-pending', 'brand-burn-active', 'brand-intro-done');
  document.body.classList.add('home-page', 'home-refresh');
  hero.classList.add('hero-refresh');

  const content = hero.querySelector('.hero-content');
  if (content) {
    content.innerHTML = `
      <div class="hero-actions hero-actions-refresh">
        <a class="button button-ghost" href="#catalog">каталог</a>
        <a class="button button-ghost" href="${TELEGRAM_CHANNEL}" target="_blank" rel="noreferrer">telegram</a>
      </div>`;
  }

  if (!hero.querySelector('.hero-note-left')) {
    hero.insertAdjacentHTML('beforeend', `
      <div class="hero-note hero-note-left" aria-label="описание бренда">
        <span class="hero-note-label">archive / 01</span>
        <strong>ручная<br>работа</strong>
        <small>единичные вещи<br>и ограниченные модели</small>
      </div>
      <div class="hero-note hero-note-right" aria-label="6 months">
        <span class="hero-note-label accent-violet">6 months</span>
        <strong>архив<br>2026</strong>
        <small>distressed / reflective<br>made by hand</small>
      </div>`);
  }

  const heading = document.querySelector('.catalog-section .section-heading h2');
  if (heading) heading.textContent = 'каталог';
  document.querySelector('.process-section')?.remove();
}

function initHistoryRotator() {
  const placeholder = document.querySelector('.mobile-placeholder');
  if (!placeholder) return;

  const slides = [
    { top: '6 MONTHS', accent: '— «ПОЛ ГОДА»', bottom: 'так переводится название', type: 'type-condensed', tone: 'tone-violet' },
    { top: '2025', accent: 'СНАЧАЛА БЫЛ КАНАЛ', bottom: 'фотографии прогулок и повседневной жизни', type: 'type-serif', tone: 'tone-red' },
    { top: 'ПОТОМ', accent: 'ПОЯВИЛАСЬ ОДЕЖДА', bottom: 'идея выросла из той же среды', type: 'type-sans', tone: 'tone-violet' },
    { top: 'ПЕРВЫЕ', accent: 'ДВЕ МОДЕЛИ', bottom: 'distressed tee / reflective jeans', type: 'type-mono', tone: 'tone-red' },
    { top: 'СЕЙЧАС', accent: '6 MONTHS', bottom: 'архив / единичные вещи / ручная работа', type: 'type-condensed', tone: 'tone-violet' }
  ];

  placeholder.innerHTML = `<div class="history-rotator" aria-live="polite"></div>`;
  const rotator = placeholder.querySelector('.history-rotator');
  let index = 0;

  const render = () => {
    const slide = slides[index];
    rotator.className = `history-rotator ${slide.type} ${slide.tone}`;
    rotator.innerHTML = `
      <span class="history-top">${slide.top}</span>
      <strong class="history-accent">${slide.accent}</strong>
      <span class="history-bottom">${slide.bottom}</span>`;
  };

  render();
  if (REDUCED_MOTION) return;
  window.setInterval(() => {
    rotator.classList.add('is-changing');
    window.setTimeout(() => {
      index = (index + 1) % slides.length;
      render();
      requestAnimationFrame(() => rotator.classList.add('is-entering'));
      window.setTimeout(() => rotator.classList.remove('is-entering'), 520);
    }, 210);
  }, 2700);
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
    try { url = new URL(link.href, window.location.href); }
    catch { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 230);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  normalizeHeader();
  mountFooter();
  mountMobileCartDock();
  updateSharedCartCount();
  initHeader();
  initHomeRefresh();
  initHistoryRotator();
  initReveal();
  initCatalogNavigation();
  initPageTransitions();

  window.addEventListener('storage', updateSharedCartCount);
  window.addEventListener('focus', updateSharedCartCount);
});
