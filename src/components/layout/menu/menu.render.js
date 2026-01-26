// src/components/layout/menu/menu.render.js
// VT-3000 • Recursive Menu Renderer (v1 core)
// - renders desktop + mobile from JSON
// - supports unlimited nesting via `children`
// - supports active item (span.is-active instead of <a>)

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Vite: eager-load all menu.*.json in this folder
const MENUS = import.meta.glob("./menu.*.json", {
  eager: true,
  import: "default",
});

function normalizeDatasetValue(v) {
  // your engine keeps unresolved markers like [[active]]
  if (!v) return "";
  const s = String(v).trim();
  if (s.includes("[[") && s.includes("]]")) return "";
  return s;
}

function pickMenu(menuName) {
  const name = menuName || "main";
  const key = Object.keys(MENUS).find((k) => k.endsWith(`menu.${name}.json`));
  const data = key ? MENUS[key] : null;
  return Array.isArray(data) ? data : [];
}

function renderTree(items, activeId) {
  if (!Array.isArray(items) || items.length === 0) return "";

  const li = items
    .map((item) => {
      const id = item?.id ?? "";
      const label = escapeHtml(item?.label ?? "");
      const href = escapeHtml(item?.href ?? "#");
      const children = Array.isArray(item?.children) ? item.children : [];

      const isActive = id === activeId;

      const head = isActive
        ? `<span class="is-active">${label}</span>`
        : `<a href="${href}">${label}</a>`;

      const subtree = children.length
        ? `<ul>${renderTree(children, activeId)}</ul>`
        : "";

      return `<li data-menu-id="${escapeHtml(id)}">${head}${subtree}</li>`;
    })
    .join("");

  return li;
}

/**
 * Renders BOTH:
 * - desktop: [data-ww-menu-desktop-list]
 * - mobile:  [data-ww-menu-mobile-list]
 *
 * Reads:
 * - active from closest [data-active] (header)
 * - menu name from closest [data-menu]
 */
export function renderMenu() {
  const desktopList = document.querySelector("[data-ww-menu-desktop-list]");
  const mobileList = document.querySelector("[data-ww-menu-mobile-list]");

  // nothing to do
  if (!desktopList && !mobileList) return;

  const header =
    (desktopList && desktopList.closest("[data-active]")) ||
    (mobileList && mobileList.closest("[data-active]")) ||
    document.querySelector("[data-active]");

  const activeId = normalizeDatasetValue(header?.dataset?.active) || "";
  const menuName = normalizeDatasetValue(header?.dataset?.menu) || "main";

  const items = pickMenu(menuName);
  const html = renderTree(items, activeId);

  if (desktopList) desktopList.innerHTML = html;
  if (mobileList) mobileList.innerHTML = html;

  // helpful debug
  console.log(`[MENU] rendered "${menuName}" (active="${activeId}")`);
}
