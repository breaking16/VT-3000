/* scripts/stat.js */
import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ===== CONFIG =====
const ACTIVITY_LOG = path.resolve(".vt-activity.log");
const SESSION_GAP_MIN = 30; // хв — розрив між сесіями
const HOURLY_RATE = 25; // $ / hour (поміняй під себе)

// Deadline storage
const DEADLINE_FILE = path.resolve(".vt-deadline.json");
// ==================

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

/* =========================
DEADLINE HELPERS
========================= */

// parse "YYYY-MM-DD" into local Date (end of day)
function parseYMD(ymd) {
  if (!ymd) return null;
  const m = String(ymd)
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  // local time end-of-day: 23:59:59
  const dt = new Date(y, mo - 1, d, 23, 59, 59, 999);
  // validate (JS autocorrects invalid dates)
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d)
    return null;
  return dt;
}

function formatDeadlineLine(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadDeadline() {
  if (!fs.existsSync(DEADLINE_FILE)) return null;
  try {
    const raw = fs.readFileSync(DEADLINE_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (!data?.date) return null;
    const dt = parseYMD(data.date);
    return dt;
  } catch {
    return null;
  }
}

function saveDeadline(ymd) {
  const payload = { date: ymd, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DEADLINE_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

function diffHuman(now, deadline) {
  const ms = deadline.getTime() - now.getTime();

  const sign = ms >= 0 ? 1 : -1;
  const abs = Math.abs(ms);

  const totalMinutes = Math.floor(abs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return { ms, sign, days, hours, minutes };
}

function printDeadlineBox(deadlineDt) {
  const now = new Date();
  const { sign, days, hours, minutes } = diffHuman(now, deadlineDt);

  const ymd = formatDeadlineLine(deadlineDt);
  const status =
    sign >= 0
      ? `⏳ Left: ${days}d ${hours}h ${minutes}m`
      : `⚠️ OVERDUE: ${days}d ${hours}h ${minutes}m`;

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🗓  PROJECT DEADLINE");
  console.log("────────────────────────────────────────");
  console.log(`📌 Deadline: ${ymd} (local end of day)`);
  console.log(`📍 ${status}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

async function ensureDeadlineUI() {
  const rl = readline.createInterface({ input, output });

  try {
    let deadlineDt = loadDeadline();

    // first run: ask to set deadline
    if (!deadlineDt) {
      console.log("\n🗓  Deadline is not set yet.");
      console.log(
        "👉 Enter deadline date in format: YYYY-MM-DD (example: 2026-03-15)",
      );
      console.log("   (Press Enter to skip — but краще поставити 🙃)\n");

      while (true) {
        const ans = (
          await rl.question("Set deadline (YYYY-MM-DD) or Enter to skip: ")
        ).trim();
        if (!ans) {
          console.log("\n⚠️ Deadline skipped. (You can set it next time)\n");
          return null;
        }
        const dt = parseYMD(ans);
        if (!dt) {
          console.log("❌ Invalid date format. Use YYYY-MM-DD. Try again.\n");
          continue;
        }
        saveDeadline(ans);
        deadlineDt = dt;
        console.log("✅ Deadline saved.\n");
        break;
      }
    }

    // always show box first if exists
    if (deadlineDt) {
      printDeadlineBox(deadlineDt);

      const change = (await rl.question("Change deadline? (y/N): "))
        .trim()
        .toLowerCase();
      if (change === "y" || change === "yes") {
        console.log("\n✍️ Enter new deadline date: YYYY-MM-DD\n");
        while (true) {
          const ans = (
            await rl.question("New deadline (YYYY-MM-DD) or Enter to cancel: ")
          ).trim();
          if (!ans) {
            console.log("↩️ Keeping current deadline.\n");
            break;
          }
          const dt = parseYMD(ans);
          if (!dt) {
            console.log("❌ Invalid date format. Use YYYY-MM-DD. Try again.\n");
            continue;
          }
          saveDeadline(ans);
          deadlineDt = dt;
          console.log("✅ Deadline updated.\n");
          printDeadlineBox(deadlineDt);
          break;
        }
      } else {
        console.log(""); // little spacing
      }
    }

    return deadlineDt;
  } finally {
    rl.close();
  }
}

/* =========================
RUN DEADLINE FIRST
========================= */

await ensureDeadlineUI();

/* =========================
GIT PART
========================= */

const rawGit = run(`git log --pretty=format:"%ad" --date=short`);
const gitDates = rawGit ? rawGit.split("\n") : [];
const gitStats = {};
gitDates.forEach((d) => (gitStats[d] = (gitStats[d] || 0) + 1));

/* =========================
ACTIVITY PART
========================= */

if (!fs.existsSync(ACTIVITY_LOG)) {
  console.log("❌ No .vt-activity.log found");
  process.exit(0);
}

const lines = fs.readFileSync(ACTIVITY_LOG, "utf-8").split("\n").filter(Boolean);

const events = lines
  .map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.ts - b.ts);

// group into sessions
const sessions = [];
let current = [];

for (let i = 0; i < events.length; i++) {
  if (!current.length) {
    current.push(events[i]);
    continue;
  }

  const gapMin = (events[i].ts - current[current.length - 1].ts) / 60000;
  if (gapMin > SESSION_GAP_MIN) {
    sessions.push(current);
    current = [events[i]];
  } else {
    current.push(events[i]);
  }
}
if (current.length) sessions.push(current);

// calculate per-day time
const dayTime = {}; // { date: minutes }
sessions.forEach((s) => {
  const start = s[0].ts;
  const end = s[s.length - 1].ts;
  const minutes = Math.max(1, Math.round((end - start) / 60000));
  const day = new Date(start).toISOString().slice(0, 10);
  dayTime[day] = (dayTime[day] || 0) + minutes;
});

/* =========================
MERGE
========================= */

const days = Array.from(
  new Set([...Object.keys(dayTime), ...Object.keys(gitStats)]),
).sort();

const rows = days.map((d) => ({
  Date: d,
  Minutes: dayTime[d] || 0,
  Hours: ((dayTime[d] || 0) / 60).toFixed(2),
  Commits: gitStats[d] || 0,
}));

// totals
const totalMinutes = rows.reduce((s, r) => s + r.Minutes, 0);
const totalHours = totalMinutes / 60;
const totalCommits = rows.reduce((s, r) => s + r.Commits, 0);
const avgHours = (totalHours / (rows.length || 1)).toFixed(2);
const money = (totalHours * HOURLY_RATE).toFixed(2);

/* =========================
OUTPUT
========================= */

console.log("\n📊 VT-3000 • Project statistics (HYBRID)\n");
console.table(rows);

console.log("────────────────────────────────");
console.log(`📆 Days worked: ${rows.length}`);
console.log(`⏱ Total time: ${totalHours.toFixed(2)} h`);
console.log(`🧠 Total commits: ${totalCommits}`);
console.log(`⚡ Avg hours/day: ${avgHours}`);
console.log(`💰 Rate: $${HOURLY_RATE}/hour`);
console.log(`💵 Earned (est.): $${money}`);
console.log("────────────────────────────────\n");

// ---------- ASCII GRAPH ----------
console.log("📈 Activity graph (hours)");
rows.forEach((r) => {
  const bars = "█".repeat(Math.min(40, Math.round(Number(r.Hours) * 2)));
  console.log(`${r.Date} | ${bars} ${r.Hours}h`);
});
console.log("");
