(() => {
  const isMobile = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
  const isHome = document.body.classList.contains('home-page');
  if (!isHome) return;

  const hero = document.querySelector('.hero');
  const catalog = document.getElementById('catalog');
  const main = document.querySelector('body.home-page > main');
  if (!hero || !catalog || !main) return;

  // Desktop needs the same story/glitch block as mobile before DOMContentLoaded,
  // because common.js initializes its rotating text on DOMContentLoaded.
  if (!isMobile && !document.querySelector('.mobile-placeholder')) {
    const placeholder = document.createElement('section');
    placeholder.className = 'mobile-placeholder desktop-glitch-placeholder';
    placeholder.innerHTML = '<div class="history-rotator" aria-live="polite"></div>';
    hero.insertAdjacentElement('afterend', placeholder);
  }

  const railWords = [
    '6 months','distressed','reflective','hand made','baggy','one piece',
    'cut / wear','black','street','raw finish','2026','limited run'
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

  function mountHeroGrid() {
    hero.querySelectorAll('.hero-grid-side').forEach((node) => node.remove());
    const left = document.createElement('div');
    const right = document.createElement('div');
    left.className = 'hero-grid-side hero-grid-left';
    right.className = 'hero-grid-side hero-grid-right';
    left.setAttribute('aria-hidden', 'true');
    right.setAttribute('aria-hidden', 'true');
    hero.append(left, right);
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
      ['6 months',7,9,48,-10,-8],['cut / wear',72,12,52,14,-21],['reflective',15,24,49,18,-13],
      ['one piece',82,31,54,-16,-29],['distressed',5,42,50,15,-17],['hand made',69,47,47,-14,-31],
      ['raw finish',23,56,55,20,-9],['black',87,60,51,-18,-25],['6M / 2026',11,69,48,20,-33],
      ['limited run',74,72,57,-15,-12],['baggy',31,81,52,14,-37],['street',84,88,46,-20,-19],
      ['wear / live',9,94,56,18,-41]
    ];

    items.forEach(([text,left,top,dur,dx,delay]) => {
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
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
      }
    }, { passive: true });

    document.addEventListener('mouseover', (event) => {
      const target = event.target.closest?.(interactiveSelector);
      cross.classList.toggle('is-target', Boolean(target));
      cross.classList.toggle('is-visible', Boolean(target));
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      visible = false;
      dot.classList.remove('is-visible');
      cross.classList.remove('is-visible', 'is-target');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Hard cleanup of stale DOM generated by previous aura/common revisions.
    rebuildRails();
    mountHeroGrid();
    rebuildMarquee();
    mountAmbientText();
    mountCustomCursor();
  });
})();
