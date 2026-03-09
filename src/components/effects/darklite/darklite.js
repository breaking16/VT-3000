// src/components/effects/darklite/darklite.js
// ⬆️ весь файл

import "./darklite.scss";

export function init() {
  document.addEventListener("theme-change", () => {
    const overlay = document.createElement("div");
    overlay.className = "darklite-overlay";
    document.body.append(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("is-active");
    });

    setTimeout(() => {
      overlay.remove();
    }, 400);
  });

  console.log("[EFFECT] darklite init");
}

//тригер (у theme service)
// src/js/services/theme.js
// ⬇️ ВСЕРЕДИНІ setTheme()

// document.dispatchEvent(new Event("theme-change"));
