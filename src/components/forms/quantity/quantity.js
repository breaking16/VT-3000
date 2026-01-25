export function init(root = document) {
  const quantities = root.querySelectorAll("[data-ww-quantity]");
  if (!quantities.length) return;

  quantities.forEach((wrap) => {
    const input = wrap.querySelector("input");
    const plus = wrap.querySelector(".quantity__button--plus");
    const minus = wrap.querySelector(".quantity__button--minus");

    if (!input || !plus || !minus) return;

    const min = Number(input.min) || 1;
    const step = Number(input.step) || 1;

    plus.addEventListener("click", () => {
      input.value = Number(input.value || min) + step;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    minus.addEventListener("click", () => {
      const value = Number(input.value || min) - step;
      input.value = value < min ? min : value;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  console.log("[FORM] quantity init");
}
