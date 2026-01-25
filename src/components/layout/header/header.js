// src\components\layout\header\header.js
export function init() {
  const header = document.querySelector("[data-ww-header]");
  if (!header) return;

  const SCROLL_CLASS = "is-scrolled";

  const onScroll = () => {
    header.classList.toggle(SCROLL_CLASS, window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll);

  console.log("[LAYOUT] header init");
}
