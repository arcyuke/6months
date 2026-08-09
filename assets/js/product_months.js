const MOBILE_BASIC = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
const SITE_PREFIX = MOBILE_BASIC ? '../' : '';
const DATA_URL = `${SITE_PREFIX}assets/data/products.json`;
const TELEGRAM_USERNAME = 'SKIANORAK';
const REDUCED_GALLERY_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentProduct = null;
let currentImage = 0;
let selectedSize = '';
let touchStartX = 0;
let galleryTransitionToken = 0;

const money = (value) => value === null ? '' : `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

function assetUrl(path) {
  if (!path || /^(?:[a-z]+:|\/|#)/i.test(path)) return path;
  return `${SITE_PREFIX}${path}`;
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('cart_guest')) || []; }
  catch { return []; }
}

function saveCart(cart) { localStorage.setItem('cart_guest', JSON.stringify(cart)); }

function updateCartCounter() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach((node) => { node.textContent = count; });
}

function showAlert(text) {
  const alert = document.getElementById('custom-alert');
  if (!alert) return;
  alert.textContent = text;
  alert.classList.add('show');
  window.setTimeout(() => alert.classList.remove('show'), 1600);
}

function availableTotal(product) {
  if (product.madeToOrder) return null;
  return (product.sizes || []).reduce((sum, size) => sum + Math.max(0, Number(size.stock || 0)), 0);
}

function sizeMarkup(product) {
  if (product.madeToOrder) return '';
  return `
    <div class="size-block">
      <span>размер и наличие</span>
      <div class="size-grid" id="size-grid">
        ${(product.sizes || []).map((size) => {
          const stock = Math.max(0, Number(size.stock || 0));
          return `<button class="size-option" type="button" data-size="${size.label}" data-stock="${stock}" ${stock <= 0 ? 'disabled' : ''}>
            <span class="size-label">${size.label}</span>
            <span class="size-stock">${stock > 0 ? `${stock} шт.` : 'нет'}</span>
          </button>`;
        }).join('')}
      </div>
      <div class="selected-stock" id="selected-stock"></div>
    </div>`;
}

function sizeChartMarkup(product) {
  const chart = product.sizeChart;
  if (product.madeToOrder || !chart) return '';

  const columns = Array.isArray(chart.columns) ? chart.columns : [];
  const rows = Array.isArray(chart.rows) ? chart.rows : [];
  const table = rows.length && columns.length ? `
    <div class="size-chart-scroll">
      <table>
        <thead><tr>${columns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((value, index) => index === 0 ? `<th scope="row">${value}</th>` : `<td>${value}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${chart.unit ? `<p class="size-chart-unit">значения указаны в ${chart.unit}</p>` : ''}` : `
    <p class="size-chart-empty">${chart.note || 'замеры будут добавлены после измерения изделия'}</p>`;

  return `
    <details class="size-chart">
      <summary>
        <span>таблица размеров</span>
        <span class="size-chart-arrow" aria-hidden="true">⌄</span>
      </summary>
      <div class="size-chart-content">${table}</div>
    </details>`;
}

function actionMarkup(product) {
  if (product.madeToOrder) {
    const text = encodeURIComponent('привет. хочу обсудить индивидуальный заказ от 6 months');
    return `<a class="primary-action secondary-action" href="https://t.me/${TELEGRAM_USERNAME}?text=${text}" target="_blank" rel="noreferrer">обсудить заказ в telegram</a>`;
  }
  const total = availableTotal(product);
  if (total === 0) return '<button class="primary-action" disabled>нет в наличии</button>';
  return '<button class="primary-action" id="add-to-cart" disabled>выберите размер</button>';
}

function preloadImages(images) {
  images.slice(1).forEach((src) => {
    const preload = new Image();
    preload.decoding = 'async';
    preload.src = src;
  });
}

function renderProduct(product) {
  currentProduct = product;
  currentImage = 0;
  selectedSize = '';
  const page = document.getElementById('product-page');
  page.classList.remove('product-ready');
  const price = product.priceText || money(product.price);
  const images = (product.images || []).map(assetUrl);

  page.innerHTML = `
    <div class="product-layout">
      <section class="product-gallery">
        <div class="gallery-main" id="gallery-main">
          <img id="main-product-image" src="${images[0]}" alt="${product.name}" decoding="async">
          ${images.length > 1 ? '<button class="gallery-arrow prev" id="prev-image" aria-label="предыдущее фото">‹</button><button class="gallery-arrow next" id="next-image" aria-label="следующее фото">›</button>' : ''}
          <div class="gallery-counter" id="gallery-counter">1 / ${images.length}</div>
        </div>
        <div class="gallery-thumbs">
          ${images.map((src, index) => `<button class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="фото ${index + 1}"><img src="${src}" alt="${product.name}, фото ${index + 1}" loading="lazy" decoding="async"></button>`).join('')}
        </div>
      </section>
      <section class="product-info">
        ${product.badge ? `<span class="detail-badge">${product.badge}</span>` : ''}
        <h1 class="detail-title">${product.name}</h1>
        <div class="detail-price">${price}</div>
        <p class="detail-description">${product.description}</p>
        ${sizeChartMarkup(product)}
        ${sizeMarkup(product)}
        ${actionMarkup(product)}
        <div class="detail-section">
          <h2>о модели</h2>
          <ul>${product.characteristics.map((item) => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="detail-section">
          <h2>идея</h2>
          <p>${product.philosophy}</p>
        </div>
      </section>
    </div>`;

  currentProduct.resolvedImages = images;
  preloadImages(images);

  document.querySelectorAll('.gallery-thumb').forEach((button) => {
    button.addEventListener('click', () => setImage(Number(button.dataset.index)));
  });
  document.getElementById('prev-image')?.addEventListener('click', () => setImage(currentImage - 1));
  document.getElementById('next-image')?.addEventListener('click', () => setImage(currentImage + 1));

  const gallery = document.getElementById('gallery-main');
  gallery?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  gallery?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 42) return;
    setImage(currentImage + (distance < 0 ? 1 : -1));
  }, { passive: true });

  document.querySelectorAll('.size-option').forEach((button) => {
    button.addEventListener('click', () => selectSize(button));
  });
  document.getElementById('add-to-cart')?.addEventListener('click', addToCart);

  requestAnimationFrame(() => page.classList.add('product-ready'));
}

