(function () {
  var STORAGE_KEY = '6months-view-mode';
  var LANGUAGE_KEY = '6months-language-session';
  var path = window.location.pathname;
  var onMobileVersion = /\/mobilebasic(?:\/|$)/.test(path);
  var onAdmin = /\/admin\.html$/.test(path);

  function readStorage(storage, key) {
    try { return storage.getItem(key); }
    catch (error) { return null; }
  }

  function writeStorage(storage, key, value) {
    try { storage.setItem(key, value); }
    catch (error) { /* routing still works without persistent storage */ }
  }

  function getQueryParam(name) {
    if (window.URLSearchParams) {
      return new URLSearchParams(window.location.search).get(name);
    }
    var query = window.location.search.replace(/^\?/, '').split('&');
    for (var i = 0; i < query.length; i += 1) {
      var pair = query[i].split('=');
      if (decodeURIComponent(pair[0] || '') === name) return decodeURIComponent(pair[1] || '');
    }
    return null;
  }

  function cleanSearch() {
    var raw = window.location.search.replace(/^\?/, '');
    if (!raw) return '';
    var parts = raw.split('&').filter(function (part) {
      return decodeURIComponent((part.split('=')[0] || '')) !== 'view';
    });
    return parts.length ? '?' + parts.join('&') : '';
  }

  var requested = getQueryParam('view');
  if (requested === 'desktop' || requested === 'mobile') {
    writeStorage(window.localStorage, STORAGE_KEY, requested);
  }

  var preference = (requested === 'desktop' || requested === 'mobile')
    ? requested
    : readStorage(window.localStorage, STORAGE_KEY);

  var narrowScreen = window.matchMedia ? window.matchMedia('(max-width: 820px)').matches : window.innerWidth <= 820;
  var touchDevice = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
  touchDevice = touchDevice || (navigator.maxTouchPoints || 0) > 0;
  var mobileBrowser = /Android|iPhone|iPod|Mobile|IEMobile|Windows Phone|Telegram/i.test(navigator.userAgent || '');
  var looksLikePhone = narrowScreen && (touchDevice || mobileBrowser);
  var shouldUseMobile = preference === 'mobile' || (preference !== 'desktop' && looksLikePhone);

  function mobileTarget() {
    var search = cleanSearch();
    var hash = window.location.hash || '';
    if (/\/product_months\.html$/.test(path)) return 'mobilebasic/product.html' + search + hash;
    if (/\/bag\.html$/.test(path)) return 'mobilebasic/bag.html' + search + hash;
    if (/\/about\.html$/.test(path)) return 'mobilebasic/about.html' + search + hash;
    if (/\/privacy\.html$/.test(path)) return 'mobilebasic/privacy.html' + search + hash;
    return 'mobilebasic/' + search + hash;
  }

  function desktopTarget() {
    var search = cleanSearch();
    var hash = window.location.hash || '';
    if (/\/mobilebasic\/product\.html$/.test(path)) return '../product_months.html' + search + hash;
    if (/\/mobilebasic\/bag\.html$/.test(path)) return '../bag.html' + search + hash;
    if (/\/mobilebasic\/about\.html$/.test(path)) return '../about.html' + search + hash;
    if (/\/mobilebasic\/privacy\.html$/.test(path)) return '../privacy.html' + search + hash;
    return '../index.html' + search + hash;
  }

  if (!onAdmin && !onMobileVersion && shouldUseMobile) {
    window.location.replace(mobileTarget());
    return;
  }
  if (!onAdmin && onMobileVersion && !shouldUseMobile) {
    window.location.replace(desktopTarget());
    return;
  }

  if (requested && window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + cleanSearch() + (window.location.hash || ''));
  }

  if (onAdmin) return;

  var sessionLanguage = readStorage(window.sessionStorage, LANGUAGE_KEY);
  if (sessionLanguage !== 'ru' && sessionLanguage !== 'en') {
    document.documentElement.classList.add('sixm-lang-pending');
    var preloadStyle = document.createElement('style');
    preloadStyle.id = 'sixm-language-preload-style';
    preloadStyle.textContent = 'html.sixm-lang-pending,html.sixm-lang-pending body{background:#000!important}' +
      'html.sixm-lang-pending body{opacity:1!important;transform:none!important;overflow:hidden!important}' +
      'html.sixm-lang-pending body>*:not(.sixm-language-gate):not(.sixm-cursor-dot):not(.sixm-cursor-cross){visibility:hidden!important}' +
      'html.sixm-lang-pending .sixm-language-gate,html.sixm-lang-pending .sixm-cursor-dot,html.sixm-lang-pending .sixm-cursor-cross{visibility:visible!important}';
    document.head.appendChild(preloadStyle);

    /* Never leave a browser on a black screen if the chooser script fails to load. */
    window.setTimeout(function () {
      if (!document.documentElement.classList.contains('sixm-lang-pending')) return;
      if (document.querySelector('.sixm-language-gate')) return;
      document.documentElement.classList.remove('sixm-lang-pending');
    }, 3500);
  }
})();
