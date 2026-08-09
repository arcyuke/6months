(() => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (document.querySelector('.sixm-cursor-dot')) return;

  if (!document.getElementById('sixm-global-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'sixm-global-cursor-style';
    style.textContent = `
      html.sixm-custom-cursor,html.sixm-custom-cursor body,
      html.sixm-custom-cursor a,html.sixm-custom-cursor button,
      html.sixm-custom-cursor [role="button"],html.sixm-custom-cursor input,
      html.sixm-custom-cursor select,html.sixm-custom-cursor textarea,
      html.sixm-custom-cursor summary{cursor:none!important}
      .sixm-cursor-dot,.sixm-cursor-cross{
        position:fixed;left:0;top:0;pointer-events:none;z-index:99999;opacity:0;
        will-change:transform,opacity
      }
      .sixm-cursor-dot{
        width:4px;height:4px;border-radius:50%;background:#f3f3f3;
        box-shadow:0 0 7px rgba(255,255,255,.35)
      }
      .sixm-cursor-cross{
        width:26px;height:26px;transition:opacity .1s ease,transform .12s ease
      }
      .sixm-cursor-cross::before,.sixm-cursor-cross::after{
        content:"";position:absolute;left:50%;top:50%;background:rgba(240,240,240,.72)
      }
      .sixm-cursor-cross::before{width:26px;height:1px;transform:translate(-50%,-50%)}
      .sixm-cursor-cross::after{width:1px;height:26px;transform:translate(-50%,-50%)}
      .sixm-cursor-cross span{position:absolute;inset:5px;border:1px solid rgba(255,255,255,.22);border-radius:50%}
      .sixm-cursor-dot.is-visible{opacity:1}
      .sixm-cursor-cross.is-visible.is-target{opacity:1}
    `;
    document.head.append(style);
  }

  document.documentElement.classList.add('sixm-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'sixm-cursor-dot';
  const cross = document.createElement('div');
  cross.className = 'sixm-cursor-cross';
  cross.innerHTML = '<span></span>';
  document.body.append(dot, cross);

  const interactiveSelector = [
    'a','button','[role="button"]','input','select','textarea','summary',
    '.product-card','.gallery-arrow','.gallery-thumb','.size-option',
    '.cart-item','.quantity-controls button','.remove-item'
  ].join(',');

  let visible = false;
  let isTarget = false;

  const place = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    cross.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${isTarget ? 1 : .72})`;
    if (!visible) {
      visible = true;
      dot.classList.add('is-visible');
    }
  };

  const updateTarget = (event) => {
    isTarget = Boolean(event.target.closest?.(interactiveSelector));
    cross.classList.toggle('is-target', isTarget);
    cross.classList.toggle('is-visible', isTarget);
  };

  document.addEventListener('mousemove', place, { passive: true });
  document.addEventListener('mouseover', updateTarget, { passive: true });
  document.addEventListener('mouseout', updateTarget, { passive: true });
  document.addEventListener('mouseleave', () => {
    visible = false;
    isTarget = false;
    dot.classList.remove('is-visible');
    cross.classList.remove('is-visible', 'is-target');
  });
})();
