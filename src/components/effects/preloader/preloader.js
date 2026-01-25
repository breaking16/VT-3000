// src/components/effects/preloader/preloader.js
// ⬆️ весь файл

export function init() {
  const preloader = document.querySelector("[data-preloader]");
  if (!preloader) return;

  window.addEventListener("load", () => {
    preloader.classList.add("is-hidden");

    setTimeout(() => {
      preloader.remove();
    }, 500);
  });

  console.log("[EFFECT] preloader init");
}
