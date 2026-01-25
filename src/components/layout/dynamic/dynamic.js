console.log("DYNAMIC FILE LOADED");

export function init() {
  const items = document.querySelectorAll("[data-da]");
  if (!items.length) return;

  const objects = [];

  items.forEach((el) => {
    const data = el.dataset.da.trim();
    if (!data) return;

    const [selector, bp = "767", place = "last"] = data
      .split(",")
      .map((s) => s.trim());
    const destination = document.querySelector(selector);
    if (!destination) return;

    objects.push({
      el,
      parent: el.parentNode,
      destination,
      breakpoint: Number(bp),
      place,
      index: [...el.parentNode.children].indexOf(el),
    });
  });

  function moveTo(obj) {
    if (obj.place === "first") {
      obj.destination.prepend(obj.el);
    } else if (obj.place === "last") {
      obj.destination.append(obj.el);
    } else {
      obj.destination.children[obj.place]?.before(obj.el);
    }
  }

  function moveBack(obj) {
    const parent = obj.parent;
    const index = obj.index;
    parent.children[index]
      ? parent.children[index].before(obj.el)
      : parent.append(obj.el);
  }

  function update() {
    objects.forEach((obj) => {
      if (window.innerWidth <= obj.breakpoint) {
        if (!obj.el.classList.contains("_da")) {
          moveTo(obj);
          obj.el.classList.add("_da");
        }
      } else {
        if (obj.el.classList.contains("_da")) {
          moveBack(obj);
          obj.el.classList.remove("_da");
        }
      }
    });
  }

  update();
  window.addEventListener("resize", update);

  console.log("[LAYOUT] dynamic adapt init");
}
