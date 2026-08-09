(() => {
  const isMobile = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
  const isHome = document.body.classList.contains('home-page');
  if (!isHome) return;

  const hero = document.querySelector('.hero');
  const catalog = document.getElementById('catalog');
  if (!hero || !catalog) return;

  // Desktop gets the same glitch story block before DOMContentLoaded,
  // so common.js can initialize the existing rotator on it.
  if (!isMobile && !document.querySelector('.mobile-placeholder')) {
    const placeholder = document.createElement('section');
    placeholder.className = 'mobile-placeholder desktop-glitch-placeholder';
    placeholder.innerHTML = '<div class="history-rotator" aria-live="polite"></div>';
    hero.insertAdjacentElement('afterend', placeholder);
  }

  const railWords = [
    '6 months',
    'distressed',
    'reflective',
    'hand made',
    'baggy',
    'one piece',
    'cut / wear',
    'black',
    'street',
    'raw finish',
    '2026',
    'limited run'
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

    // Long enough that one half of the loop always spans well beyond the viewport.
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

    if (isMobile) {
      // Latest layout: story/glitch block first, then the clothes ribbon, then cards.
      const placeholder = document.querySelector('.mobile-placeholder');
      if (placeholder) placeholder.insertAdjacentElement('afterend', marquee);
      else hero.insertAdjacentElement('afterend', marquee);
    } else {
      // Desktop ribbon belongs to the product area, not the hero.
      const grid = catalog.querySelector('.products-grid');
      if (grid) grid.insertAdjacentElement('beforebegin', marquee);
      else catalog.append(marquee);
    }
  }

  function mountCustomCursor() {
    if (isMobile || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    document.documentElement.classList.add('sixm-custom-cursor');

    const dot = document.createElement('div');
    dot.className = 'sixm-cursor-dot';
    const cross = document.createElement('div');
    cross.className = 'sixm-cursor-cross';
    cross.innerHTML = '<span></span>';
    document.body.append(dot, cross);

    const interactiveSelector = [
      'a',
      'button',
      '[role="button"]',
      '.product-card',
      '.gallery-arrow',
      '.gallery-thumb',
      '.size-option',
      'input',
      'summary'
    ].join(',');

    let x = 0;
    let y = 0;
    let visible = false;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      cross.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${cross.classList.contains('is-target') ? 1 : .72})`;
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
      }
    };

    const updateTarget = (event) => {
      const target = event.target.closest?.(interactiveSelector);
      cross.classList.toggle('is-target', Boolean(target));
      cross.classList.toggle('is-visible', Boolean(target));
    };

    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', updateTarget, { passive: true });
    document.addEventListener('mouseout', updateTarget, { passive: true });
    window.addEventListener('blur', () => {
      visible = false;
      dot.classList.remove('is-visible');
      cross.classList.remove('is-visible', 'is-target');
    });
  }

  function mountScrollProgress() {
    const header = document.querySelector('.site-header');
    if (!header || header.querySelector('.sixm-scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'sixm-scroll-progress';
    header.append(bar);

    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / max));
      bar.style.width = `${progress * 100}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    rebuildRails();
    rebuildMarquee();
    mountCustomCursor();
    mountScrollProgress();
  });
})();
