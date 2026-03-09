// src/components/custom/test/test.js

import "./test.scss";

import raw from "./test.html?raw";
import { renderTemplate } from "@js/utils/render-template.js";

export function init() {
  document.querySelectorAll("[data-wwc-test]").forEach((root) => {
    let locals = {};

    // читаємо JSON з data-атрибута
    try {
      if (root.dataset.wwcTest) {
        locals = JSON.parse(root.dataset.wwcTest);
      }
    } catch (e) {
      console.warn("[CUSTOM] invalid locals JSON for test", e);
    }

    const html = renderTemplate(raw, locals);
    root.insertAdjacentHTML("beforeend", html);
  });

  console.log("[CUSTOM] test init");
}
