/* scripts/stat-build.js */
import fs from "fs";
import path from "path";

const DIST = path.resolve("dist");

if (!fs.existsSync(DIST)) {
  console.error("❌ dist folder not found. Run build first.");
  process.exit(1);
}

function walk(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else files.push({ file: full, size: stat.size });
  }
  return files;
}

const files = walk(DIST);

const total = files.reduce((s, f) => s + f.size, 0);

const byType = {
  js: 0,
  css: 0,
  img: 0,
  fonts: 0,
  html: 0,
  other: 0,
};

files.forEach(({ file, size }) => {
  if (file.endsWith(".js")) byType.js += size;
  else if (file.endsWith(".css")) byType.css += size;
  else if (file.endsWith(".html")) byType.html += size;
  else if (/\.(png|jpg|jpeg|webp|svg|gif)$/.test(file)) byType.img += size;
  else if (/\.(woff2?|ttf|otf)$/.test(file)) byType.fonts += size;
  else byType.other += size;
});

function kb(n) {
  return (n / 1024).toFixed(1) + " KB";
}

console.log("\n📦 VT-3000 • BUILD SIZE REPORT\n");
console.log("Total:", kb(total));
console.log("HTML:", kb(byType.html));
console.log("JS:", kb(byType.js));
console.log("CSS:", kb(byType.css));
console.log("Images:", kb(byType.img));
console.log("Fonts:", kb(byType.fonts));
console.log("Other:", kb(byType.other));

console.log("\nTop 10 largest files:");
files
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .forEach((f) => console.log(" -", path.relative(DIST, f.file), kb(f.size)));

console.log("");
