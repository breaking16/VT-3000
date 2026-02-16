/* scripts\build-zip.js */
import fs from "fs";
import path from "path";
import archiver from "archiver";

const DIST_DIR = path.resolve("dist");
const OUT_FILE = path.resolve("dist.zip");

if (!fs.existsSync(DIST_DIR)) {
  console.error("❌ dist folder not found. Run build first.");
  process.exit(1);
}

const output = fs.createWriteStream(OUT_FILE);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);
archive.directory(DIST_DIR, false);
archive.finalize();

output.on("close", () => {
  console.log(`📦 dist.zip created (${archive.pointer()} bytes)`);
});
