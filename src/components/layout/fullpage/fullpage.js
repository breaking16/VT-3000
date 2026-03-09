import "./fullpage.scss";

export function init(root) {
  const sections = root.querySelectorAll(".fullpage__section");
  if (!sections.length) return;

  console.log("[LAYOUT] fullpage init", sections.length);

  // future-ready:
  // - wheel control
  // - touch
  // - snap
}
