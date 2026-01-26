/* scripts/create-page.js */
import fs from "fs";
import path from "path";

const [, , sourcePage, newPage] = process.argv;

if (!sourcePage || !newPage) {
  console.error("❌ Usage: npm run new <source> <name>");
  process.exit(1);
}

const SRC = path.resolve("src");
const PAGES = path.join(SRC, "components", "pages");

const sourceFile = path.join(SRC, `${sourcePage}.html`);
const targetFile = path.join(SRC, `${newPage}.html`);

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Source not found: ${sourcePage}.html`);
  process.exit(1);
}

if (fs.existsSync(targetFile)) {
  console.error(`❌ Page exists: ${newPage}.html`);
  process.exit(1);
}

const Title = newPage
  .split("-")
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(" ");

let content = fs.readFileSync(sourceFile, "utf-8");

// чистимо коментарі
content = content.replace(/<!--[\s\S]*?-->\s*/g, "");

// title
content = content.replace(/"title"\s*:\s*"[^"]+"/, `"title": "${Title}"`);

// active
content = content.replace(/"active"\s*:\s*"[^"]+"/g, `"active": "${newPage}"`);

// home flag
content = content.replace(
  /"home"\s*:\s*"[^"]+"/g,
  `"home": "${newPage === "index" ? "true" : "false"}"`,
);

// page include
content = content.replace(
  /@components\/pages\/[^/]+\/[^.]+\.html/g,
  `@components/pages/${newPage}/${newPage}.html`,
);

fs.writeFileSync(targetFile, content, "utf-8");

// page folder
const dir = path.join(PAGES, newPage);
fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(
  path.join(dir, `${newPage}.html`),
  `<main class="page page--${newPage}">
  <h1>${Title}</h1>
</main>
`,
);

fs.writeFileSync(
  path.join(dir, `${newPage}.js`),
  `import "./${newPage}.scss";\n\n// ${newPage} page logic\n`,
);

fs.writeFileSync(path.join(dir, `${newPage}.scss`), `.page--${newPage} {\n\n}\n`);

console.log(`✅ Page created: ${newPage}`);
