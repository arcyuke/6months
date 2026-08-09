(() => {
  const isMobile = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
  const isHome = document.body.classList.contains('home-page');
  if (!isHome) return;

  const hero = document.querySelector('.hero');
  const catalog = document.getElementById('catalog');
  const main = document.querySelector('body.home-page > main');
  if (!hero || !catalog || !main) return;

  // Desktop gets the same glitch story block as mobile.
  if (!isMobile && !document.querySelector('.mobile-placeholder')) {
    const placeholder = document.createElement('section');
    placeholder.className = 'mobile-placeholder desktop-glitch-placeholder';
    placeholder.innerHTML = '<div class="history-rotator" aria-live="polite"></div>';
    hero.insertAdjacentElement('afterend', placeholder);
  }

  const railWords = [
    '6 months', 'distressed', 'reflective', 'hand made', 'baggy', 'one piece',
    'cut / wear', 'black', 'street', 'raw finish', '2026', 'limited run'
  ];

  function makeRail(side) {
    const rail = document.createElement('aside');
    rail.className = `hero-rail hero-rail-${side}`;
    rail.setAttribute('aria-hidden', 'true');

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'hero-rail-set';
      railWords.forEach((word) => {
        const item = document.createElement('div');
        item.className = 'hero-rail-word';
        item.textContent = word;
        set.append(item);
      });
      return set;
    };

    const track = document.createElement('div');
    track.className = 'hero-rail-track';
    track.append(makeSet(), makeSet());
    rail.append(track);
    return rail;
  }

  function rebuildRails() {
    hero.querySelectorAll('.hero-rail').forEach((node) => node.remove());
    hero.append(makeRail('left'), makeRail('right'));
  }

  function makeMarquee() {
    const marquee = document.createElement('div');
    marquee.className = 'fashion-marquee';
    marquee.setAttribute('aria-hidden', 'true');

    const track = document.createElement('div');
    track.className = 'fashion-marquee-track';

    const phrase = 'одежда  ·  вещи  ·  одежда  ·  каталог  ·  шмот  ·  6 months  ·  ';
    const longPhrase = phrase.repeat(8);

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'fashion-marquee-set';
      const span = document.createElement('span');
      span.textContent = longPhrase;
      set.append(span);
      return set;
    };

    track.append(makeSet(), makeSet());
    marquee.append(track);
    return marquee;
  }

  function rebuildMarquee() {
    document.querySelectorAll('.fashion-marquee').forEach((node) => node.remove());
    const marquee = makeMarquee();
    const grid = catalog.querySelector('.products-grid');
    if (grid) grid.insertAdjacentElement('beforebegin', marquee);
    else catalog.append(marquee);
  }

  function mountAmbientText() {
    main.querySelector('.sixm-ambient')?.remove();
    const layer = document.createElement('div');
    layer.className = 'sixm-ambient';
    layer.setAttribute('aria-hidden', 'true');

    const items = [
      ['6 months', 7, 9, 35, -12, -4],
      ['cut / wear', 72, 12, 41, 18, -17],
      ['reflective', 15, 24, 38, 24, -9],
      ['one piece', 82, 31, 44, -20, -21],
      ['distressed', 5, 42, 39, 19, -11],
      ['hand made', 69, 47, 36, -16, -23],
      ['raw finish', 23, 56, 43, 28, -6],
      ['black', 87, 60, 40, -22, -15],
      ['6M / 2026', 11, 69, 37, 26, -19],
      ['limited run', 74, 72, 46, -18, -8],
      ['baggy', 31, 81, 42, 17, -27],
      ['street', 84, 88, 35, -25, -13],
      ['wear / live', 9, 94, 45, 23, -31]
    ];

    items.forEach(([text, left, top, dur, dx, delay]) => {
      const el = document.createElement('span');
      el.className = 'sixm-ambient-word';
      el.textContent = text;
      el.style.left = `${left}%`;
      el.style.top = `${top}%`;
      el.style.setProperty('--dur', `${dur}s`);
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--delay', `${delay}s`);
      layer.append(el);
    });

    main.prepend(layer);
  }

  function mountCustomCursor() {
    if (isMobile || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (document.querySelector('.sixm-cursor-dot')) return;

    document.documentElement.classList.add('sixm-custom-cursor');
    const dot = document.createElement('div');
    dot.className = 'sixm-cursor-dot';
    const cross = document.createElement('div');
    cross.className = 'sixm-cursor-cross';
    cross.innerHTML = '<span></span>';
    document.body.append(dot, cross);

    const interactiveSelector = [
      'a','button','[role="button"]','.product-card','.gallery-arrow','.gallery-thumb',
      '.size-option','input','summary'
    ].join(',');

    let visible = false;
    document.addEventListener('mousemove', (event) => {
      const x = event.clientX;
      const y = event.clientY;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      cross.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${cross.classList.contains('is-target') ? 1 : .72})`;
      if (!visible) { visible = true; dot.classList.add('is-visible'); }
    }, { passive: true });

    document.addEventListener('mouseover', (event) => {
      const target = event.target.closest?.(interactiveSelector);
      cross.classList.toggle('is-target', Boolean(target));
      cross.classList.toggle('is-visible', Boolean(target));
    }, { passive: true });

    window.addEventListener('blur', () => {
      visible = false;
      dot.classList.remove('is-visible');
      cross.classList.remove('is-visible', 'is-target');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    rebuildRails();
    rebuildMarquee();
    mountAmbientText();
    mountCustomCursor();
  });
})();
