// src\components\layout\menu\menu.js
import { isEscape } from "@js/services/keyboard.js";

let menu;
let openBtn;
let overlay;
let isOpen = false;

/* =======================
   BODY LOCK
======================= */
function lockBody() {
  document.documentElement.classList.add("body-locked");
  document.body.classList.add("body-locked");
}

function unlockBody() {
  document.documentElement.classList.remove("body-locked");
  document.body.classList.remove("body-locked");
}

/* =======================
   OPEN
======================= */
function openMenu() {
  if (isOpen) return;

  isOpen = true;

  menu.classList.add("is-open");
  overlay.classList.add("is-active");
  openBtn.classList.add("is-active");

  menu.setAttribute("aria-hidden", "false");
  openBtn.setAttribute("aria-expanded", "true");

  lockBody();

  document.addEventListener("keydown", onKeydown);
}

/* =======================
   CLOSE
======================= */
function closeMenu() {
  if (!isOpen) return;

  isOpen = false;

  menu.classList.remove("is-open");
  overlay.classList.remove("is-active");
  openBtn.classList.remove("is-active");

  menu.setAttribute("aria-hidden", "true");
  openBtn.setAttribute("aria-expanded", "false");

  unlockBody();

  document.removeEventListener("keydown", onKeydown);
}

/* =======================
   ESC
======================= */
function onKeydown(e) {
  if (isEscape(e)) closeMenu();
}

/* =======================
   INIT
======================= */
export function init() {
  const menu = document.querySelector("[data-ww-menu]");
  const openBtn = document.querySelector("[data-ww-menu-open]");

  if (!menu || !openBtn) return;

  openBtn.addEventListener("click", () => {
    menu.classList.toggle("is-open");
    openBtn.classList.toggle("is-active");
    document.body.classList.toggle("body-locked");
  });
}
