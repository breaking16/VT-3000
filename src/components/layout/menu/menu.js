/* src/components/layout/menu/menu.js */

import "./menu.scss";
import { renderMenu } from "./menu.render.js";
import { isEscape } from "@js/services/keyboard.js";

let menu;
let openBtn;
let closeBtn;
let overlay;
let isOpen = false;

/* =========================
ACTIVE LINK (ПІСЛЯ render)
========================= */
function highlightActiveLinks() {
  const currentPath = window.location.pathname;

  document.querySelectorAll(".menu__link").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;

    if (linkPath === currentPath) {
      link.classList.add("menu__link--active");

      const parentItem = link.closest(".has-submenu");
      parentItem
        ?.querySelector(":scope > .menu__link")
        ?.classList.add("menu__link--active");
    }
  });
}

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
SUBMENUS
========================= */
function closeAllSubmenus(root = document) {
  root.querySelectorAll(".has-submenu.is-open").forEach((item) => {
    item.classList.remove("is-open");
  });
}

function initSubmenus(root = document) {
  root.querySelectorAll(".menu__arrow").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const item = btn.closest(".has-submenu");
      if (!item) return;

      item.classList.toggle("is-open");
    });
  });
}

/* =========================
OFFCANVAS
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
INIT
========================= */
export function init() {
  // 1️⃣ Будуємо DOM з JSON
  renderMenu();

  // 2️⃣ Після рендеру — підсвічуємо активний пункт
  highlightActiveLinks();

  // 3️⃣ Беремо DOM
  menu = document.querySelector("[data-ww-menu]");
  overlay = document.querySelector("[data-ww-overlay]");
  openBtn = document.querySelector("[data-ww-menu-open]");
  closeBtn = document.querySelector("[data-ww-menu-close]");

  if (!menu || !openBtn || !overlay) return;

  openBtn.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (!isEscape(e)) return;
    closeAllSubmenus(document);
    if (isOpen) closeMenu();
  });

  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".has-submenu")) {
      closeAllSubmenus(document);
    }
  });

  initSubmenus(menu);
  initSubmenus(document.querySelector(".header__nav"));

  console.log("[MENU] initialized correctly");
}
