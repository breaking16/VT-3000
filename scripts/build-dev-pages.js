/* scripts\build-dev-pages.js */
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const OUT_FILE = path.resolve("src/components/dev/pages-list.html");

/**
 * Беремо ТІЛЬКИ html у корені src
 * components та підпапки ігноруємо
 */
function getRootPages() {
  return fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name);
}

/**
 * index.html завжди перший
 */
function sortPages(pages) {
  return pages.sort((a, b) => {
    if (a === "index.html") return -1;
    if (b === "index.html") return 1;
    return a.localeCompare(b);
  });
}

function buildHTML(pages) {
  return `
<h2>Сторінки</h2>
<ul class="dev-pages__list">
${pages
  .map((page) => `  <li><a href="/${page}" data-page="${page}">${page}</a></li>`)
  .join("\n")}
</ul>
`.trim();
}

// ───────────────────────────────

const pages = sortPages(getRootPages());
const html = buildHTML(pages);

// гарантуємо, що папка існує
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

// записуємо файл
fs.writeFileSync(OUT_FILE, html, "utf-8");

// 🔄 TOUCH — щоб Vite побачив зміну і зробив reload
const now = new Date();
fs.utimesSync(OUT_FILE, now, now);

// лог
console.log("🧭 DEV pages generated:");
pages.forEach((p) => console.log("  -", p));
