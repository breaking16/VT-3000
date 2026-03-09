// src/components/effects/cursor/cursor.js
// ⬆️ весь файл

import "./cursor.scss";

export function init() {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.append(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  console.log("[EFFECT] cursor init");
}
