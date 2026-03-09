/* src\components\layout\menu\menu.render.js */

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const MENUS = import.meta.glob("../../../assets/data/menu.*.json", {
  eager: true,
  import: "default",
});

function normalizeDatasetValue(v) {
  if (!v) return "";
  const s = String(v).trim();
  if (s.includes("[[") && s.includes("]]")) return "";
  return s;
}

function pickMenu(menuName) {
  const key = Object.keys(MENUS).find((k) => k.endsWith(`menu.${menuName}.json`));
  return key ? MENUS[key] : [];
}

/* =========================
   CORE RECURSIVE BUILDER
========================= */

function renderTree(items, activeId, variant = "desktop") {
  if (!Array.isArray(items) || !items.length) return "";

  return items
    .map((item) => {
      const id = item?.id ?? "";
      const label = escapeHtml(item?.label ?? "");
      const href = escapeHtml(item?.href ?? "#");
      const children = Array.isArray(item?.children) ? item.children : [];
      const hasChildren = children.length > 0;
      const isActive = id === activeId;

      const linkClass = `menu__link${isActive ? " menu__link--active" : ""}`;

      /* =========================
         DESKTOP STRUCTURE
      ========================= */

      if (variant === "desktop") {
        return `
<li class="menu__item ${
          hasChildren ? "has-submenu" : ""
        }" data-menu-id="${escapeHtml(id)}">

  <a class="${linkClass}" href="${href}">
    ${label}
    ${
      hasChildren
        ? `<button class="menu__arrow" type="button" aria-label="Open submenu"></button>`
        : ""
    }
  </a>

  ${
    hasChildren
      ? `<ul class="menu__sublist">
          ${renderTree(children, activeId, variant)}
        </ul>`
      : ""
  }

</li>`;
      }

      /* =========================
         MOBILE STRUCTURE
      ========================= */

      return `
<li class="${hasChildren ? "has-submenu" : ""}" data-menu-id="${escapeHtml(id)}">

  <a class="${linkClass}" href="${href}">${label}</a>

  ${
    hasChildren
      ? `
    <button class="menu__arrow" type="button" aria-label="Open submenu"></button>
    <ul class="menu__sublist">
      ${renderTree(children, activeId, variant)}
    </ul>
  `
      : ""
  }

</li>`;
    })
    .join("");
}

/* =========================
   PUBLIC API
========================= */

export function renderMenu() {
  const desktopList = document.querySelector("[data-ww-menu-desktop-list]");

  const mobileList = document.querySelector("[data-ww-menu-mobile-list]");

  if (!desktopList && !mobileList) return;

  const header =
    desktopList?.closest("[data-active]") ||
    mobileList?.closest("[data-active]") ||
    document.querySelector("[data-active]");

  const activeId = normalizeDatasetValue(header?.dataset?.active) || "";

  const menuName = normalizeDatasetValue(header?.dataset?.menu) || "main";

  const items = pickMenu(menuName);

  if (desktopList) {
    desktopList.innerHTML = renderTree(items, activeId, "desktop");
  }

  if (mobileList) {
    mobileList.innerHTML = renderTree(items, activeId, "mobile");
  }

  console.log(`[MENU] rendered "${menuName}" (active="${activeId}")`);
}
