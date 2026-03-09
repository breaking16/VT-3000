import "./form.scss";

import { validateField, setFieldState } from "./validation.js";

export function init() {
  const forms = document.querySelectorAll("[data-ww-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("[data-ww-input]");

    // submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let firstError = null;
      let isFormValid = true;

      inputs.forEach((input) => {
        const result = validateField(input);
        setFieldState(input, result);

        if (!result.isValid && !firstError) {
          firstError = input;
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        scrollToError(firstError);
        return;
      }

      submitSuccess(form);
    });
  });

  console.log("[MODULE] form validation init");
}

/* helpers */

function scrollToError(input) {
  input.focus({ preventScroll: true });

  input
    .closest(".form__field")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function submitSuccess(form) {
  form.classList.add("is-success");

  console.log("[FORM] submit success");

  setTimeout(() => {
    form.reset();
    form.classList.remove("is-success");
  }, 1500);
}
