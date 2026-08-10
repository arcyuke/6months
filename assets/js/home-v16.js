(function () {
  var RU_LEFT = ['ручная обработка','маленькие партии','светоотражающие детали','широкий крой','first drop','2026'];
  var RU_RIGHT = ['каждая вещь отличается','кастом под заказ','ручная + машинная работа','чёрная база','заказ через telegram','6 months'];
  var EN_LEFT = ['hand finished','small runs','reflective details','baggy fit','first drop','2026'];
  var EN_RIGHT = ['each piece differs','custom order','hand + machine made','black base','order via telegram','6 months'];

  function currentLanguage() {
    if (window.SIXM_LANG && typeof window.SIXM_LANG.get === 'function') return window.SIXM_LANG.get();
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ru';
  }

  function fillRail(rail, words) {
    if (!rail) return;
    var sets = rail.querySelectorAll('.hero-rail-set');
    for (var s = 0; s < sets.length; s += 1) {
      sets[s].innerHTML = '';
      for (var i = 0; i < words.length; i += 1) {
        var item = document.createElement('div');
        item.className = 'hero-rail-word';
        item.textContent = words[i];
        sets[s].appendChild(item);
      }
    }
  }

  function updateRails() {
    var isEnglish = currentLanguage() === 'en';
    fillRail(document.querySelector('.hero-rail-left'), isEnglish ? EN_LEFT : RU_LEFT);
    fillRail(document.querySelector('.hero-rail-right'), isEnglish ? EN_RIGHT : RU_RIGHT);
  }

  function removeAmbientCopy() {
    var ambient = document.querySelector('.sixm-ambient');
    if (ambient && ambient.parentNode) ambient.parentNode.removeChild(ambient);
  }

  function startLogoFontCycle() {
    var logo = document.querySelector('.home-logo');
    if (!logo || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var fonts = [
      '"Helvetica Neue",Arial,sans-serif',
      'Arial,"Helvetica Neue",sans-serif',
      '"Segoe UI",Arial,sans-serif',
      'Tahoma,"Segoe UI",Arial,sans-serif',
      '"Trebuchet MS","Segoe UI",Arial,sans-serif',
      'Verdana,"Segoe UI",Arial,sans-serif'
    ];
    var index = 0;
    logo.style.setProperty('font-family', fonts[0], 'important');

    window.setInterval(function () {
      if (document.hidden) return;
      index = (index + 1) % fonts.length;
      logo.classList.add('sixm-font-hop');
      window.setTimeout(function () {
        logo.style.setProperty('font-family', fonts[index], 'important');
        logo.classList.remove('sixm-font-hop');
      }, 70);
    }, 1700);
  }

  function tuneStoryRotator() {
    var rotator = document.querySelector('.history-rotator');
    if (!rotator) return;
    var accent = rotator.querySelector('.history-accent');
    if (!accent) return;

    var positions = {
      'ПОЛ ГОДА':['50%','22%'],
      'HALF A YEAR':['50%','22%'],
      'СЛЕДЫ ВРЕМЕНИ':['30%','42%'],
      'TRACES OF TIME':['30%','42%'],
      'СВЕТ ВНУТРИ':['70%','56%'],
      'LIGHT INSIDE':['70%','56%'],
      'НЕ КОНВЕЙЕР':['31%','76%'],
      'NOT MASS MADE':['31%','76%'],
      'НОСИТЬ / ЖИТЬ':['67%','84%'],
      'WEAR / LIVE':['67%','84%']
    };

    function sync() {
      var key = (accent.textContent || '').trim().toUpperCase();
      accent.setAttribute('data-text', accent.textContent || '');
      if (!positions[key]) return;
      rotator.style.setProperty('--x', positions[key][0]);
      rotator.style.setProperty('--y', positions[key][1]);
    }

    sync();
    if (!window.MutationObserver) return;
    var observer = new MutationObserver(function () { window.requestAnimationFrame(sync); });
    observer.observe(accent, { childList:true, subtree:true, characterData:true });
  }

  function init() {
    if (!document.body || !document.body.classList.contains('home-page')) return;
    window.setTimeout(function () {
      updateRails();
      removeAmbientCopy();
      tuneStoryRotator();
    }, 0);
    startLogoFontCycle();
    window.addEventListener('sixm:languagechange', function () {
      window.setTimeout(updateRails, 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
