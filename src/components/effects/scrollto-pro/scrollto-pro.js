// src\components\effects\scrollto-pro\scrollto-pro.js
let SCROLLTO_EVENT = new Event("ww:scrollto");

export function init(root = document) {
  const triggers = root.querySelectorAll("[data-ww-scrollto]");
  if (!triggers.length) return;

  function getHeaderHeight() {
    const header = document.querySelector("[data-ww-header]");
    return header ? header.offsetHeight : 0;
  }

  function scrollToTarget(target, offset = 0, useHeader = false) {
    const rect = target.getBoundingClientRect();

    const to =
      window.pageYOffset + rect.top - offset - (useHeader ? getHeaderHeight() : 0);

    window.scrollTo({
      top: to,
      behavior: "smooth",
    });

    document.dispatchEvent(new CustomEvent("ww:scrollto", { detail: { target } }));
  }

  function handleClick(e, btn) {
    e.preventDefault();

    const selector = btn.dataset.wwScrollto;
    const offset = Number(btn.dataset.wwOffset) || 0;
    const useHeader = btn.hasAttribute("data-ww-header");

    const target = document.querySelector(selector);
    if (!target) return;

    // якщо меню відкрите → закриваємо через єдиний евент
    document.dispatchEvent(new CustomEvent("menu:close"));

    scrollToTarget(target, offset, useHeader);
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => handleClick(e, btn));
  });

  // === Watcher-PRO sync: highlight active menu link ===
  document.addEventListener("ww:in-view", (e) => {
    const el = e.detail.target;

    const link = document.querySelector(
      `[data-ww-scrollto="#${el.id}"],
     [data-ww-scrollto=".${el.classList[0]}"]`
    );

    if (!link) return;

    document
      .querySelectorAll("[data-ww-scrollto].is-active")
      .forEach((l) => l.classList.remove("is-active"));

    link.classList.add("is-active");
  });

  // 🔹 підтримка переходу по hash після завантаження сторінки
  window.addEventListener("load", () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;

    scrollToTarget(target, 0, true);
  });

  console.log("[EFFECT] scrollto-pro init");
}
