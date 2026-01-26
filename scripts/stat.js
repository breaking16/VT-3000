/* scripts/stat.js */
// import { execSync } from "child_process";

// function run(cmd) {
//   try {
//     return execSync(cmd, { encoding: "utf-8" }).trim();
//   } catch {
//     return "";
//   }
// }

// function pad2(n) {
//   return String(n).padStart(2, "0");
// }

// function minutesToHhMm(totalMin) {
//   const h = Math.floor(totalMin / 60);
//   const m = totalMin % 60;
//   return `${h}h ${pad2(m)}m`;
// }

// function money(n) {
//   return `$${Number(n).toFixed(2)}`;
// }

// // ====== CONFIG (env-friendly) ======
// const MIN_PER_COMMIT = Number(process.env.STAT_MIN_PER_COMMIT || 25); // 1 commit = X minutes
// const RATE_PER_HOUR = Number(process.env.STAT_RATE || 20); // $/hour
// const MAX_BAR = Number(process.env.STAT_MAX_BAR || 20); // ASCII width

// // беремо git-логи з датами
// const raw = run(`git log --pretty=format:"%ad" --date=short`);

// if (!raw) {
//   console.log("❌ No git history found");
//   process.exit(0);
// }

// const dates = raw.split("\n").filter(Boolean);

// // commits/day
// const stats = {};
// for (const date of dates) {
//   stats[date] = (stats[date] || 0) + 1;
// }

// const rows = Object.entries(stats).map(([date, commits]) => ({
//   date,
//   commits,
// }));

// rows.sort((a, b) => a.date.localeCompare(b.date));

// const totalCommits = rows.reduce((s, r) => s + r.commits, 0);
// const days = rows.length;
// const avgCommits = totalCommits / Math.max(days, 1);

// const topDay = rows.reduce((a, b) => (b.commits > a.commits ? b : a), rows[0]);

// // ====== TIME & MONEY ESTIMATION ======
// const totalMinutes = totalCommits * MIN_PER_COMMIT;
// const totalHours = totalMinutes / 60;
// const totalEarned = totalHours * RATE_PER_HOUR;

// const avgMinutesPerDay = totalMinutes / Math.max(days, 1);
// const avgEarnedPerDay = (avgMinutesPerDay / 60) * RATE_PER_HOUR;

// // ====== ASCII GRAPH ======
// const maxCommitsInDay = Math.max(...rows.map((r) => r.commits));
// function bar(commits) {
//   if (maxCommitsInDay === 0) return "";
//   const len = Math.max(1, Math.round((commits / maxCommitsInDay) * MAX_BAR));
//   return "▇".repeat(len);
// }

// console.log("\n📊 VT-3000 • Project statistics\n");

// console.table(
//   rows.map((r) => ({
//     Date: r.date,
//     Commits: r.commits,
//     "Est. time": minutesToHhMm(r.commits * MIN_PER_COMMIT),
//     "Est. $": money(((r.commits * MIN_PER_COMMIT) / 60) * RATE_PER_HOUR),
//   })),
// );

// // ASCII графік
// console.log("\n📈 Activity graph (commits → bar)\n");
// for (const r of rows) {
//   const t = minutesToHhMm(r.commits * MIN_PER_COMMIT);
//   console.log(`${r.date}  ${bar(r.commits)}  ${r.commits}c  ${t}`);
// }

// console.log("\n────────────────────────────");
// console.log(`📆 Days worked: ${days}`);
// console.log(`🧠 Total commits: ${totalCommits}`);
// console.log(`⚡ Avg commits/day: ${avgCommits.toFixed(2)}`);
// console.log(`🔥 Top day: ${topDay.date} (${topDay.commits} commits)`);

// console.log("────────────────────────────");
// console.log(
//   `⏱ Est. time: ${minutesToHhMm(totalMinutes)}  (${MIN_PER_COMMIT} min/commit)`,
// );
// console.log(`💰 Rate: ${money(RATE_PER_HOUR)}/hour`);
// console.log(`💵 Est. earned: ${money(totalEarned)}`);
// console.log(
//   `📊 Avg/day: ${minutesToHhMm(Math.round(avgMinutesPerDay))} • ${money(avgEarnedPerDay)}/day`,
// );
// console.log("────────────────────────────\n");
/* scripts/stat.js */
import fs from "fs";
import { execSync } from "child_process";
import path from "path";

// ===== CONFIG =====
const ACTIVITY_LOG = path.resolve(".vt-activity.log");
const SESSION_GAP_MIN = 30; // хв — розрив між сесіями
const HOURLY_RATE = 25; // $ / hour (поміняй під себе)
// ==================

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

// ---------- GIT PART ----------
const rawGit = run(`git log --pretty=format:"%ad" --date=short`);
const gitDates = rawGit ? rawGit.split("\n") : [];
const gitStats = {};
gitDates.forEach((d) => (gitStats[d] = (gitStats[d] || 0) + 1));

// ---------- ACTIVITY PART ----------
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

// ---------- MERGE ----------
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

// ---------- OUTPUT ----------
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
  const bars = "█".repeat(Math.min(40, Math.round(r.Hours * 2)));
  console.log(`${r.Date} | ${bars} ${r.Hours}h`);
});
console.log("");
