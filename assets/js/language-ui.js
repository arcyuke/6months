(() => {
  const SESSION_KEY = '6months-language-session';
  const isMobile = /\/mobilebasic(?:\/|$)/.test(location.pathname);
  const prefix = isMobile ? '../' : '';

  function safeGet() {
    try { return sessionStorage.getItem(SESSION_KEY); }
    catch { return null; }
  }
  function safeSet(value) {
    try { sessionStorage.setItem(SESSION_KEY, value); }
    catch { /* session storage is optional */ }
  }

  let current = safeGet();
  if (current !== 'ru' && current !== 'en') current = null;

  const ruToEn = new Map([
    ['одежда','clothing'],
    ['корзина','bag'],
    ['история','history'],
    ['конфиденциальность','privacy'],
    ['мобильная версия','mobile version'],
    ['полная версия','desktop version'],
    ['на сайт','back to site'],
    ['на главную','home'],
    ['страница не найдена','page not found'],
    ['вернуться на главную','back to home'],
    ['каталог временно недоступен','catalog is temporarily unavailable'],
    ['по запросу','on request'],
    ['нет в наличии','sold out'],
    ['индивидуальный заказ','custom order'],
    ['договорная','on request'],
    ['размер и наличие','size & stock'],
    ['нет','none'],
    ['таблица размеров','size chart'],
    ['значения указаны в см','measurements are in cm'],
    ['замеры будут добавлены после измерения изделия','measurements will be added after the item is measured'],
    ['таблица будет заполнена после реальных замеров футболки','the table will be filled after the T-shirt is measured'],
    ['выберите размер','choose a size'],
    ['добавить в корзину','add to bag'],
    ['обсудить заказ в telegram','discuss order in telegram'],
    ['о модели','about the piece'],
    ['идея','idea'],
    ['модель не найдена','item not found'],
    ['добавлено в корзину','added to bag'],
    ['больше вещей этого размера нет','no more items in this size'],
    ['предыдущее фото','previous photo'],
    ['следующее фото','next photo'],
    ['ваш telegram или телефон','your telegram or phone'],
    ['@username или +7...','@username or phone'],
    ['оформить через telegram','checkout via telegram'],
    ['заказ не оплачивается автоматически. после отправки сообщения мы подтвердим наличие, доставку и оплату.','payment is not automatic. after you send the message, we will confirm stock, delivery and payment.'],
    ['какие данные используются','what data is used'],
    ['для чего нужен контакт','why we need your contact'],
    ['технические данные','technical data'],
    ['изменения','changes'],
    ['контакты','contacts'],
    ['состав корзины сохраняется локально в вашем браузере с помощью localStorage. эти данные нужны только для работы корзины и могут быть удалены очисткой данных сайта в настройках браузера.','your bag is stored locally in your browser using localStorage. this data is only used for the bag and can be removed by clearing site data in your browser settings.'],
    ['сайт не запрашивает данные банковских карт и не принимает оплату напрямую. при оформлении заказа вы можете добровольно указать telegram, номер телефона или другой контакт для связи.','the site does not request bank card details and does not accept payments directly. when placing an order, you may voluntarily provide telegram, a phone number or another contact method.'],
    ['указанные вами контактные данные используются для подтверждения наличия, обсуждения доставки, оплаты и деталей заказа. при переходе в telegram дальнейшая переписка происходит уже на стороне сервиса telegram.','the contact details you provide are used to confirm stock and discuss delivery, payment and order details. once you move to telegram, further communication takes place within telegram.'],
    ['хостинг и внешние сервисы могут автоматически обрабатывать стандартные технические сведения, необходимые для загрузки сайта, защиты от злоупотреблений и работы ссылок.','hosting and external services may automatically process standard technical data required to load the site, prevent abuse and make links work.'],
    ['политика может обновляться вместе с функциональностью сайта. актуальная версия всегда публикуется на этой странице.','this policy may be updated as the site changes. the current version is always published on this page.'],
    ['по вопросам сайта и обработки данных используйте ссылки на','for questions about the site and data processing, use the'],
    ['в подвале сайта.','link in the site footer.'],
    ['проект начался в 2025 году с telegram-канала, куда мы с друзьями выкладывали фотографии прогулок и повседневной жизни. позже из этой среды появилась идея собственного бренда одежды.','the project started in 2025 as a telegram channel where friends posted photos from walks and everyday life. later, the idea of creating a clothing brand grew out of that environment.'],
    ['название прошло несколько этапов: black shirts, wвы atorie, high street — и в итоге 6 months.','the name went through several stages: black shirts, wвы atorie, high street — and eventually 6 months.'],
    ['первая пробная партия состояла из двух моделей: чёрной оверсайз-футболки с ручным дистрессом и широких чёрных джинсов со светоотражающей тканью под прорезями.','the first test drop consisted of two pieces: a black oversized T-shirt with hand distressing and wide black jeans with reflective fabric under the cutouts.'],
    ['сейчас 6 months развивается через архивные модели, единичные изделия, ручные переделки и индивидуальные заказы.','6 months now develops through earlier pieces, one-off garments, hand alterations and custom orders.'],
    ['широкие чёрные джинсы со светоотражающей тканью под дистресс-прорезями','wide black jeans with reflective fabric beneath distressed cutouts'],
    ['чёрная оверсайз-футболка с ручной дистресс-обработкой и прорезями','black oversized T-shirt with hand distressing and cutouts'],
    ['индивидуальная вещь или переделка по вашей идее','a custom piece or alteration based on your idea'],
    ['джинсовая ткань','denim'],
    ['светоотражающие элементы','reflective elements'],
    ['дистресс-обработка','distressed finish'],
    ['машинный пошив','machine stitching'],
    ['хлопок','cotton'],
    ['чёрный цвет','black'],
    ['ручная отделка','hand finished'],
    ['обсуждение идеи до начала работы','idea discussed before work starts'],
    ['материалы подбираются отдельно','materials selected separately'],
    ['срок зависит от сложности','timing depends on complexity'],
    ['ручная и машинная работа','hand and machine work'],
    ['светоотражающие элементы проявляются во вспышке, свете фар и уличных фонарей. вещь меняется вместе с освещением и на несколько секунд становится частью городской среды.','reflective elements appear under flash, headlights and street lights. the piece changes with the lighting and briefly becomes part of the city around it.'],
    ['порезы и вытянутые нити создают у новой вещи ощущение уже прожитой истории. каждый экземпляр немного отличается из-за ручной обработки.','cuts and pulled threads make a new piece feel as if it already carries a history. every item differs slightly because it is finished by hand.'],
    ['индивидуальный заказ — это совместная работа над одной вещью. идея, материалы, посадка и детали обсуждаются до начала изготовления.','a custom order is a collaboration on a single piece. the idea, materials, fit and details are discussed before production starts.'],
    ['размер','size'],
    ['обхват талии','waist'],
    ['обхват бедер','hips'],
    ['ширина внизу','leg opening'],
    ['длина брюк','length'],
    ['наличие','stock'],
    ['грудь','chest'],
    ['длина','length'],
    ['плечи','shoulders'],
    ['рукав','sleeve'],
    ['отсутствует','none'],
    ['ПОЛ ГОДА','HALF A YEAR'],
    ['так переводится название','that is what the name means'],
    ['СЛЕДЫ ВРЕМЕНИ','TRACES OF TIME'],
    ['порезы, ручная обработка, вещи с характером','cuts, hand finishing, pieces with character'],
    ['СВЕТ ВНУТРИ','LIGHT INSIDE'],
    ['reflective детали отвечают на вспышку и улицу','reflective details react to flash and the street'],
    ['НЕ КОНВЕЙЕР','NOT MASS MADE'],
    ['маленькие партии и ручная работа','small runs and hand work'],
    ['НОСИТЬ / ЖИТЬ','WEAR / LIVE'],
    ['одежда меняется вместе с человеком','clothing changes with the person']
  ]);

  const attrMap = new Map([
    ['корзина','bag'],
    ['предыдущее фото','previous photo'],
    ['следующее фото','next photo'],
    ['6 months — на главную','6 months — home'],
    ['главная навигация','main navigation'],
    ['нижняя навигация','footer navigation'],
    ['открыть корзину','open bag']
  ]);

  function translateRaw(value) {
    if (current !== 'en' || typeof value !== 'string') return value;
    if (ruToEn.has(value)) return ruToEn.get(value);
    let match = value.match(/^в наличии:\s*(\d+)\s*шт\.$/i);
    if (match) return `in stock: ${match[1]}`;
    match = value.match(/^(\d+)\s*шт\.$/i);
    if (match) return `${match[1]} pcs.`;
    match = value.match(/^фото\s+(\d+)$/i);
    if (match) return `photo ${match[1]}`;
    return value;
  }

  function translateTextNode(node) {
    if (current !== 'en' || !node?.nodeValue) return;
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,svg')) return;
    const raw = node.nodeValue;
    const match = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match) return;
    const translated = translateRaw(match[2]);
    if (translated !== match[2]) node.nodeValue = `${match[1]}${translated}${match[3]}`;
  }

  function translateAttributes(root) {
    if (current !== 'en' || !(root instanceof Element)) return;
    const nodes = [root, ...root.querySelectorAll('*')];
    nodes.forEach((el) => {
      ['aria-label','placeholder','title'].forEach((name) => {
        const value = el.getAttribute?.(name);
        if (!value) return;
        const translated = attrMap.get(value) || translateRaw(value);
        if (translated !== value) el.setAttribute(name, translated);
      });
    });
  }

  function translateSubtree(root = document.body) {
    if (current !== 'en' || !root) return;
    translateAttributes(root instanceof Element ? root : document.body);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    document.documentElement.lang = 'en';
    const glitch = document.querySelector('.catalog-glitch-word');
    if (glitch) {
      glitch.textContent = 'clothing';
      glitch.dataset.text = 'clothing';
    }
    const hiddenHeading = document.querySelector('.catalog-section .section-heading h2');
    if (hiddenHeading) hiddenHeading.textContent = 'clothing';
    if (/privacy\.html$/.test(location.pathname)) document.title = '6 months — privacy';
  }

  let observer = null;
  function startObserver() {
    if (observer || current !== 'en') return;
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') translateTextNode(mutation.target);
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) translateSubtree(node);
        });
      });
    });
    observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  }

  function ensureTypeStyles() {
    if (document.querySelector('link[data-sixm-type-language]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${prefix}assets/css/type-language.css?v=14`;
    link.dataset.sixmTypeLanguage = '14';
    document.head.append(link);
  }

  function applyLanguage(lang) {
    current = lang === 'en' ? 'en' : 'ru';
    safeSet(current);
    document.documentElement.lang = current;
    document.documentElement.dataset.siteLanguage = current;
    if (current === 'en') {
      translateSubtree(document.body);
      startObserver();
    }
    window.dispatchEvent(new CustomEvent('sixm:languagechange', { detail:{ language:current } }));
  }

  function mountGate() {
    if (current) {
      document.documentElement.classList.remove('sixm-lang-pending');
      applyLanguage(current);
      return;
    }

    const gate = document.createElement('div');
    gate.className = 'sixm-language-gate';
    gate.innerHTML = `
      <div class="sixm-language-panel" role="dialog" aria-modal="true" aria-label="language">
        <span class="sixm-language-brand">6 months</span>
        <p class="sixm-language-label">выберите язык / choose language</p>
        <div class="sixm-language-actions">
          <button class="sixm-language-button" type="button" data-lang="ru">русский</button>
          <button class="sixm-language-button" type="button" data-lang="en">english</button>
        </div>
      </div>`;
    document.body.append(gate);

    gate.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        applyLanguage(button.dataset.lang);
        gate.classList.add('is-leaving');
        document.documentElement.classList.remove('sixm-lang-pending');
        window.setTimeout(() => gate.remove(), 190);
      });
    });
  }

  window.SIXM_LANG = {
    get: () => current || 'ru',
    set: applyLanguage,
    t: translateRaw
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureTypeStyles();
    mountGate();
  });
})();
