(() => {
  const railWords = [
    '6 months','distressed','reflective','hand made','baggy','one piece','cut / wear','black','street','2026','raw finish','oversize','flash','night','limited','texture','denim','cotton','made slow','wear it','marked','rough edge','shape','movement','one by one','six months','made by hand','wide fit'
  ];
  const marqueeWords = ['одежда','вещи','одежда','каталог','шмот','6 months','distressed','reflective','baggy','ручная работа'];

  function railSet() {
    return `<div class="hero-rail-set">${railWords.map((word) => `<div class="hero-rail-word">${word}</div>`).join('')}</div>`;
  }

  function rail(side) {
    const set = railSet();
    return `<aside class="hero-rail hero-rail-${side}" aria-hidden="true"><div class="hero-rail-track">${set}${set}</div></aside>`;
  }

  function marqueeSet() {
    const text = marqueeWords.map((word) => `<span>${word}</span><i aria-hidden="true"> · </i>`).join('');
    return `<div class="fashion-marquee-set">${text}</div>`;
  }

  function marquee() {
    const set = marqueeSet();
    return `<div class="fashion-marquee" aria-hidden="true"><div class="fashion-marquee-track">${set}${set}</div></div>`;
  }

  function mountHomeAura() {
    const hero = document.querySelector('.hero');
    const catalog = document.getElementById('catalog');
    if (!hero || !catalog) return;

    document.body.classList.add('aura-v5');

    hero.querySelectorAll('.hero-rail').forEach((node) => node.remove());
    hero.insertAdjacentHTML('beforeend', rail('left') + rail('right'));

    document.querySelectorAll('.fashion-marquee').forEach((node) => node.remove());
    const tape = marquee();
    const placeholder = document.querySelector('.mobile-placeholder');
    if (placeholder) placeholder.insertAdjacentHTML('beforebegin', tape);
    else hero.insertAdjacentHTML('afterend', tape);

    const heading = catalog.querySelector('.section-heading h2');
    if (heading) {
      heading.textContent = 'одежда';
      heading.dataset.target = 'одежда';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHomeAura);
  } else {
    mountHomeAura();
  }
})();
