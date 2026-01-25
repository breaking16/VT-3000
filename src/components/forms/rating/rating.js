document.addEventListener("change", (e) => {
  if (e.target.closest(".rating__input")) {
    console.log("Rating:", e.target.value);
  }
});
