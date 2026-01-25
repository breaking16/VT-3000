export function init() {
  const blocks = document.querySelectorAll("[data-ww-spollers]");
  if (!blocks.length) return;

  function parseBreakpoint(value) {
    if (!value) return null;

    const parts = value.split(",");

    return {
      width: parseInt(parts[0]),
      mode: (parts[1] || "max").trim(), // mobile-first за замовчуванням
    };
  }

  blocks.forEach((block, blockIndex) => {
    const bp = parseBreakpoint(block.dataset.wwSpollers);

    function applyMode() {
      const w = window.innerWidth;

      const activeMax = bp && bp.mode === "max" && w <= bp.width;
      const activeMin = bp && bp.mode === "min" && w >= bp.width;

      const enabled = !bp || activeMax || activeMin;

      enabled ? enableSpollers(block, blockIndex) : disableSpollers(block);
    }

    applyMode();
    window.addEventListener("resize", applyMode);
  });

  console.log("[MODULE] spollers adaptive init");
}

/* =========================
   ENABLE
========================= */
function enableSpollers(block, blockIndex) {
  if (block.classList.contains("_spoller-init")) return;

  const oneOpen = block.hasAttribute("data-ww-spollers-one");
  const items = block.querySelectorAll(".spollers__item");

  block.classList.add("_spoller-init");

  items.forEach((item, index) => {
    const title = item.querySelector(".spollers__title");
    const body = item.querySelector(".spollers__body");
    if (!title || !body) return;

    const titleId = `spoller-title-${blockIndex}-${index}`;
    const bodyId = `spoller-body-${blockIndex}-${index}`;

    // ARIA
    title.setAttribute("id", titleId);
    title.setAttribute("aria-controls", bodyId);

    body.setAttribute("id", bodyId);
    body.setAttribute("role", "region");
    body.setAttribute("aria-labelledby", titleId);

    const active = item.classList.contains("_spoller-active");

    title.setAttribute("aria-expanded", String(active));
    body.hidden = !active;

    // 🔒 не дублюємо обробники
    if (title._spollerBound) return;
    title._spollerBound = true;

    title.addEventListener("click", () => {
      const opened = title.getAttribute("aria-expanded") === "true";

      if (oneOpen && !opened) {
        items.forEach((other) => {
          if (other === item) return;

          const t = other.querySelector(".spollers__title");
          const b = other.querySelector(".spollers__body");

          if (t?.getAttribute("aria-expanded") === "true") {
            closeSpoller(other, t, b, block);
          }
        });
      }

      opened
        ? closeSpoller(item, title, body, block)
        : openSpoller(item, title, body, block);
    });

    // ⌨️ Enter / Space
    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        title.click();
      }
    });
  });
}

/* =========================
   DISABLE (розгорнутий контент)
========================= */
function disableSpollers(block) {
  if (!block.classList.contains("_spoller-init")) return;

  block.classList.remove("_spoller-init");

  block.querySelectorAll(".spollers__item").forEach((item) => {
    const title = item.querySelector(".spollers__title");
    const body = item.querySelector(".spollers__body");
    if (!title || !body) return;

    item.classList.remove("_spoller-active");
    title.classList.remove("is-active");

    title.setAttribute("aria-expanded", "true");
    body.hidden = false;
  });
}

/* =========================
   HELPERS
========================= */

function openSpoller(item, title, body, block) {
  item.classList.add("_spoller-active");

  title.classList.add("is-active");
  title.setAttribute("aria-expanded", "true");

  body.hidden = false;

  block.dispatchEvent(
    new CustomEvent("spoller:open", { detail: { item, title, body } })
  );
}

function closeSpoller(item, title, body, block) {
  item.classList.remove("_spoller-active");

  title.classList.remove("is-active");
  title.setAttribute("aria-expanded", "false");

  body.hidden = true;

  block.dispatchEvent(
    new CustomEvent("spoller:close", { detail: { item, title, body } })
  );
}

// ===============================
// CLOSE ON CLICK OUTSIDE / TRIGGER
// ===============================

document.addEventListener("click", (e) => {
  const target = e.target;

  // 1) Закриття по кліку поза блоком
  document.querySelectorAll("[data-ww-spollers-close-outside]").forEach((block) => {
    if (!block.classList.contains("_spoller-init")) return;

    // якщо клік всередині — нічого не робимо
    if (block.contains(target)) return;

    block.querySelectorAll("._spoller-active").forEach((item) => {
      const title = item.querySelector(".spollers__title");
      const body = item.querySelector(".spollers__body");
      if (!title || !body) return;

      closeSpoller(item, title, body, block);
    });
  });

  // 2) Закриття по кнопці з data-spoller-close
  const closeBtn = target.closest("[data-spoller-close]");
  if (closeBtn) {
    const item = closeBtn.closest(".spollers__item");
    const block = closeBtn.closest("[data-ww-spollers]");
    if (!item || !block) return;

    const title = item.querySelector(".spollers__title");
    const body = item.querySelector(".spollers__body");
    if (!title || !body) return;

    closeSpoller(item, title, body, block);
  }
});
