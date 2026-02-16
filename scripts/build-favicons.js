/* scripts/build-favicons.js */

import fs from "fs";
import path from "path";
import { favicons } from "favicons";

const ICON_DIR = "src/assets/svgicons";
const PUBLIC_DIR = "public";
const DIST_DIR = "dist/assets/img/svgicons";
const HTML_OUT = "src/components/layout/favicons/favicons.html";

const isBuild = process.argv.includes("--build");

// 🔎 шукаємо favicon.svg або favicon.png
const SRC_ICON = ["favicon.svg", "favicon.png"]
  .map((file) => path.join(ICON_DIR, file))
  .find((file) => fs.existsSync(file));

if (!SRC_ICON) {
  console.log("ℹ️ favicon.(svg|png) not found — skipping");
  process.exit(0);
}

async function buildFavicons() {
  const result = await favicons(SRC_ICON, {
    path: "/",
    appName: "SHAO",
    appShortName: "SHAO",
    appDescription: "SHAO template",
    background: "#ffffff",
    theme_color: "#7e74f1",

    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      favicons: true,
      windows: false,
      yandex: false,
    },
  });

  // 🔥 Чистимо старі favicon-и
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.readdirSync(PUBLIC_DIR).forEach((file) => {
      if (
        file.includes("favicon") ||
        file.includes("apple") ||
        file.includes("android") ||
        file.includes("manifest")
      ) {
        fs.unlinkSync(path.join(PUBLIC_DIR, file));
      }
    });
  }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // 📦 записуємо в public
  result.images.forEach((img) => {
    fs.writeFileSync(path.join(PUBLIC_DIR, img.name), img.contents);
  });

  result.files.forEach((file) => {
    fs.writeFileSync(path.join(PUBLIC_DIR, file.name), file.contents);
  });

  console.log("🟣 favicons generated in public/");

  // 🧠 Генеруємо HTML include (мінімалістично, без сміття)
  const html = `<!-- ↓↓↓ Favicons (auto-generated) ↓↓↓ -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#7e74f1">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
<!-- ↑↑↑ Favicons (auto-generated) ↑↑↑ -->
`;

  fs.mkdirSync(path.dirname(HTML_OUT), { recursive: true });
  fs.writeFileSync(HTML_OUT, html);

  console.log("🟣 favicons.html updated");

  // ==============================
  // 🏗 BUILD MODE → копіюємо в dist
  // ==============================
  if (isBuild && fs.existsSync("dist")) {
    fs.mkdirSync(DIST_DIR, { recursive: true });

    const filesToCopy = fs
      .readdirSync(PUBLIC_DIR)
      .filter((file) =>
        file.match(/(favicon|apple|android|manifest)\.(png|ico|webmanifest)$/i),
      );

    filesToCopy.forEach((file) => {
      fs.copyFileSync(path.join(PUBLIC_DIR, file), path.join(DIST_DIR, file));
    });

    console.log("🟣 favicons copied to dist/assets/img/svgicons");
  }
}

buildFavicons().catch(console.error);
