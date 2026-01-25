// scripts/break-reminder-cli.js
const MINUTES = 45; // змінюй як хочеш
const CHECK_MS = 60_000; // раз на хвилину

let lastBreak = Date.now();

function logBox(text) {
  console.log(`
═════════════════════════════
 ⚡ VT-3000 Productivity
 ${text}
═════════════════════════════`);
}

function remind() {
  const diffMin = Math.round((Date.now() - lastBreak) / 1000 / 60);

  if (diffMin >= MINUTES) {
    logBox(
      `🕒 Ти працюєш уже ${diffMin} хв\n` +
        `💡 Зроби перерву — розімнись, випий води`
    );

    lastBreak = Date.now();
  }
}

logBox("⏳ Break reminder активовано");
setInterval(remind, CHECK_MS);
