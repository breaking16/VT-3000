// scripts/build-preload.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const FONTS_SCSS = path.resolve(ROOT, "src/styles/_fonts.scss");
const OUTPUT = path.resolve(ROOT, "src/components/layout/head/preload.html");

if (!fs.existsSync(FONTS_SCSS)) {
  console.log("ℹ️ _fonts.scss not found — skipping preload");
  process.exit(0);
}

const content = fs.readFileSync(FONTS_SCSS, "utf-8");

const fontFaceRegex = /src:\s*url\(["']([^"']+\.woff2)["']\)/g;

const fonts = new Set();
let match;

while ((match = fontFaceRegex.exec(content)) !== null) {
  fonts.add(match[1]);
}

if (!fonts.size) {
  console.log("ℹ️ No fonts for preload");
  process.exit(0);
}

const preloadHTML = `<!-- ↓↓↓ Preload project fonts (auto-generated) ↓↓↓ -->
${[...fonts]
  .map(
    (href) =>
      `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`
  )
  .join("\n")}
<!-- ↑↑↑ Preload project fonts ↑↑↑ -->`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, preloadHTML);

console.log("⚡ preload.html generated");
