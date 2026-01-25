// src/components/forms/form/validation.js

const validators = {
  required(value) {
    return value.trim() !== "";
  },

  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
};

export function validateField(input) {
  const rules = input.dataset.wwValidate?.split("|") || [];
  const value = input.value;
  let isValid = true;
  let message = "";

  // required
  if (input.hasAttribute("required") && !validators.required(value)) {
    isValid = false;
    message = "This field is required";
  }

  // email
  if (isValid && rules.includes("email") && !validators.email(value)) {
    isValid = false;
    message = "Invalid email address";
  }

  return { isValid, message };
}

export function setFieldState(input, { isValid, message }) {
  const field = input.closest(".form__field");
  const error = field?.querySelector(".form__error");

  if (!field || !error) return;

  if (isValid) {
    field.classList.remove("is-error");
    field.classList.add("is-success");

    input.removeAttribute("aria-invalid");
    error.textContent = "";
  } else {
    field.classList.add("is-error");
    field.classList.remove("is-success");

    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
  }
}
