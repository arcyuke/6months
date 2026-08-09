(() => {
  const isMobile = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
  const isHome = document.body.classList.contains('home-page');
  if (!isHome) return;

  const hero = document.querySelector('.hero');
  const catalog = document.getElementById('catalog');
  if (!hero || !catalog) return;

  // Desktop gets the same glitch story block before DOMContentLoaded,
  // so common.js can initialize the existing text rotator on it.
  if (!isMobile && !document.querySelector('.mobile-placeholder')) {
    const placeholder = document.createElement('section');
    placeholder.className = 'mobile-placeholder desktop-glitch-placeholder';
    placeholder.innerHTML = '<div class="history-rotator" aria-live="polite"></div>';
    hero.insertAdjacentElement('afterend', placeholder);
  }

  function railWords() {
    return [
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
      '2026'
    ];
  }

  function makeRail(side) {
    const rail = document.createElement('aside');
    rail.className = `hero-rail hero-rail-${side}`;
    rail.setAttribute('aria-hidden', 'true');

    const makeSet = () => {
      const set = document.createElement('div');
      set.className = 'hero-rail-set';
      railWords().forEach((word) => {
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
    const longPhrase = phrase.repeat(5);

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
      const placeholder = document.querySelector('.mobile-placeholder');
      if (placeholder) placeholder.insertAdjacentElement('beforebegin', marquee);
      else hero.insertAdjacentElement('afterend', marquee);
    } else {
      const grid = catalog.querySelector('.products-grid');
      if (grid) grid.insertAdjacentElement('beforebegin', marquee);
      else catalog.append(marquee);
    }
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
    mountScrollProgress();
  });
})();
