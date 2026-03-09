import "./promo.scss";

import html from "./promo.html?raw";

export function init() {
  document.querySelectorAll("[data-wwc-promo]").forEach((root) => {
    root.insertAdjacentHTML("beforeend", html);
  });

  console.log("[CUSTOM] promo init");
}
