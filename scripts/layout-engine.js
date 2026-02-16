/* scripts\layout-engine.js */

import fs from "fs";
import path from "path";

export function applyLayout(html, rootDir) {
  // 1. знайти <template>
  const templateMatch = html.match(
    /<template\s+src="([^"]+)"[^>]*>([\s\S]*?)<\/template>/,
  );

  if (!templateMatch) return html;

  const [, templateSrc, templateInner] = templateMatch;

  // 2. шлях до layout
  const layoutPath = path.resolve(rootDir, templateSrc.replace(/^@/, ""));

  let layoutHtml = fs.readFileSync(layoutPath, "utf-8");

  // 3. зібрати блоки зі сторінки
  const blockRegex = /<block\s+name="([^"]+)">([\s\S]*?)<\/block>/g;
  const blocks = {};

  let match;
  while ((match = blockRegex.exec(templateInner))) {
    blocks[match[1]] = match[2];
  }

  // 4. вставити блоки в layout
  Object.entries(blocks).forEach(([name, content]) => {
    const blockPlaceholder = new RegExp(
      `<block\\s+name="${name}"\\s*><\\/block>`,
      "g",
    );

    layoutHtml = layoutHtml.replace(blockPlaceholder, content);
  });

  return layoutHtml;
}
