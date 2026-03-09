#!/usr/bin/env node
/* ====================================================================================
   VT-3000 — BREAK REMINDER (CLI)
   School mode: 45 min work / 10 min break
==================================================================================== */
/* scripts\break-reminder.js */
const WORK_MIN = 45;
const BREAK_MIN = 10;
const CHECK_MS = 60_000;

let sessionStart = Date.now();
let mode = "work"; // work | break

function minutesPassed() {
  return Math.floor((Date.now() - sessionStart) / 1000 / 60);
}

function box(title, text) {
  console.log(`
╔════════════════════════════════════╗
║  ⚡ VT-3000 • ${title.padEnd(18)} ║
╠════════════════════════════════════╣
${text
  .split("\n")
  .map((l) => `║  ${l.padEnd(34)} ║`)
  .join("\n")}
╚════════════════════════════════════╝
`);
}

function bell(times = 1) {
  process.stdout.write("\u0007".repeat(times));
}

function tick() {
  const min = minutesPassed();

  if (mode === "work" && min >= WORK_MIN) {
    bell(2);
    box(
      "BREAK TIME 😎",
      `🕒 Працював ${min} хв\n💡 Встань • вода • очі\n⏸️ Перерва ${BREAK_MIN} хв`,
    );
    mode = "break";
    sessionStart = Date.now();
  }

  if (mode === "break" && min >= BREAK_MIN) {
    bell(3);
    box("BACK TO WORK 💻", `⚡ Перерва закінчилась\n🔥 Нові ${WORK_MIN} хв фокусу`);
    mode = "work";
    sessionStart = Date.now();
  }
}

box(
  "STARTED 🚀",
  `⏳ Режим школи\n📚 ${WORK_MIN} хв робота\n☕ ${BREAK_MIN} хв перерва`,
);
setInterval(tick, CHECK_MS);
