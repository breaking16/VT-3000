// vite.config.js
import { defineConfig } from "vite";
import path from "path";
import htmlIncludePlugin from "./scripts/html-include-plugin.js";

export default defineConfig(({ command }) => {
  const rootDir = path.resolve(__dirname, "src");
  const isDev = command === "serve";

  return {
    root: rootDir,
    base: "./",

    resolve: {
      alias: {
        "@components": path.resolve(rootDir, "components"),
        "@js": path.resolve(rootDir, "js"),
        "@styles": path.resolve(rootDir, "styles"),
        "@img": path.resolve(rootDir, "assets/img"),
      },
    },

    plugins: [
      // 🔥 PostHTML engine (template, include, each, if, blocks, slots)
      htmlIncludePlugin({
        root: rootDir,
        aliases: {
          "@components": "components",
          "@js": "js",
          "@styles": "styles",
          "@img": "assets/img",
        },
      }),

      // DEV flag → <html class="is-dev">
      {
        name: "html-dev-flag",
        transformIndexHtml(html) {
          if (isDev) {
            return html.replace("<html", '<html class="is-dev"');
          }
          return html;
        },
      },
    ],

    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,

      rollupOptions: {
        input: {
          index: path.resolve(rootDir, "index.html"),
          contacts: path.resolve(rootDir, "contacts.html"),
          // dev-root.html — ❌ НІКОЛИ
        },
      },
    },

    server: {
      open: true,
    },
  };
});
