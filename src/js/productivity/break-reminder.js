// src\js\productivity\break-reminder.js
const BREAK_INTERVAL_MIN = 45;

let lastBreak = Date.now();

function formatMinutes(ms) {
  return Math.round(ms / 1000 / 60);
}

function showTerminalNotice(minutes) {
  console.log(
    `\n⚡ VT-3000 Productivity\n` +
      `🕒 Працюєш вже ${minutes} хв\n` +
      `💡 Зроби перерву: розімнись, подихай, попий води\n`
  );
}

function showUiToast() {
  const box = document.createElement("div");

  box.style.position = "fixed";
  box.style.right = "16px";
  box.style.bottom = "16px";
  box.style.padding = "14px 18px";
  box.style.borderRadius = "10px";
  box.style.background = "#7e74f1";
  box.style.color = "#fff";
  box.style.fontFamily = "Inter, sans-serif";
  box.style.zIndex = "99999";
  box.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";
  box.style.maxWidth = "280px";

  box.innerHTML = `
    🕒 Пора зробити перерву<br>
    <small>ти вже за компом ${formatMinutes(Date.now() - lastBreak)} хв</small>
  `;

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 8000);
}

export function initBreakReminder() {
  setInterval(() => {
    const diff = Date.now() - lastBreak;
    const minutes = formatMinutes(diff);

    if (minutes >= BREAK_INTERVAL_MIN) {
      showTerminalNotice(minutes);
      showUiToast();
      lastBreak = Date.now();
    }
  }, 60000); // check once per minute
}
