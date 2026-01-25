// src\js\services\keyboard.js
export function isEscape(e) {
  return e.key === "Escape" || e.key === "Esc";
}

export function isEnter(e) {
  return e.key === "Enter";
}

export function isSpace(e) {
  return e.key === " ";
}
