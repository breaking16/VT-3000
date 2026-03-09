import "./beforeafter.scss";

export function init(root) {
  const range = root.querySelector(".beforeafter__range");
  const afterImg = root.querySelector(".beforeafter__img--after");

  if (!range || !afterImg) return;

  const update = () => {
    const value = range.value;
    afterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
  };

  range.addEventListener("input", update);
  update();
}
