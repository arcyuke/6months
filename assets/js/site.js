const MOBILE_BASIC = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
const SITE_PREFIX = MOBILE_BASIC ? '../' : '';
const DATA_URL = `${SITE_PREFIX}assets/data/products.json`;
const REDUCED_CARD_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const money = (value) => value === null ? '' : `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

function assetUrl(path) {
  if (!path || /^(?:[a-z]+:|\/|#)/i.test(path)) return path;
  return `${SITE_PREFIX}${path}`;
}

function productHref(id) {
  const page = MOBILE_BASIC ? 'product.html' : 'product_months.html';
  return `${page}?id=${encodeURIComponent(id)}`;
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart_guest')) || []; }
  catch { return []; }
}

function updateCartCounter() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('#cart-count').forEach((node) => { node.textContent = count; });
}

function stockSummary(product) {
  if (product.madeToOrder) return { text: 'по запросу', className: 'available' };
  const total = (product.sizes || []).reduce((sum, size) => sum + Math.max(0, Number(size.stock || 0)), 0);
  if (total <= 0) return { text: 'нет в наличии', className: 'sold-out' };
  return { text: `в наличии: ${total} шт.`, className: 'available' };
}

function productCard(product) {
  const stock = stockSummary(product);
  const image = assetUrl(product.images?.[0] || '');
  const price = product.priceText || money(product.price);
  return `
    <article class="product-card">
      <a class="product-link" href="${productHref(product.id)}">
        <div class="product-image">
          <img src="${image}" alt="${product.name}" loading="lazy" decoding="async">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-row">
            <div class="product-price">${price}</div>
            <div class="product-stock ${stock.className}">${stock.text}</div>
          </div>
        </div>
      </a>
    </article>`;
}

function revealCards() {
  const cards = [...document.querySelectorAll('.product-card')];
  if (!cards.length) return;

  if (REDUCED_CARD_MOTION || !('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -18px' });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index, 4) * 45}ms`;
    observer.observe(card);
  });
}

function markLoadedImages() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const image = card.querySelector('img');
    if (!image) return;
    const ready = () => card.classList.add('image-ready');
    if (image.complete) ready();
    else {
      image.addEventListener('load', ready, { once: true });
      image.addEventListener('error', ready, { once: true });
    }
  });
}

async function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  try {
    const response = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error('catalog load failed');
    const products = await response.json();
    grid.innerHTML = products
      .filter((product) => product.visible !== false)
      .map(productCard)
      .join('');

    requestAnimationFrame(() => {
      markLoadedImages();
      revealCards();
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="muted">каталог временно недоступен</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();
  renderProducts();
});
