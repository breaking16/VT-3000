// src\js\utils\slide.js
// VT-3000 slide helpers
// use: import { slideUp, slideDown, slideToggle } from "@/js/utils/slide.js"

export function slideUp(target, duration = 400, showMore = 0) {
  if (target.classList.contains("_slide")) return;

  target.classList.add("_slide");

  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = `${target.offsetHeight}px`;

  target.offsetHeight; // force reflow

  target.style.overflow = "hidden";
  target.style.height = showMore ? `${showMore}px` : "0px";
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;

  window.setTimeout(() => {
    if (!showMore) target.hidden = true;
    cleanup(target);

    // event → listen if needed
    document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
  }, duration);
}

export function slideDown(target, duration = 400, showMore = 0) {
  if (target.classList.contains("_slide")) return;

  target.classList.add("_slide");
  target.hidden = false;

  if (showMore) target.style.removeProperty("height");

  const height = target.offsetHeight;

  target.style.overflow = "hidden";
  target.style.height = showMore ? `${showMore}px` : "0px";
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;

  target.offsetHeight;

  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = `${height}px`;

  window.setTimeout(() => {
    cleanup(target);

    document.dispatchEvent(
      new CustomEvent("slideDownDone", { detail: { target } })
    );
  }, duration);
}

export function slideToggle(target, duration = 400) {
  return target.hidden ? slideDown(target, duration) : slideUp(target, duration);
}

/* -------------------------
   INTERNAL CLEANER
------------------------- */
function cleanup(target) {
  target.style.removeProperty("height");
  target.style.removeProperty("overflow");
  target.style.removeProperty("transition-duration");
  target.style.removeProperty("transition-property");
  target.classList.remove("_slide");
}
