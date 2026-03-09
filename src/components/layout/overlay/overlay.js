// src/components/layout/overlay/overlay.js

import "./overlay.scss";

import { unlockBody } from "@js/services/body.js";

const SELECTOR = "[data-ww-overlay]";
let activeCloseFn = null;

function getOverlay(root = document) {
  return root.querySelector(SELECTOR);
}

/* ==========================
   API
========================== */

export function showOverlay(onClose, root = document) {
  const el = getOverlay(root);
  if (!el) return;

  activeCloseFn = typeof onClose === "function" ? onClose : null;

  el.hidden = false;
  el.classList.add("is-active");
}

export function hideOverlay(root = document) {
  const el = getOverlay(root);
  if (!el) return;

  el.classList.remove("is-active");
  el.hidden = true;

  activeCloseFn = null;
}

/**
 * Allow modules to replace handler later
 */
export function setOverlayCloseHandler(fn) {
  activeCloseFn = typeof fn === "function" ? fn : null;
}

export function clearOverlayCloseHandler() {
  activeCloseFn = null;
}

/* ==========================
   INIT (runs once globally)
========================== */

export function init(root = document) {
  const el = getOverlay(root);
  if (!el) return;

  el.hidden = true;

  el.addEventListener("click", () => {
    if (activeCloseFn) {
      try {
        activeCloseFn();
      } finally {
        activeCloseFn = null;
      }
      return;
    }

    // fallback safety
    hideOverlay(root);
    unlockBody();
  });

  console.log("[LAYOUT] overlay init");
}
