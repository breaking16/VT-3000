// scripts/add-component.js
import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.error("Component name is required");
  process.exit(1);
}

const baseDir = path.resolve("src/components/custom", name);

if (fs.existsSync(baseDir)) {
  console.error("Component already exists: " + name);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

// ---------- HTML TEMPLATE (templater-ready) ----------
const html = `<div class="${name}">
  {{#if icon}}
  <div class="${name}__icon">
    <img src="{{ icon }}" alt="{{ title }}">
  </div>
  {{/if}}

  <h3 class="${name}__title">{{ title }}</h3>

  <div class="${name}__content">
    {{ text }}
  </div>
</div>
`;

// ---------- JS (inject + locals + render) ----------
const js = `import raw from "./${name}.html?raw";
import { renderTemplate } from "@/scripts/utils/render-template.js";

export function init() {
  document.querySelectorAll("[data-wwc-${name}]").forEach((root) => {
    let locals = {};

    try {
      if (root.dataset.wwc${name.charAt(0).toUpperCase() + name.slice(1)}) {
        locals = JSON.parse(root.dataset.wwc${
          name.charAt(0).toUpperCase() + name.slice(1)
        });
      }
    } catch (e) {
      console.warn("[CUSTOM] invalid locals JSON for ${name}", e);
    }

    const html = renderTemplate(raw, locals);
    root.insertAdjacentHTML("beforeend", html);
  });

  console.log("[CUSTOM] ${name} init");
}
`;

// ---------- SCSS ----------
const scss = `[data-wwc-${name}] {
  .${name} {
    padding: 16px;
    border: 2px dashed #7e74f1;
    border-radius: 8px;
  }

  .${name}__title {
    margin-bottom: 8px;
    font-weight: 600;
  }
}
`;

fs.writeFileSync(path.join(baseDir, `${name}.html`), html);
fs.writeFileSync(path.join(baseDir, `${name}.js`), js);
fs.writeFileSync(path.join(baseDir, `${name}.scss`), scss);

console.log("Custom component created:", name);
console.log("Path:", baseDir);
