/* scripts\html-include-plugin.js */
import path from "path";
import { createPostHtmlEngine } from "./posthtml-engine.js";

export default function htmlIncludePlugin(options = {}) {
  const root = options.root || process.cwd();
  const aliases = options.aliases || {};

  const engine = createPostHtmlEngine({ root, aliases });

  return {
    name: "vt-posthtml-engine",
    async transformIndexHtml(html) {
      // Vite проганяє цю функцію для кожного html (index, contacts і т.д.)
      return await engine.processHtmlString(html, {});
    },
  };
}
