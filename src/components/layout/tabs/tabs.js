// src/components/layout/tabs/tabs.js

import "./tabs.scss";

export function init() {
  const blocks = document.querySelectorAll("[data-ww-tabs]");
  if (!blocks.length) return;

  const HASH_PREFIX = "tab-";

  function parseHash() {
    const h = location.hash.replace("#", "");
    if (!h.startsWith(HASH_PREFIX)) return null;

    const parts = h.replace(HASH_PREFIX, "").split("-");
    return {
      block: Number(parts[0]),
      index: Number(parts[1]),
    };
  }

  const hashState = parseHash();

  blocks.forEach((block, blockIndex) => {
    const titles = block.querySelectorAll("[data-ww-tabs-title]");
    const panels = block.querySelectorAll("[data-ww-tabs-panel]");

    if (!titles.length || !panels.length) return;

    block.classList.add("_tabs-init");

    // =========================
    //   INIT ARIA STRUCTURE
    // =========================
    titles.forEach((btn, i) => {
      const panel = panels[i];
      if (!panel) return;

      const titleId = `tabs-${blockIndex}-title-${i}`;
      const panelId = `tabs-${blockIndex}-panel-${i}`;

      btn.setAttribute("id", titleId);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", panelId);
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");

      panel.setAttribute("id", panelId);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", titleId);

      // базовий стан — приховано
      panel.hidden = true;
      panel.classList.remove("is-active");
    });

    // =========================
    //   ACTIVATE TAB
    // =========================
    function activate(index, pushHash = true) {
      titles.forEach((btn, i) => {
        const panel = panels[i];
        if (!panel) return;

        const active = i === index;

        // 🔹 toggle active class
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
        btn.setAttribute("tabindex", active ? "0" : "-1");

        // 🔹 плавна активація панелі
        panel.classList.toggle("is-active", active);

        // 🔹 accessibility + SSR safe
        panel.hidden = !active;
      });

      // HASH MODE
      if (block.hasAttribute("data-ww-tabs-hash") && pushHash) {
        history.replaceState(null, "", `#tab-${blockIndex}-${index}`);
      }

      // кастомна подія
      block.dispatchEvent(
        new CustomEvent("tabs:change", {
          detail: { index },
        }),
      );
    }

    // =========================
    //   START STATE
    // =========================
    let startIndex = 0;

    // From hash
    if (hashState && hashState.block === blockIndex) {
      startIndex = hashState.index ?? 0;
    }

    // From markup
    const preset = [...titles].findIndex((t) => t.classList.contains("is-active"));
    if (preset >= 0) startIndex = preset;

    activate(startIndex, false);

    // =========================
    //   CLICK
    // =========================
    titles.forEach((btn, i) => {
      btn.addEventListener("click", () => activate(i));
    });

    // =========================
    //   KEYBOARD (Arrow nav)
    // =========================
    block.addEventListener("keydown", (e) => {
      const current = [...titles].findIndex(
        (t) => t.getAttribute("aria-selected") === "true",
      );

      if (current < 0) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        activate((current + 1) % titles.length);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        activate((current - 1 + titles.length) % titles.length);
      }
    });

    // =========================
    //   MOBILE SPOILER MODE
    //   data-ww-tabs-spoller="768,min"
    // =========================
    const bp = block.dataset.wwTabsSpoller;
    if (!bp) return;

    const [widthStr, mode = "max"] = bp.split(",");
    const width = Number(widthStr.trim());

    function applyLayout() {
      const w = window.innerWidth;

      const enable =
        (mode === "max" && w <= width) || (mode === "min" && w >= width);

      if (enable) enableSpollerMode();
      else disableSpollerMode();
    }

    function enableSpollerMode() {
      block.classList.add("_tabs-spoller");

      panels.forEach((panel, i) => {
        const title = titles[i];
        if (!title || !panel) return;

        panel.hidden = !title.classList.contains("is-active");

        title.addEventListener("click", () => {
          const opened = title.classList.contains("is-active");

          titles.forEach((t, j) => {
            const p = panels[j];
            if (!p) return;

            const active = t === title && !opened;

            t.classList.toggle("is-active", active);
            p.hidden = !active;
            p.classList.toggle("is-active", active);
          });
        });
      });
    }

    function disableSpollerMode() {
      block.classList.remove("_tabs-spoller");

      panels.forEach((panel, i) => {
        const active = titles[i].classList.contains("is-active");

        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
    }

    applyLayout();
    window.addEventListener("resize", applyLayout);
  });

  console.log("[MODULE] tabs FULL-HOUSE+animation init");
}
