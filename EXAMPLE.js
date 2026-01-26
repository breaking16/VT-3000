1)мені треба створити файли menu.main.json(код ти вже дала), а також menu.shop.json/menu.docs.json(приклад коду для цих
файлів напишеш)?
2)чи спочатку чисте recursive меню, а потім плюшки?
3)Ти перепишеш файл src\components\layout\menu\menu.js ?
Зараз все працює(ти не пошкодиш його)?
На всякий пожарний даю тобі його код:
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
ще даю стилі шапки і пунктів меню з темою,логотипом

// src\components\layout\menu\menu.scss
.menu {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;


}

.menu.is-open {
  pointer-events: auto;
}

.menu .is-active,
.header__nav .is-active {
  text-decoration: underline;
  cursor: default;
  pointer-events: none;
  opacity: 0.9;
}


/* panel */
.menu__panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 70vw;
  max-width: 360px;
  height: 100%;
  background: #111;
  color: #fff;
  transform: translateX(-100%);
  transition: transform .35s ease;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.menu.is-open .menu__panel {
  transform: translateX(0);
}

.menu__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu__list {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .55);
  opacity: 0;
  pointer-events: none;
  transition: opacity .25s;
  z-index: 900;
}

.overlay.is-active {
  opacity: 1;
  pointer-events: auto;
}

html.body-locked,
body.body-locked {
  overflow: hidden;
}

стилі шапки

// src\components\layout\header\header.scss
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #111;
  color: #fff;
  transition: background 0.25s ease, box-shadow 0.25s ease;

  &.is-scrolled {
    background: #083d1e;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  }
}


.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.header__spacer {
  flex: 1 1 auto;
}

.header__logo {
  font-weight: 700;
  text-decoration: none;
  color: inherit;
}



.header__nav {
  display: none;

  ul {
    display: flex;
    gap: 20px;
    list-style: none;
  }

  a {
    color: #fff;
    text-decoration: none;

    &.is-active {
      text-decoration: underline;
    }
  }
}



.theme-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}


.menu-toggle {
  --w: 22px;
  --h: 2px;

  position: relative;
  width: var(--w);
  height: 18px;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  .menu-toggle__bar,
  .menu-toggle__bar::before,
  .menu-toggle__bar::after {
    content: "";
    position: absolute;
    width: 100%;
    height: var(--h);
    background: #fff;
    border-radius: 2px;
    transition: transform .25s ease, opacity .25s ease;
  }

  .menu-toggle__bar::before {
    transform: translateY(-6px);
  }

  .menu-toggle__bar::after {
    transform: translateY(6px);
  }

  &.is-active .menu-toggle__bar {
    transform: rotate(45deg);
  }

  &.is-active .menu-toggle__bar::before {
    opacity: 0;
  }

  &.is-active .menu-toggle__bar::after {
    transform: rotate(-90deg);
  }
}

/* DESKTOP ≥ 768px */
@media (min-width: 768px) {
  .header__nav {
    display: block;
  }

  .menu-toggle {
    display: none;
  }
}

/* MOBILE < 768px */
@media (max-width: 767px) {
  .header__nav {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }
}
