import { execSync } from "child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

// беремо git-логи з датами
const raw = run(`git log --pretty=format:"%ad" --date=short`);

if (!raw) {
  console.log("❌ No git history found");
  process.exit(0);
}

const dates = raw.split("\n");

const stats = {};
dates.forEach((date) => {
  stats[date] = (stats[date] || 0) + 1;
});

const rows = Object.entries(stats).map(([date, commits]) => ({
  date,
  commits,
}));

rows.sort((a, b) => a.date.localeCompare(b.date));

const totalCommits = rows.reduce((s, r) => s + r.commits, 0);
const days = rows.length;
const avg = (totalCommits / days).toFixed(2);
const topDay = rows.reduce((a, b) => (b.commits > a.commits ? b : a));

console.log("\n📊 VT-3000 • Project statistics\n");

console.table(
  rows.map((r) => ({
    Date: r.date,
    Commits: r.commits,
  })),
);

console.log("────────────────────────────");
console.log(`📆 Days worked: ${days}`);
console.log(`🧠 Total commits: ${totalCommits}`);
console.log(`⚡ Avg commits/day: ${avg}`);
console.log(`🔥 Top day: ${topDay.date} (${topDay.commits} commits)`);
console.log("────────────────────────────\n");
