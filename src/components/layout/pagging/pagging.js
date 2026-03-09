import "./pagging.scss";

export function init(root) {
  const items = root.querySelectorAll(".pagging__item");

  items.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("_active"));
      btn.classList.add("_active");

      root.dispatchEvent(
        new CustomEvent("pagging:change", {
          detail: { page: index + 1 },
        }),
      );
    });
  });
}
