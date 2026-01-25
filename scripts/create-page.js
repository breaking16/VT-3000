/* scripts/create-page.js */
import fs from "fs";
import path from "path";

const [, , sourcePage, rawName] = process.argv;

if (!sourcePage || !rawName) {
  console.error("❌ Usage: npm run new <source> <page-name>");
  process.exit(1);
}

// -------------------------
// helpers
// -------------------------
const toKebab = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const toTitle = (str) =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const page = toKebab(rawName);
const Title = toTitle(page);

// -------------------------
const SRC = path.resolve("src");
const PAGES = path.join(SRC, "components", "pages");

const sourceFile = path.join(SRC, `${sourcePage}.html`);
const targetFile = path.join(SRC, `${page}.html`);

if (sourcePage === "dev-root") {
  console.error("❌ dev-root.html cannot be used as template");
  process.exit(1);
}

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Source page not found: src/${sourcePage}.html`);
  process.exit(1);
}

if (fs.existsSync(targetFile)) {
  console.error(`❌ Page already exists: src/${page}.html`);
  process.exit(1);
}

// -------------------------
// 1. COPY + PATCH PAGE
// -------------------------
let content = fs.readFileSync(sourceFile, "utf-8");

// remove html comments
content = content.replace(/<!--[\s\S]*?-->\s*/g, "");

// replace title
content = content.replace(/"title"\s*:\s*"[^"]+"/, `"title": "${Title}"`);

// replace active
content = content.replace(/"active"\s*:\s*"[^"]+"/g, `"active": "${page}"`);

// replace pages include
content = content.replace(
  /@components\/pages\/[^/]+\/[^.]+\.html/g,
  `@components/pages/${page}/${page}.html`,
);

fs.writeFileSync(targetFile, content, "utf-8");

// -------------------------
// 2. CREATE PAGE FOLDER
// -------------------------
const pageDir = path.join(PAGES, page);
fs.mkdirSync(pageDir, { recursive: true });

const htmlPath = path.join(pageDir, `${page}.html`);
const scssPath = path.join(pageDir, `${page}.scss`);
const jsPath = path.join(pageDir, `${page}.js`);

if (!fs.existsSync(htmlPath)) {
  fs.writeFileSync(
    htmlPath,
    `<link rel="stylesheet" href="@components/pages/${page}/${page}.scss">
<script type="module" src="@components/pages/${page}/${page}.js"></script>

<main class="page page--${page}">
  <h1>${Title}</h1>
</main>
`,
    "utf-8",
  );
}

if (!fs.existsSync(scssPath)) {
  fs.writeFileSync(
    scssPath,
    `.page--${page} {

}
`,
    "utf-8",
  );
}

if (!fs.existsSync(jsPath)) {
  fs.writeFileSync(
    jsPath,
    `// ${page} page logic
`,
    "utf-8",
  );
}

console.log(`✅ Page created: src/${page}.html`);
console.log(`✅ Page files created: components/pages/${page}/`);
