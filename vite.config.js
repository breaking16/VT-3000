/* vite.config.js */
import { defineConfig } from "vite";
import path from "node:path";
import fg from "fast-glob";
import htmlIncludePlugin from "./scripts/html-include-plugin.js";

const rootDir = path.resolve(__dirname, "src");

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
        "@fonts": path.resolve(rootDir, "assets/fonts"), // 🔥 NEW
      },
    },

    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@styles/vars" as *;`,
        },
      },
    },

    plugins: [
      htmlIncludePlugin({
        root: rootDir,
        aliases: {
          "@components": "components",
          "@js": "js",
          "@styles": "styles",
          "@img": "assets/img",
          "@fonts": "assets/fonts", // 🔥 NEW
        },
      }),

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

      sourcemap: true, // 🔥 для дебагу замовника
      minify: isProd ? "esbuild" : false,

      cssCodeSplit: true,

      rollupOptions: {
        input: htmlInputs(),

        output: {
          entryFileNames: "js/[name].[hash].js",
          chunkFileNames: "js/[name].[hash].js",

          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? "";

            if (name.endsWith(".css")) {
              return "css/[name].[hash][extname]";
            }

            if (/\.(woff2?|ttf|otf)$/.test(name)) {
              return "assets/fonts/[name][extname]";
            }

            if (/\.(png|jpe?g|svg|webp|gif|ico)$/.test(name)) {
              return "assets/img/[name][extname]";
            }

            return "assets/[name][extname]";
          },

          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }

            if (id.includes("/components/")) {
              const parts = id.split("/");
              const compIndex = parts.indexOf("components");

              if (compIndex !== -1 && parts.length > compIndex + 2) {
                const type = parts[compIndex + 1];
                const name = parts[compIndex + 2];

                return `comp-${type}-${name}`;
              }
            }
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
