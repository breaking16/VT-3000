// src\js\services\body.js

let lockCount = 0;

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function lockBody() {
  lockCount += 1;
  if (lockCount > 1) return;

  const scrollbarWidth = getScrollbarWidth();
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.classList.add("is-lock");
}

export function unlockBody() {
  lockCount -= 1;
  if (lockCount > 0) return;

  document.body.style.paddingRight = "";
  document.body.classList.remove("is-lock");
}
