// src/components/layout/popup/popup.js
// ⬆️ ВЕРХ ФАЙЛУ (imports)

import "./popup.scss";

import { isEscape } from "@js/services/keyboard.js";
import { lockBody, unlockBody } from "@js/services/body.js";
import { saveFocus, restoreFocus } from "@js/services/focus.js";

let activePopup = null;

function openPopup(popup) {
  if (activePopup) closePopup(activePopup);

  saveFocus();
  activePopup = popup;

  popup.classList.add("is-open");
  popup.setAttribute("aria-hidden", "false");

  lockBody();

  document.addEventListener("keydown", onKeydown);
}

function closePopup(popup) {
  popup.classList.remove("is-open");
  popup.setAttribute("aria-hidden", "true");

  unlockBody();
  restoreFocus();

  activePopup = null;
  document.removeEventListener("keydown", onKeydown);
}

function onKeydown(e) {
  if (isEscape(e) && activePopup) {
    closePopup(activePopup);
  }
}

export function init() {
  // open triggers
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-popup-open]");
    if (!openBtn) return;

    const id = openBtn.dataset.popupOpen;
    const popup = document.getElementById(id);
    if (!popup) return;

    e.preventDefault();
    openPopup(popup);
  });

  // close triggers
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-popup-close]");
    if (!closeBtn || !activePopup) return;

    e.preventDefault();
    closePopup(activePopup);
  });
}
