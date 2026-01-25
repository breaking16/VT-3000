// src/components/forms/input/input.js

export function init() {
  const inputs = document.querySelectorAll("[data-ww-input]");
  if (!inputs.length) return;

  inputs.forEach((input) => {
    const field = input.closest(".form__field");
    if (!field) return;

    // focus
    input.addEventListener("focus", () => {
      field.classList.add("is-focus");
    });

    // blur
    input.addEventListener("blur", () => {
      field.classList.remove("is-focus");

      if (input.value.trim() !== "") {
        field.classList.add("is-filled");
      } else {
        field.classList.remove("is-filled");
      }
    });
  });

  console.log("[MODULE] input init");
}
