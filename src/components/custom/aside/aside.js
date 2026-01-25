import html from "./aside.html?raw";

export function init() {
  document.querySelectorAll("[data-wwc-aside]").forEach((root) => {
    root.insertAdjacentHTML("beforeend", html);
  });

  console.log("[CUSTOM] aside init");
}
