import noUiSlider from "nouislider";

export function init(el) {
  const min = Number(el.dataset.min ?? 0);
  const max = Number(el.dataset.max ?? 100);
  const start = el.dataset.start
    ? el.dataset.start.split(",").map(Number)
    : [min, max];

  noUiSlider.create(el, {
    start,
    connect: true,
    range: {
      min,
      max,
    },
    tooltips: true,
  });
}
