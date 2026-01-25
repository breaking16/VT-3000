// scripts/build-favicons.js
import fs from "fs";
import path from "path";
import { favicons } from "favicons";

const SRC_ICON = "src/assets/svgicons/favicon.svg";
const PUBLIC_DIR = "public";
const HTML_OUT = "src/components/layout/favicons/favicons.html";

if (!fs.existsSync(SRC_ICON)) {
  console.log("ℹ️ favicon.svg not found — skipping favicons");
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

  // 1️⃣ ensure public/
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // 2️⃣ write icons
  result.images.forEach((img) => {
    fs.writeFileSync(path.join(PUBLIC_DIR, img.name), img.contents);
  });

  result.files.forEach((file) => {
    fs.writeFileSync(path.join(PUBLIC_DIR, file.name), file.contents);
  });

  // 3️⃣ generate HTML include
  const html =
    `<!-- ↓↓↓ Favicons (auto-generated) ↓↓↓ -->\n` +
    result.html.join("\n") +
    `\n<!-- ↑↑↑ Favicons (auto-generated) ↑↑↑ -->\n`;

  fs.mkdirSync(path.dirname(HTML_OUT), { recursive: true });
  fs.writeFileSync(HTML_OUT, html);

  console.log("🟣 favicons generated + injected");
}

buildFavicons().catch(console.error);
