/* scripts/build-svg-sprite.js */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// 🟢 SVG іконки
const ICONS_DIR = path.resolve(ROOT, "src/assets/svgicons");

// 🟢 SVG sprite ДЛЯ INCLUDE
const OUTPUT = path.resolve(ROOT, "src/assets/sprite.svg");

if (!fs.existsSync(ICONS_DIR)) {
  console.log("ℹ️ svgicons folder not found — skipping sprite");
  process.exit(0);
}

const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));

if (!files.length) {
  console.log("ℹ️ No SVG icons — skipping sprite");
  process.exit(0);
}

const symbols = files.map((file) => {
  const name = path.basename(file, ".svg");
  const svg = fs.readFileSync(path.join(ICONS_DIR, file), "utf-8");

  // viewBox
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

  // content
  const content = svg
    .replace(/<svg[^>]*>/, "")
    .replace("</svg>", "")
    .trim();

  return `
  <symbol id="icon-${name}" viewBox="${viewBox}">
    ${content}
  </symbol>`;
});

const sprite = `<!-- AUTO-GENERATED SVG SPRITE — DO NOT EDIT -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols.join("\n")}
</svg>
`;

fs.writeFileSync(OUTPUT, sprite);
console.log(
  `🧩 SVG sprite generated → src/assets/sprite.svg (${files.length} icons)`,
);
