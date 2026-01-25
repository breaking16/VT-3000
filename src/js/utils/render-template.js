// scripts\utils\render-template.js
export function renderTemplate(html, locals = {}) {
  if (!html) return "";

  // ---- IF BLOCKS ----
  html = html.replace(
    /\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => {
      const value = key.split(".").reduce((a, k) => a?.[k], locals);

      return value ? content : "";
    }
  );

  // ---- SIMPLE VALUES ----
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = key.split(".").reduce((a, k) => a?.[k], locals);

    return value ?? "";
  });

  return html;
}
