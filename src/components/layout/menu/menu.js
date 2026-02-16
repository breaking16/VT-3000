// src/components/layout/menu/menu.js
import { isEscape } from "@js/services/keyboard.js";

let menu;
let openBtn;
let closeBtn;
let overlay;
let isOpen = false;

// ===== ACTIVE MENU LINK =====
const currentPath = window.location.pathname;

document.querySelectorAll(".menu__link").forEach((link) => {
  const linkPath = new URL(link.href).pathname;

  if (linkPath === currentPath) {
    link.classList.add("menu__link--active");

    // якщо пункт у підменю — підсвічуємо батька
    const parentSubMenu = link.closest(".menu__sub-item");
    if (parentSubMenu) {
      parentSubMenu
        .closest(".menu__item")
        ?.querySelector(".menu__link")
        ?.classList.add("menu__link--active");
    }
  }
});

/* =========================
BODY LOCK
========================= */
function lockBody() {
  document.documentElement.classList.add("body-locked");
  document.body.classList.add("body-locked");
}

function unlockBody() {
  document.documentElement.classList.remove("body-locked");
  document.body.classList.remove("body-locked");
}

/* =========================
SUBMENUS HELPERS
========================= */
function closeAllSubmenus(root = document) {
  root.querySelectorAll(".has-submenu.is-open").forEach((item) => {
    item.classList.remove("is-open");
  });
}

/* =========================
OFFCANVAS MENU
========================= */
function openMenu() {
  if (isOpen) return;
  isOpen = true;

  menu.classList.add("is-open");
  overlay.classList.add("is-active");
  openBtn.classList.add("is-active");

  menu.setAttribute("aria-hidden", "false");
  openBtn.setAttribute("aria-expanded", "true");

  lockBody();
}

function closeMenu() {
  if (!isOpen) return;
  isOpen = false;

  menu.classList.remove("is-open");
  overlay.classList.remove("is-active");
  openBtn.classList.remove("is-active");

  menu.setAttribute("aria-hidden", "true");
  openBtn.setAttribute("aria-expanded", "false");

  closeAllSubmenus(menu);
  unlockBody();
}

/* =========================
KEYBOARD (ESC)
========================= */
function onKeydown(e) {
  if (!isEscape(e)) return;

  // 1. Закриваємо ВСІ submenu
  closeAllSubmenus(document);

  // 2. Закриваємо offcanvas, якщо відкритий
  if (isOpen) {
    closeMenu();
  }

  // 3. Знімаємо focus, щоб не було білого бордера
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

/* =========================
OUTSIDE CLICK (DESKTOP)
========================= */
function onOutsideClick(e) {
  const clickedInsideMenu =
    e.target.closest(".has-submenu") ||
    e.target.closest(".menu__arrow") ||
    e.target.closest(".menu__sublist") ||
    e.target.closest("[data-ww-menu-open]");

  if (!clickedInsideMenu) {
    closeAllSubmenus(document);
  }
}

/* =========================
SUBMENUS (ALL LEVELS)
========================= */
function initSubmenus(root = document) {
  root.querySelectorAll(".menu__arrow").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const item = btn.closest(".has-submenu");
      if (!item) return;

      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        // закриваємо siblings на цьому рівні
        item.parentElement
          .querySelectorAll(":scope > .has-submenu.is-open")
          .forEach((s) => {
            if (s !== item) s.classList.remove("is-open");
          });
      }

      item.classList.toggle("is-open");
    });
  });
}

/* =========================
INIT
========================= */
export function init() {
  menu = document.querySelector("[data-ww-menu]");
  overlay = document.querySelector("[data-ww-overlay]");
  openBtn = document.querySelector("[data-ww-menu-open]");
  closeBtn = document.querySelector("[data-ww-menu-close]");

  if (!menu || !openBtn || !overlay) return;

  openBtn.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // GLOBAL handlers
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("pointerdown", onOutsideClick);

  initSubmenus(menu);
  initSubmenus(document.querySelector(".header__nav"));

  console.log("[MENU] offcanvas + multilevel + ESC + outside click READY");
}
