// VT-3000 body scroll lock util
// use: import { bodyLock, bodyUnlock, bodyLockToggle } from "@/js/utils/body-lock.js"

let isReady = true;

/**
 * Add padding compensation & lock scroll
 */
export function bodyLock(delay = 400) {
  if (!isReady) return;
  isReady = false;

  const lockPads = document.querySelectorAll("[data-lp]");
  const scrollBarComp = window.innerWidth - document.body.offsetWidth + "px";

  lockPads.forEach((el) => (el.style.paddingRight = scrollBarComp));
  document.body.style.paddingRight = scrollBarComp;

  document.documentElement.classList.add("lock");

  setTimeout(() => (isReady = true), delay);
}

/**
 * Remove padding compensation & unlock scroll
 */
export function bodyUnlock(delay = 400) {
  if (!isReady) return;
  isReady = false;

  const lockPads = document.querySelectorAll("[data-lp]");

  setTimeout(() => {
    lockPads.forEach((el) => (el.style.paddingRight = ""));
    document.body.style.paddingRight = "";
    document.documentElement.classList.remove("lock");
  }, delay);

  setTimeout(() => (isReady = true), delay);
}

/**
 * Toggle lock state
 */
export function bodyLockToggle(delay = 400) {
  if (document.documentElement.classList.contains("lock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