function selectSize(button) {
  selectedSize = button.dataset.size;
  document.querySelectorAll('.size-option').forEach((node) => node.classList.toggle('is-selected', node === button));
  button.classList.remove('selection-pop');
  void button.offsetWidth;
  button.classList.add('selection-pop');
  const stock = Number(button.dataset.stock || 0);
  const stockNode = document.getElementById('selected-stock');
  const addButton = document.getElementById('add-to-cart');
  if (stockNode) stockNode.textContent = `в наличии: ${stock} шт.`;
  if (addButton) {
    addButton.disabled = stock <= 0;
    addButton.textContent = stock > 0 ? 'добавить в корзину' : 'нет в наличии';
  }
}

async function setImage(index) {
  const images = currentProduct?.resolvedImages || [];
  const image = document.getElementById('main-product-image');
  if (!images.length || !image) return;

  const nextIndex = (index + images.length) % images.length;
  if (nextIndex === currentImage) return;

  const direction = index > currentImage ? 1 : -1;
  const token = ++galleryTransitionToken;
  const nextSrc = images[nextIndex];
  const preload = new Image();
  preload.decoding = 'async';
  preload.src = nextSrc;

  try {
    if (typeof preload.decode === 'function') await preload.decode();
  } catch { /* browser can still display the image */ }
  if (token !== galleryTransitionToken) return;

  if (!REDUCED_GALLERY_MOTION && typeof image.animate === 'function') {
    const out = image.animate([
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      { opacity: 0, transform: `translate3d(${-direction * 7}%,0,0) scale(.985)` }
    ], { duration: 170, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    await out.finished.catch(() => {});
  }
  if (token !== galleryTransitionToken) return;

  currentImage = nextIndex;
  image.src = nextSrc;

  document.querySelectorAll('.gallery-thumb').forEach((node, idx) => node.classList.toggle('active', idx === currentImage));
  const counter = document.getElementById('gallery-counter');
  if (counter) counter.textContent = `${currentImage + 1} / ${images.length}`;

  if (!REDUCED_GALLERY_MOTION && typeof image.animate === 'function') {
    image.getAnimations().forEach((animation) => animation.cancel());
    image.animate([
      { opacity: 0, transform: `translate3d(${direction * 7}%,0,0) scale(1.015)` },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration: 280, easing: 'cubic-bezier(.16,.75,.2,1)', fill: 'both' });
  } else {
    image.style.opacity = '1';
    image.style.transform = 'none';
  }
}

function addToCart() {
  if (!currentProduct || !selectedSize) return;
  const size = currentProduct.sizes.find((item) => item.label === selectedSize);
  const stock = Math.max(0, Number(size?.stock || 0));
  if (stock <= 0) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === currentProduct.id && item.size === selectedSize);
  const currentQuantity = existing?.quantity || 0;
  if (currentQuantity >= stock) {
    showAlert('больше вещей этого размера нет');
    return;
  }
  if (existing) existing.quantity += 1;
  else cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    size: selectedSize,
    image: new URL(assetUrl(currentProduct.images[0]), window.location.href).href,
    quantity: 1,
    stock
  });
  saveCart(cart);
  updateCartCounter();
  showAlert('добавлено в корзину');
}

async function init() {
  updateCartCounter();
  const id = new URLSearchParams(location.search).get('id');
  try {
    const response = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error('load failed');
    const products = await response.json();
    const product = products.find((item) => item.id === id && item.visible !== false);
    if (!product) throw new Error('not found');
    renderProduct(product);
  } catch (error) {
    console.error(error);
    document.getElementById('product-page').innerHTML = '<div class="not-found"><h1>модель не найдена</h1><p><a href="index.html">вернуться на главную</a></p></div>';
  }
}

document.addEventListener('keydown', (event) => {
  const images = currentProduct?.resolvedImages || [];
  if (images.length < 2) return;
  if (event.key === 'ArrowLeft') setImage(currentImage - 1);
  if (event.key === 'ArrowRight') setImage(currentImage + 1);
});

document.addEventListener('DOMContentLoaded', init);
