/* src\js\dev-icons.js */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-dev-icons]");
  if (!container) return;

  fetch("/assets/sprite.svg")
    .then((res) => res.text())
    .then((svgText) => {
      // 1️⃣ вставляємо sprite в DOM
      const wrap = document.createElement("div");
      wrap.style.display = "none";
      wrap.innerHTML = svgText;
      document.body.prepend(wrap);

      // 2️⃣ symbols тепер реально існують
      const symbols = wrap.querySelectorAll("symbol");

      symbols.forEach((symbol) => {
        const id = symbol.id;

        const item = document.createElement("div");
        item.className = "dev-icons__item";

        item.innerHTML = `
          <svg class="icon" viewBox="${symbol.getAttribute("viewBox")}">
            <use href="#${id}"></use>
          </svg>
          <div class="dev-icons__name">${id}</div>
        `;

        item.addEventListener("click", () => {
          navigator.clipboard.writeText(
            `<svg class="icon icon--${id.replace("icon-", "")}">
  <use href="#${id}"></use>
</svg>`,
          );
        });

        container.appendChild(item);
      });
    });
});
