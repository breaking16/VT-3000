// scripts/build-images.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

// --------------------
// paths
// --------------------
const SRC_IMG_DIR = path.resolve("src/assets/img");
const SRC_HTML_DIR = path.resolve("src");
const DIST_IMG_DIR = path.resolve("dist/assets/img");

// --------------------
// config (потім винесемо в template.config.js)
// --------------------
const SIZES = [600, 1200];
const FORMAT = "webp";
const QUALITY = 80;

// --------------------
// utils
// --------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getAllHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

// --------------------
// image processing
// --------------------
async function processImage(file) {
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  const srcPath = path.join(SRC_IMG_DIR, file);

  const outDir = path.join(DIST_IMG_DIR, name);
  ensureDir(outDir);

  console.log(`🖼 processing: ${file}`);

  // original
  await sharp(srcPath)
    .webp({ quality: QUALITY })
    .toFile(path.join(outDir, `${name}.${FORMAT}`));

  // responsive
  for (const size of SIZES) {
    await sharp(srcPath)
      .resize(size)
      .webp({ quality: QUALITY })
      .toFile(path.join(outDir, `${name}-${size}.${FORMAT}`));
  }
}

// --------------------
// HTML rewrite
// --------------------
function rewriteImagesInHTML(html) {
  return html.replace(
    /<img\s+([^>]*?)src="(@img\/[^"]+)"([^>]*)>/g,
    (_, before, src, after) => {
      const file = src.replace("@img/", "");
      const name = file.replace(/\.(jpg|jpeg|png)$/i, "");

      return `
<picture>
  <source
    srcset="/assets/img/${name}/${name}-600.webp 600w,
            /assets/img/${name}/${name}-1200.webp 1200w"
    type="image/webp">
  <img src="/assets/img/${name}/${name}.webp" ${before} ${after} loading="lazy">
</picture>
      `.trim();
    }
  );
}

// --------------------
// main
// --------------------
async function run() {
  console.log("[images] Build started");

  ensureDir(DIST_IMG_DIR);

  // 1️⃣ images
  const images = fs
    .readdirSync(SRC_IMG_DIR)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  for (const img of images) {
    await processImage(img);
  }

  // 2️⃣ html rewrite
  const htmlFiles = getAllHtmlFiles(SRC_HTML_DIR);
  console.log(`[images] Found ${htmlFiles.length} HTML files`);

  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, "utf-8");
    const updated = rewriteImagesInHTML(html);

    if (updated !== html) {
      fs.writeFileSync(file, updated);
      console.log(`[images] ✨ rewritten: ${path.relative(process.cwd(), file)}`);
    }
  }

  console.log("[images] Build finished");
}

run().catch(console.error);
