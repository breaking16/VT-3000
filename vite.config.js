/* vite.config.js */
import { defineConfig } from "vite";
import path from "node:path";
import fg from "fast-glob";
import htmlIncludePlugin from "./scripts/html-include-plugin.js";

const rootDir = path.resolve(__dirname, "src");

// 🔥 беремо ТІЛЬКИ реальні сторінки (без dev-root.html)
function htmlInputs() {
  const files = fg.sync(["src/*.html", "!src/dev-root.html"]);
  const input = {};

  for (const file of files) {
    const name = path.basename(file, ".html");
    input[name] = path.resolve(__dirname, file);
  }

  return input;
}

export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve";
  const isProd = mode === "production";

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

    /* =====================
    CSS / SOURCEMAPS
    ===================== */
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          sourceMap: isDev,
        },
      },
    },

    plugins: [
      // 🔥 PostHTML engine (include / each / if / blocks)
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

    /* =====================
    BUILD (PRO)
    ===================== */
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,

      sourcemap: false, // ❌ sourcemaps у prod не потрібні

      rollupOptions: {
        input: htmlInputs(),

        output: {
          // 🔥 нормальна структура
          entryFileNames: "assets/js/[name].[hash].js",
          chunkFileNames: "assets/js/[name].[hash].js",
          assetFileNames: ({ name }) => {
            if (!name) return "assets/[name].[hash][extname]";
            if (/\.(woff2?|ttf|otf)$/.test(name)) {
              return "assets/fonts/[name][extname]";
            }
            if (/\.(png|jpe?g|svg|webp|gif|ico)$/.test(name)) {
              return "assets/img/[name][extname]";
            }
            return "assets/[name].[hash][extname]";
          },
        },
      },
    },

    server: {
      open: true,
    },

    define: {
      __DEV__: isDev,
      __PROD__: isProd,
    },
  };
});
