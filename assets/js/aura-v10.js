(() => {
  const isMobile = /\/mobilebasic(?:\/|$)/.test(window.location.pathname);
  const isHome = document.body.classList.contains('home-page');
  if (!isHome) return;

  const hero = document.querySelector('.hero');
  const catalog = document.getElementById('catalog');
  const main = document.querySelector('body.home-page > main');
  if (!hero || !catalog || !main) return;

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
    hero.querySelectorAll('.hero-grid-side,.hero-grid-panel').forEach((node) => node.remove());
    ['left','right','top','bottom'].forEach((side) => {
      const panel = document.createElement('div');
      panel.className = `hero-grid-panel hero-grid-${side}`;
      panel.setAttribute('aria-hidden', 'true');
      hero.append(panel);
    });
  }

  function makeCatalogGlitchWord() {
    const block = document.createElement('div');
    block.className = 'fashion-marquee fashion-word-glitch';
    block.setAttribute('aria-hidden', 'true');

    const word = document.createElement('span');
    word.className = 'catalog-glitch-word';
    word.dataset.text = 'одежда';
    word.textContent = 'одежда';
    block.append(word);
    return block;
  }

  function rebuildMarquee() {
    document.querySelectorAll('.fashion-marquee').forEach((node) => node.remove());
    const block = makeCatalogGlitchWord();
    const grid = catalog.querySelector('.products-grid');
    if (grid) grid.insertAdjacentElement('beforebegin', block);
    else catalog.append(block);
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

  document.addEventListener('DOMContentLoaded', () => {
    rebuildRails();
    mountHeroGrid();
    rebuildMarquee();
    mountAmbientText();
  });
})();
