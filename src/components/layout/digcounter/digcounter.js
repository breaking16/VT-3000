import "./digcounter.scss";

export function init(el) {
  const valueEl = el.querySelector(".digcounter__value");
  const target = Number(el.dataset.value);

  if (!valueEl || !target) return;

  let current = 0;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(progress * target);
    valueEl.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}
