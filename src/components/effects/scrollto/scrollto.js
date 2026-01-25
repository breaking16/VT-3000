// src/components/effects/scrollto/scrollto.js
// ⬆️ весь файл

export function init(root = document) {
  const triggers = root.querySelectorAll("[data-scrollto]");
  if (!triggers.length) return;

  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const selector = btn.dataset.scrollto;
      if (!selector) return;

      const target = document.querySelector(selector);
      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  console.log("[EFFECT] scrollto init");
}
