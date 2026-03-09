/* scripts/build-svg-sprite.js */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// 🟢 Source icons
const ICONS_DIR = path.resolve(ROOT, "src/assets/svgicons");

// 🟢 Generated sprite
const OUTPUT = path.resolve(ROOT, "src/assets/sprite.svg");

// ─────────────────────────────────────────────

if (!fs.existsSync(ICONS_DIR)) {
  console.log("ℹ️ svgicons folder not found — skipping sprite");
  process.exit(0);
}

const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));

if (!files.length) {
  console.log("ℹ️ No SVG icons — skipping sprite");
  process.exit(0);
}

// ─────────────────────────────────────────────

function cleanSvg(svg) {
  return svg
    .replace(/<\?xml.*?\?>/g, "") // remove xml header
    .replace(/<!DOCTYPE.*?>/g, "") // remove doctype
    .replace(/<svg[^>]*>/i, "") // remove opening svg
    .replace(/<\/svg>/i, "") // remove closing svg
    .replace(/fill="[^"]*"/gi, "") // remove fill
    .replace(/stroke="[^"]*"/gi, "") // remove stroke
    .replace(/style="[^"]*"/gi, "") // remove inline styles
    .replace(/stroke-width="[^"]*"/gi, "") // optional cleanup
    .replace(/\s{2,}/g, " ") // normalize spaces
    .trim();
}

// ─────────────────────────────────────────────

const symbols = files.map((file) => {
  const name = path.basename(file, ".svg");
  const fullPath = path.join(ICONS_DIR, file);

  const svg = fs.readFileSync(fullPath, "utf-8");

  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

  const content = cleanSvg(svg);

  return `
  <symbol id="icon-${name}" viewBox="${viewBox}">
    ${content}
  </symbol>`;
});

// ─────────────────────────────────────────────

const sprite = `<!-- AUTO-GENERATED SVG SPRITE — DO NOT EDIT -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${symbols.join("\n")}
</svg>
`;

fs.writeFileSync(OUTPUT, sprite);

console.log(
  `🧩 SVG sprite generated → src/assets/sprite.svg (${files.length} icons)`,
);
