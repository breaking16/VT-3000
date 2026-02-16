/* scripts\clean-svg.js */
import fs from "fs";
import path from "path";
import { optimize } from "svgo";

const ROOT = process.cwd();
const ICONS_DIR = path.resolve(ROOT, "src/assets/svgicons");

if (!fs.existsSync(ICONS_DIR)) {
  console.log("ℹ️ svgicons folder not found — skipping");
  process.exit(0);
}

const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"));

if (!files.length) {
  console.log("ℹ️ No SVG icons — skipping");
  process.exit(0);
}

files.forEach((file) => {
  const filePath = path.join(ICONS_DIR, file);
  const svg = fs.readFileSync(filePath, "utf-8");

  const result = optimize(svg, {
    multipass: true,
    plugins: [
      "removeXMLNS",
      "removeXMLProcInst",
      "removeDoctype",
      "removeComments",
      "removeMetadata",
      "removeTitle",
      "removeDesc",
      "removeUselessDefs",
      "removeDimensions",

      {
        name: "removeAttrs",
        params: {
          attrs: ["fill", "stroke", "style", "width", "height", "class", "id"],
        },
      },

      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: [{ fill: "currentColor" }],
        },
      },
    ],
  });

  fs.writeFileSync(filePath, result.data);
  console.log(`🧼 cleaned: ${file}`);
});

console.log("✅ SVG icons cleaned");
