// src/components/layout/masonry/masonry.js
import "./mansory.scss";
import Isotope from "isotope-layout";

export function init(root) {
  const mode = root.dataset.mode ?? "isotope";

  if (mode === "grid") {
    initGrid(root);
  } else {
    initIsotope(root);
  }
}

/* ---------------------------
   ISOTOPE MODE (default)
---------------------------- */
function initIsotope(root) {
  const iso = new Isotope(root, {
    itemSelector: ".masonry__item",
    masonry: {
      fitWidth: true,
      gutter: 20,
    },
  });

  console.log("[masonry] isotope mode", iso);
}

/* ---------------------------
   GRID-LITE MODE
---------------------------- */
function initGrid(root) {
  const ro = new ResizeObserver(() => {
    root.style.gridAutoRows = "1px";
    root.offsetHeight; // force reflow
    root.style.gridAutoRows = "";
  });

  root.querySelectorAll(".masonry__item").forEach((el) => ro.observe(el));

  console.log("[masonry] grid mode");
}
