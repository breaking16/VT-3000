import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const OUT_FILE = path.resolve("src/components/dev/pages-list.html");

// html-файли, які НЕ показуємо
const EXCLUDE = ["dev.html"];

function getPages() {
  return fs
    .readdirSync(SRC_DIR)
    .filter((file) => file.endsWith(".html") && !EXCLUDE.includes(file));
}

function buildHTML(pages) {
  if (!pages.length) {
    return "<p>Немає сторінок</p>";
  }

  return `
<h2>Сторінки</h2>
<ul>
  ${pages
    .map((page) => `<li><a href="/${page}" target="_blank">${page}</a></li>`)
    .join("\n  ")}
</ul>
`.trim();
}

const pages = getPages();
const html = buildHTML(pages);

// ensure dir
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

// write
fs.writeFileSync(OUT_FILE, html, "utf-8");

console.log("🧭 DEV pages generated:", pages);
