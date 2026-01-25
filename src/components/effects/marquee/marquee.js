// src/components/effects/marquee/marquee.js

const GROUPS = new Map();

export function init() {
  document.querySelectorAll("[data-ww-marquee]").forEach(setupMarquee);
}

/* -------------------------
   SETUP
------------------------- */
function setupMarquee(root) {
  const inner = root.querySelector(".marquee__inner");
  if (!inner) return;

  const direction = root.dataset.direction || "left";
  const speed = Number(root.dataset.speed) || 120;
  const group = root.dataset.group || null;

  // NEW 🟣 spacing
  const gap = Number(root.dataset.gap) || 32;
  inner.style.setProperty("--gap", `${gap}px`);

  // NEW 🟣 start offset (seconds)
  const start = Number(root.dataset.start) || 0;

  duplicateUntilFull(inner, direction);

  const duration = calcDuration(inner, speed, direction);

  applyAnimation(inner, direction, duration, start);

  enablePauseOnHover(root);

  if (group) syncGroup(root, inner, group, duration, start);
}

/* -------------------------
   AUTO-CLONE
------------------------- */
function duplicateUntilFull(inner, direction) {
  const isVertical = direction === "up" || direction === "down";
  const wrapperSize = isVertical
    ? inner.parentElement.clientHeight
    : inner.parentElement.clientWidth;

  while ((isVertical ? inner.scrollHeight : inner.scrollWidth) < wrapperSize * 2) {
    inner.insertAdjacentHTML("beforeend", inner.innerHTML);
  }
}

/* -------------------------
   SPEED depends on content size
------------------------- */
function calcDuration(inner, speed, dir) {
  const isVertical = dir === "up" || dir === "down";
  const size = isVertical ? inner.scrollHeight : inner.scrollWidth;

  return Math.max(8, size / speed);
}

/* -------------------------
   APPLY ANIMATION
------------------------- */
function applyAnimation(inner, dir, duration, start) {
  const vertical = dir === "up" || dir === "down";

  inner.style.animationDuration = `${duration}s`;
  inner.style.animationTimingFunction = "linear";
  inner.style.animationIterationCount = "infinite";

  // reverse потрібен тільки для vertical-down
  if (dir === "down") {
    inner.style.animationDirection = "reverse";
  }

  // NEW 🟣 start offset
  if (start) {
    inner.style.animationDelay = `-${start}s`;
  }
}

/* -------------------------
   HOVER PAUSE
------------------------- */
function enablePauseOnHover(root) {
  root.addEventListener("mouseenter", () => root.classList.add("is-paused"));
  root.addEventListener("mouseleave", () => root.classList.remove("is-paused"));
}

/* -------------------------
   GROUP SYNC
------------------------- */
function syncGroup(root, inner, group, duration, start) {
  if (!GROUPS.has(group)) {
    GROUPS.set(group, {
      duration,
      startTime: performance.now() - start * 1000,
    });
  }

  const meta = GROUPS.get(group);

  inner.style.animationDuration = `${meta.duration}s`;

  const offset = ((performance.now() - meta.startTime) / 1000) % meta.duration;

  inner.style.animationDelay = `-${offset}s`;
}
