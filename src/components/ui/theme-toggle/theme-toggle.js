/* src\components\ui\theme-toggle\theme-toggle.js */
import "./theme-toggle.scss";

import { getTheme, toggleTheme } from "@js/services/theme.js";

export function init(root = document) {
  const buttons = root.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  const updateIcon = () => {
    const theme = getTheme();
    buttons.forEach((btn) => {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleTheme();
      updateIcon();
    });
  });

  updateIcon();
}
