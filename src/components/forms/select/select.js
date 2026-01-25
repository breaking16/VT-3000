export function init(root = document) {
  const selects = root.querySelectorAll("[data-ww-select]");
  if (!selects.length) return;

  selects.forEach(initSelect);
}

function initSelect(select) {
  const title = select.querySelector(".select__title");
  const content = select.querySelector(".select__content");
  const optionsWrap = select.querySelector(".select__options");
  const options = Array.from(select.querySelectorAll(".select__option"));

  if (!title || !optionsWrap || !options.length) return;

  // ARIA
  const listboxId = `select-${Math.random().toString(36).slice(2)}`;
  optionsWrap.id = listboxId;
  title.setAttribute("aria-controls", listboxId);

  let activeIndex = -1;

  /* ---------------- helpers ---------------- */

  const open = () => {
    select.classList.add("_select-open");
    title.setAttribute("aria-expanded", "true");
    optionsWrap.hidden = false;

    document.addEventListener("click", outsideClick);
    document.addEventListener("keydown", onKeydown);
  };

  const close = () => {
    select.classList.remove("_select-open");
    title.setAttribute("aria-expanded", "false");
    optionsWrap.hidden = true;

    document.removeEventListener("click", outsideClick);
    document.removeEventListener("keydown", onKeydown);
  };

  const toggle = () => {
    select.classList.contains("_select-open") ? close() : open();
  };

  const selectOption = (option) => {
    options.forEach((o) => o.classList.remove("_select-selected"));
    option.classList.add("_select-selected");
    content.textContent = option.textContent;
    close();
  };

  const focusOption = (index) => {
    options.forEach((o) => o.classList.remove("_focus"));
    options[index]?.classList.add("_focus");
    options[index]?.focus();
    activeIndex = index;
  };

  /* ---------------- events ---------------- */

  title.addEventListener("click", toggle);

  options.forEach((option, index) => {
    option.setAttribute("role", "option");
    option.tabIndex = -1;

    option.addEventListener("click", () => selectOption(option));

    option.addEventListener("mouseenter", () => {
      activeIndex = index;
    });
  });

  function outsideClick(e) {
    if (!select.contains(e.target)) close();
  }

  function onKeydown(e) {
    switch (e.key) {
      case "Escape":
        close();
        title.focus();
        break;

      case "ArrowDown":
        e.preventDefault();
        open();
        focusOption(activeIndex < options.length - 1 ? activeIndex + 1 : 0);
        break;

      case "ArrowUp":
        e.preventDefault();
        open();
        focusOption(activeIndex > 0 ? activeIndex - 1 : options.length - 1);
        break;

      case "Enter":
      case " ":
        if (activeIndex >= 0) {
          e.preventDefault();
          selectOption(options[activeIndex]);
        }
        break;
    }
  }

  // init state
  optionsWrap.hidden = true;
}
