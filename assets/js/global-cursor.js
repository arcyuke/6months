(function () {
  function initCursor() {
    if (!window.matchMedia || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (document.querySelector('.sixm-cursor-dot')) return;
    if (!document.body) return;

    if (!document.getElementById('sixm-global-cursor-style')) {
      var style = document.createElement('style');
      style.id = 'sixm-global-cursor-style';
      style.textContent = '\n' +
        'html.sixm-custom-cursor,html.sixm-custom-cursor body,' +
        'html.sixm-custom-cursor a,html.sixm-custom-cursor button,' +
        'html.sixm-custom-cursor [role="button"],html.sixm-custom-cursor input,' +
        'html.sixm-custom-cursor select,html.sixm-custom-cursor textarea,' +
        'html.sixm-custom-cursor summary{cursor:none!important}\n' +
        '.sixm-cursor-dot,.sixm-cursor-cross{' +
        'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483646;opacity:0;' +
        'visibility:visible!important;will-change:transform,opacity}\n' +
        '.sixm-cursor-dot{width:4px;height:4px;border-radius:50%;background:#f3f3f3;box-shadow:0 0 7px rgba(255,255,255,.35)}\n' +
        '.sixm-cursor-cross{width:26px;height:26px;transition:opacity .1s ease,transform .12s ease}\n' +
        '.sixm-cursor-cross::before,.sixm-cursor-cross::after{content:"";position:absolute;left:50%;top:50%;background:rgba(240,240,240,.72)}\n' +
        '.sixm-cursor-cross::before{width:26px;height:1px;transform:translate(-50%,-50%)}\n' +
        '.sixm-cursor-cross::after{width:1px;height:26px;transform:translate(-50%,-50%)}\n' +
        '.sixm-cursor-cross span{position:absolute;inset:5px;border:1px solid rgba(255,255,255,.22);border-radius:50%}\n' +
        '.sixm-cursor-dot.is-visible{opacity:1}\n' +
        '.sixm-cursor-cross.is-visible.is-target{opacity:1}\n';
      document.head.appendChild(style);
    }

    document.documentElement.classList.add('sixm-custom-cursor');

    var dot = document.createElement('div');
    dot.className = 'sixm-cursor-dot';
    var cross = document.createElement('div');
    cross.className = 'sixm-cursor-cross';
    cross.innerHTML = '<span></span>';
    document.body.appendChild(dot);
    document.body.appendChild(cross);

    var interactiveSelector = [
      'a','button','[role="button"]','input','select','textarea','summary',
      '.product-card','.gallery-arrow','.gallery-thumb','.size-option',
      '.cart-item','.quantity-controls button','.remove-item','.sixm-language-panel'
    ].join(',');

    var visible = false;
    var isTarget = false;

    function place(event) {
      var x = event.clientX;
      var y = event.clientY;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      cross.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) scale(' + (isTarget ? 1 : .72) + ')';
      if (!visible) {
        visible = true;
        dot.classList.add('is-visible');
      }
    }

    function updateTarget(event) {
      var target = event.target;
      isTarget = Boolean(target && target.closest && target.closest(interactiveSelector));
      cross.classList.toggle('is-target', isTarget);
      cross.classList.toggle('is-visible', isTarget);
    }

    document.addEventListener('mousemove', place, { passive:true });
    document.addEventListener('mouseover', updateTarget, { passive:true });
    document.addEventListener('mouseout', updateTarget, { passive:true });
    document.addEventListener('mouseleave', function () {
      visible = false;
      isTarget = false;
      dot.classList.remove('is-visible');
      cross.classList.remove('is-visible');
      cross.classList.remove('is-target');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor, { once:true });
  } else {
    initCursor();
  }
})();
