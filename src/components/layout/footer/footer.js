export function init() {
  const root = document.querySelector("[data-ww-footer]");
  if (!root) return;

  const yearNode = root.querySelector("[data-footer-year]");
  if (yearNode) {
    yearNode.textContent = `© ${new Date().getFullYear()}`;
  }

  console.log("[LAYOUT] footer init");
}
