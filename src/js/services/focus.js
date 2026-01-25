// src\js\services\focus.js

let lastFocusedElement = null;

export function saveFocus() {
  lastFocusedElement = document.activeElement;
}

export function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}
