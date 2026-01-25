// src\components\layout\menu\menu.js

import { isEscape } from "@js/services/keyboard.js";

let menu;
let openBtn;
let closeBtn;
let overlay;
let isOpen = false;

function lockBody() {
  document.documentElement.classList.add("body-locked");
  document.body.classList.add("body-locked");
}

function unlockBody() {
  document.documentElement.classList.remove("body-locked");
  document.body.classList.remove("body-locked");
}

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

function onKeydown(e) {
  if (isEscape(e)) closeMenu();
}

export function init() {
  menu = document.querySelector("[data-ww-menu]");
  overlay = document.querySelector("[data-ww-overlay]");
  openBtn = document.querySelector("[data-ww-menu-open]");
  closeBtn = document.querySelector("[data-ww-menu-close]");

  if (!menu || !openBtn || !overlay) return;

  openBtn.addEventListener("click", openMenu);
  overlay.addEventListener("click", closeMenu);
  closeBtn?.addEventListener("click", closeMenu);

  console.log("[MENU] offcanvas ready");
}
