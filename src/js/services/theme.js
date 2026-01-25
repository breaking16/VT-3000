// src\js\services\theme.js
const STORAGE_KEY = "theme";
const html = document.documentElement;

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getTheme() {
  return (
    localStorage.getItem(STORAGE_KEY) ||
    html.getAttribute("data-theme") ||
    getSystemTheme()
  );
}

export function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
