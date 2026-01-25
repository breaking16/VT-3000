// src/components/layout/showmore/showmore.js

// modern-showmore — VT-3000
// supports: size | items + breakpoints + ARIA

export function init(root) {
  const mode = root.dataset.wwShowmore || "size"; // size | items
  const value = Number(root.dataset.wwShowmoreContent) || 150; // px або кількість елементів
  const bp = parseBp(root.dataset.wwShowmoreBp); // напр. "768,max"

  const content = root.querySelector("[data-ww-showmore-content]");
  const btn = root.querySelector("[data-ww-showmore-btn]");
  if (!content || !btn) return;

  // базова ARIA для кнопки
  btn.setAttribute("type", "button");
  btn.setAttribute("aria-expanded", "false");

  /* -------------------------
     BREAKPOINT PARSER
  ------------------------- */
  function parseBp(v) {
    if (!v) return null;
    const [w, m = "max"] = v.split(",");
    return { width: Number(w.trim()), mode: m.trim() }; // max | min
  }

  function bpActive() {
    if (!bp) return true;
    const w = window.innerWidth;
    if (bp.mode === "max") return w <= bp.width;
    if (bp.mode === "min") return w >= bp.width;
    return true;
  }

  /* -------------------------
     HEIGHT LIMIT
  ------------------------- */
  function getLimitHeight() {
    if (mode === "items") {
      const items = [...content.children];
      const limit = Math.min(value, items.length);
      return items.slice(0, limit).reduce((h, el) => h + el.offsetHeight, 0);
    }

    // size-mode: просто px
    return value;
  }

  /* -------------------------
     APPLY STATE
  ------------------------- */
  function apply(collapsed) {
    // якщо breakpoint вимкнув showmore → все показуємо, кнопку ховаємо
    if (!bpActive()) {
      content.style.height = "auto";
      btn.hidden = true;
      root.classList.remove("_showmore-active");
      btn.setAttribute("aria-expanded", "false");
      return;
    }

    // спочатку даємо елементу "розправитись"
    content.style.height = "auto";
    const fullHeight = content.scrollHeight;
    const limit = getLimitHeight();

    // якщо нічого приховувати → просто показуємо все і ховаємо кнопку
    if (fullHeight <= limit + 1) {
      content.style.height = "auto";
      btn.hidden = true;
      root.classList.remove("_showmore-active");
      btn.setAttribute("aria-expanded", "false");
      return;
    }

    btn.hidden = false;

    const open = !collapsed; // open = розгорнутий стан
    const target = open ? fullHeight : limit; // куди анімуємо висоту

    root.classList.toggle("_showmore-active", open);
    btn.setAttribute("aria-expanded", String(open));

    content.style.height = `${target}px`;

    root.dispatchEvent(
      new CustomEvent(open ? "showmore:open" : "showmore:close", {
        detail: { root, content },
      })
    );
  }

  /* -------------------------
     INIT
  ------------------------- */
  function initState() {
    const collapsed = !root.classList.contains("_showmore-active");
    apply(collapsed);
  }

  // старт: завжди в "згорнутому" вигляді
  root.classList.remove("_showmore-active");
  initState();

  /* -------------------------
     TOGGLE BY CLICK
  ------------------------- */
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = root.classList.contains("_showmore-active");
    apply(isOpen); // якщо відкритий → згортаємо, якщо закритий → розгортаємо
  });

  /* -------------------------
     ON RESIZE
  ------------------------- */
  window.addEventListener("resize", () => {
    const collapsed = !root.classList.contains("_showmore-active");
    apply(collapsed);
  });
}
