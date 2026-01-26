/* scripts/activity-watcher.js */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const LOG = path.join(ROOT, ".vt-activity.log");

const WATCH_DIRS = ["src", "scripts"];

function log(entry) {
  fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
}

function watch(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return;

  fs.watch(full, { recursive: true }, (event, filename) => {
    if (!filename) return;
    if (filename.includes("node_modules")) return;

    log({
      ts: Date.now(),
      type: event,
      file: path.join(dir, filename),
    });
  });
}

WATCH_DIRS.forEach(watch);

console.log("👀 VT-3000 activity watcher started");
