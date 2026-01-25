export function init() {
  const root = document.querySelector("[data-dev-pages]");
  if (!root) return;

  const toggle = root.querySelector(".dev-pages__toggle");

  toggle.addEventListener("click", () => {
    root.classList.toggle("is-open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      root.classList.remove("is-open");
    }
  });

  console.log("[MODULE] dev-pages init");
}
