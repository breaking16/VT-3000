// src\components\effects\ripple\ripple.js

// VT-3000 Ripple
// data-ww-ripple
// data-ww-ripple="once"

// src/components/effects/ripple/ripple.js

export function init(root = document) {
  root.addEventListener("click", (e) => {
    const target = e.target.closest("[data-ww-ripple]");
    if (!target) return;

    // remove previous ripple in "once" mode
    if (target.dataset.wwRipple === "once") {
      const existed = target.querySelector(".ripple");
      if (existed) existed.remove();
    }

    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    target.appendChild(ripple);

    ripple.addEventListener("animationend", () => ripple.remove());
  });

  console.log("[EFFECT] ripple init");
}
