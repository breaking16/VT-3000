/* scripts/build-fonts.js */

import fs from "fs";
import path from "path";
import ttf2woff2 from "ttf2woff2";

const FONTS_DIR = path.resolve("src/assets/fonts");
const OUT_SCSS = path.resolve("src/styles/_fonts.scss");

if (!fs.existsSync(FONTS_DIR)) {
  console.log("ℹ️ No fonts directory — skipping");
  process.exit(0);
}

const fontFiles = fs.readdirSync(FONTS_DIR).filter((f) => /\.(ttf|otf)$/i.test(f));

if (!fontFiles.length) {
  console.log("ℹ️ No font files — skipping");
  process.exit(0);
}

let scss = `/* AUTO-GENERATED — DO NOT EDIT */\n\n`;

function getWeight(name) {
  if (/thin/i.test(name)) return 100;
  if (/extralight/i.test(name)) return 200;
  if (/light/i.test(name)) return 300;
  if (/regular/i.test(name)) return 400;
  if (/medium/i.test(name)) return 500;
  if (/semibold/i.test(name)) return 600;
  if (/bold/i.test(name)) return 700;
  if (/extrabold/i.test(name)) return 800;
  if (/black/i.test(name)) return 900;
  return 400;
}

function getFamily(name) {
  return name.replace(
    /-(Thin|ExtraLight|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black)/i,
    "",
  );
}

fontFiles.forEach((file) => {
  const ext = path.extname(file);
  const name = path.basename(file, ext);

  const fontPath = path.join(FONTS_DIR, file);
  const outPath = path.join(FONTS_DIR, `${name}.woff2`);

  const fontBuffer = fs.readFileSync(fontPath);
  const woff2Buffer = ttf2woff2(fontBuffer);

  fs.writeFileSync(outPath, woff2Buffer);
  fs.unlinkSync(fontPath);

  console.log(`🔤 ${file} → ${name}.woff2`);

  const weight = getWeight(name);
  const family = getFamily(name);

  scss += `
@font-face {
  font-family: "${family}";
  src: url("@fonts/${name}.woff2") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}
`;
});

fs.writeFileSync(OUT_SCSS, scss.trim() + "\n");

console.log("✅ _fonts.scss generated correctly");
