import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export function init() {
  tippy("[data-tooltip]", {
    theme: "default",
    animation: "fade",
  });
}
