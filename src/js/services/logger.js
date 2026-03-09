/* src\js\services\logger.js */

const IS_DEV = import.meta.env.DEV;

/* ==========================
   ASCII BANNER
========================== */
const BANNER = `
██╗   ██╗████████╗ ████████╗
╚██╗ ██╔╝╚══██╔══╝ ╚══██╔══╝
 ╚████╔╝    ██║        ██║
  ╚██╔╝     ██║        ██║
   ██║      ██║        ██║
   ╚═╝      ╚═╝        ╚═╝   VT-3000
`;

const COLORS = {
  boot: "color:#9E9E9E;font-weight:600",
  info: "color:#4CAF50;font-weight:600",
  warn: "color:#FFC107;font-weight:600",
  error: "color:#F44336;font-weight:600",
  module: "color:#7C4DFF;font-weight:600",
  page: "color:#03A9F4;font-weight:600",
};

function stamp() {
  const t = new Date();
  return `[${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}]`;
}

function dev(fn) {
  return (...args) => IS_DEV && fn(...args);
}

/* ==========================
   PERFORMANCE HELPERS
========================== */

export function mark(name) {
  performance.mark(name);
}

function markExists(name) {
  return performance.getEntriesByName(name).length > 0;
}

export function measure(name, start, end) {
  try {
    if (!markExists(start) || !markExists(end)) {
      if (IS_DEV) {
        console.warn(
          `%c⚠ measure skipped: missing marks (${start} / ${end})`,
          "color:#FFC107",
        );
      }
      return;
    }

    performance.measure(name, start, end);

    const entry = performance.getEntriesByName(name).pop();

    log.info(`⏱ ${name}: ${entry.duration.toFixed(2)} ms`);

    // cleanup to avoid memory leak in long sessions
    performance.clearMarks(start);
    performance.clearMarks(end);
    performance.clearMeasures(name);
  } catch (e) {
    log.warn(`measure() failed: ${name}`);
  }
}

/* ==========================
   LOGGER API
========================== */

export const log = {
  banner() {
    if (!IS_DEV) return;
    console.log(`%c${BANNER}`, "color:#7C4DFF;font-weight:bold");
  },

  boot: dev((msg) => console.log(`%c${stamp()} VT-3000 → ${msg}`, COLORS.boot)),

  page: dev((msg) => console.log(`%c${stamp()} [PAGE] ${msg}`, COLORS.page)),

  module: dev((msg) => console.log(`%c${stamp()} [MODULE] ${msg}`, COLORS.module)),

  info: dev((msg) => console.log(`%c${stamp()} ✓ ${msg}`, COLORS.info)),

  warn: dev((msg) => console.warn(`%c${stamp()} ⚠ ${msg}`, COLORS.warn)),

  error: dev((msg) => console.error(`%c${stamp()} ✖ ${msg}`, COLORS.error)),

  group(label) {
    if (!IS_DEV) return;
    console.groupCollapsed(`%c${label}`, "color:#B39DDB;font-weight:600");
  },

  groupEnd() {
    if (!IS_DEV) return;
    console.groupEnd();
  },
};
