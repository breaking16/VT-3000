Хочу налаштувати режим npm run build і видає помилку!
walter@DESKTOP-4GG4SD7 MINGW64 ~/Desktop/VS/vt-3000 (master)
$ npm run build

> vt-3000@1.0.0 build
> node scripts/clean-svg.js && node scripts/build-svg-sprite.js && node scripts/build-fonts.js && node scripts/build-preload.js && node scripts/build-favicons.js && node scripts/build-images.js && vite build

🧼 cleaned: arrow-down.svg
🧼 cleaned: arrow-up.svg       
🧼 cleaned: btn-right-black.svg
🧼 cleaned: btn-right.svg      
🧼 cleaned: control-left.svg   
🧼 cleaned: control-right.svg  
🧼 cleaned: favicon.svg     
🧼 cleaned: footer-icon.svg 
🧼 cleaned: heart-line.svg  
🧼 cleaned: heart.svg       
🧼 cleaned: id-card-line.svg
🧼 cleaned: logo.svg        
🧼 cleaned: search-line.svg 
🧼 cleaned: search.svg      
🧼 cleaned: social-01.svg     
🧼 cleaned: social-02.svg     
🧼 cleaned: social-03.svg     
🧼 cleaned: social-04.svg     
🧼 cleaned: user-star-line.svg
🧼 cleaned: user.svg
🧼 cleaned: website.svg
✅ SVG icons cleaned   
🧩 SVG sprite generated → src/assets/sprite.svg (21 icons)
ℹ️ No font files — skipping
⚡ preload.html generated
🟣 favicons generated in public/
🟣 favicons.html updated
[images] Build started
🖼 processing: cover.jpg
[images] Found 99 HTML files
[images] Build finished
vite v5.4.21 building for production...
✓ 8 modules transformed.
x Build failed in 80ms
error during build:
Could not resolve "./entries/page.work-team.js" from "src/work-team.html"
file: C:/Users/walter/Desktop/VS/vt-3000/src/work-team.html
    at getRollupError (file:///C:/Users/walter/Desktop/VS/vt-3000/node_modules/rollup/dist/es/shared/parseAst.js:400:41)
    at error (file:///C:/Users/walter/Desktop/VS/vt-3000/node_modules/rollup/dist/es/shared/parseAst.js:396:42)
    at ModuleLoader.handleInvalidResolvedId (file:///C:/Users/walter/Desktop/VS/vt-3000/node_modules/rollup/dist/es/shared/node-entry.js:21666:24)
    at file:///C:/Users/walter/Desktop/VS/vt-3000/node_modules/rollup/dist/es/shared/node-entry.js:21626:26

walter@DESKTOP-4GG4SD7 MINGW64 ~/Desktop/VS/vt-3000 (master)
$
Шаблон має на кожній сторінці підвантажувати тільки той код js/css який там є ! Наприклад- на головній є спойлери і таби(папка src\components\layout\spollers і папка  src\components\layout\tabs) то при npm run dev має завнтажуватись тільки цей код і не треба тягнути всю логіку з усіх папок компонентів(src\components\effects, src\components\forms, src\components\layout) для кожної сторінки "про запас" !!!
Режим npm run build має будувати папку dist з картинками, фавіконками, шрифтами!
І він має будувати мінімізовані файли-js для кожного компонента що використаний на сайті і режим білда має будувати нормальний(не мінімізований файл-js)! Для дебагу інших розробників--дуже важливо! І так само з всіма файлами-css що були використані на сайті ! Має бути приблизно така структура : 
+---dist
|   |   contacts-map.html
|   |   contacts-support.html
|   |   contacts.html
|   |   index.html
|   |   work-cases.html
|   |   work-team.html
|   |   work.html
|   |   
|   +---assets
|   |   +---fonts
|   |   |       Chillax-Light.woff2
|   |   |       Chillax-Medium.woff2
|   |   |       Chillax-Regular.woff2
|   |   |       Chillax-Semibold.woff2
|   |   |       
|   |   \---img
|   |       |   cover-1200.webp
|   |       |   cover-600.webp
|   |       |   cover.jpg
|   |       |   cover.webp
|   |       |   logo.svg
|   |       |   sprite.svg
|   |       |   
|   |       \---svgicons
|   |               favicon.ico
|   |               manifest.webmanifest
|   |               
|   +---css
|   |       app.min.css
|   |       aside.min.css
|   |       beforeafter.min.css
|   |       checkbox.min.css
|   |       contacts-map.min.css
|   |       dev-pages.min.css
|   |       digcounter.min.css
|   |       footer.min.css
|   |       form.min.css
|   |       fullpage.min.css
|   |       gallery.min.css
|   |       header.min.css
|   |       input.min.css
|   |       mansory.min.css
|   |       map.min.css
|   |       marquee.min.css
|   |       menu.min.css
|   |       overlay.min.css
|   |       popup.min.css
|   |       promo.min.css
|   |       quantity.min.css
|   |       radio.min.css
|   |       showmore.min.css
|   |       spollers.min.css
|   |       tabs.min.css
|   |       test.min.css
|   |       vendor.min.css
|   |       
|   \---js
|           app.min.js
|           aside.min.js
|           beforeafter.min.js
|           checkbox.min.js
|           dev-pages.min.js
|           digcounter.min.js
|           dynamic.min.js
|           footer.min.js
|           form.min.js
|           fullpage.min.js
|           gallery.min.js
|           header.min.js
|           input.min.js
|           mansory.min.js
|           map.min.js
|           marquee.min.js
|           menu.min.js
|           menu.render.min.js
|           modulepreload-polyfill.min.js
|           overlay.min.js
|           pagging.min.js
|           popup.min.js
|           promo.min.js
|           quantity.min.js
|           radio.min.js
|           showmore.min.js
|           spollers.min.js
|           swiper.min.js
|           tabs.min.js
|           test.min.js
|           vendor.min.js

Але ще мають бути повнорозмірні файли js/css ! Тільки ті що були використані на сайті ! Не всі з шаблону !!

/* ==================================================================================== Section ==================================================================================== */ 
1) Вже прибрав ./entries/page.*.js з HTML

<!-- ←←← src\work-team.html →→→ -->
<layout src="@components/templates/main/main.html" locals='{
  "title": "Work Team",
  "lang": "en",
  "active": "work-team"



}'>


  <block name="header">
    <include src="@components/layout/header/header.html" locals='{
      "active": "work-team",
      "home": "false",
    }'>
    </include>
  </block>


  <block name="main">
    <include src="@components/pages/work-team/work-team.html" locals='{}'></include>
  </block>

  <block name="footer">
    <include src="@components/layout/footer/footer.html" locals='{}'></include>
  </block>

</layout>

2)Дозволити app.js керувати сторінками -- нам треба переписати app.js щоб весь css не вантажився! Ось мій файл:
/* src\js\app.js */

import { log, mark, measure } from "./services/logger.js";

/* =====================
   0️⃣ BOOT
===================== */

log.banner();
log.boot("startup…");

mark("app:start");

/* =====================
   1️⃣ GLOBAL STYLES
===================== */

mark("styles:start");

import "../styles/style.scss";

import.meta.glob("../components/custom/*/*.scss", { eager: true });
import.meta.glob("../components/layout/*/*.scss", { eager: true });
import.meta.glob("../components/ui/*/*.scss", { eager: true });
import.meta.glob("../components/forms/*/*.scss", { eager: true });
import.meta.glob("../components/effects/*/*.scss", { eager: true });

mark("styles:end");
measure("Styles loaded", "styles:start", "styles:end");

/* =====================
   2️⃣ INFRASTRUCTURE
===================== */

mark("infra:start");

import { initModules } from "./modulesLoader.js";
import { initWatcherPro } from "@components/effects/watcher-pro/watcher-pro.js";

import { getTheme, setTheme } from "./services/theme.js";
import { init as initThemeToggle } from "@components/ui/theme-toggle/theme-toggle.js";

import { init as initRipple } from "@components/effects/ripple/ripple.js";

import { init as initScrollTo } from "@components/effects/scrollto/scrollto.js";
import { init as initScrollToPro } from "@components/effects/scrollto-pro/scrollto-pro.js";

import { init as initPreloader } from "@components/effects/preloader/preloader.js";
import { init as initCursor } from "@components/effects/cursor/cursor.js";
import { init as initDarklite } from "@components/effects/darklite/darklite.js";

mark("infra:end");
measure("Infrastructure loaded", "infra:start", "infra:end");

/* =====================
   3️⃣ GLOBAL INIT
===================== */

log.group("Global init");
mark("global:init:start");

initWatcherPro();
log.info("Watcher-PRO ready");

initScrollTo();
initPreloader();
initDarklite();

initScrollToPro();
log.info("ScrollTo-PRO ready");

setTheme(getTheme());
initThemeToggle();
log.info("Theme initialized");

initRipple();
// initCursor(); // optional

mark("global:init:end");
measure("Global init", "global:init:start", "global:init:end");

log.groupEnd();

/* =====================
   4️⃣ PAGE-BASED JS
===================== */

const page = location.pathname.split("/").pop().replace(".html", "") || "index";

mark(`page:${page}:start`);

const pageMap = {
  index: () => import("../components/pages/home/home.js"),
  contacts: () => import("../components/pages/contacts/contacts.js"),
  work: () => import("../components/pages/work/work.js"),
  "dev-root": () => import("../components/pages/dev-root/dev-root.js"),
};

if (pageMap[page]) {
  pageMap[page]()
    .then(() => {
      mark(`page:${page}:end`);
      measure(`Page init: ${page}`, `page:${page}:start`, `page:${page}:end`);
      log.page(`${page}.js loaded`);
    })
    .catch((e) => log.error(`[PAGE ERROR] ${page}`, e));
}

/* =====================
   5️⃣ DEV ONLY
===================== */

if (import.meta.env.DEV) {
  import("./dev-icons.js").then(() => log.info("Dev icons loaded"));

  import("./productivity/break-reminder.js")
    .then((m) => {
      m.initBreakReminder();
      log.info("Break reminder active ⏳");
    })
    .catch((e) => log.warn("Break reminder failed", e));
}

/* =====================
   6️⃣ MODULES
===================== */

mark("modules:init:start");

initModules();
log.info("Modules initialized");

mark("modules:init:end");
measure("Modules init", "modules:init:start", "modules:init:end");

/* =====================
   🏁 APP READY
===================== */

mark("app:end");
measure("APP TOTAL", "app:start", "app:end");

log.boot("ready 🚀");
3) Перенести SCSS імпорти всередину компонентів -- в кожен компонент що має js і scss через import  додам стилі !
4️⃣ Залишити Vite chunk system


Зараз build будує суто 7 файлів html без робочої сторінки !
Короче -- треба білд який можна віддати замовнику як готовий проект для завантаження на хостинг з можливістю дебагінг! comprende ??
 файли vite.config.js і modulesLoader.js ти вже маєш ! якщо щось треба -- файли то кажи ! І ще питання -- ми можемо побудувати серйозний робочий білд на цій основі з тими запитами ??

 /* ==================================================================================== Section ==================================================================================== */
 1)Вибираю B) Або повністю перепишемо vite.config під enterprise шаблон
 2) Видали всі import.meta.glob(...scss), мій оновлений файл логіки(входу):
 /* src\js\app.js */
 
 import { log, mark, measure } from "./services/logger.js";
 
 /* =====================
    0️⃣ BOOT
 ===================== */
 
 log.banner();
 log.boot("startup…");
 
 mark("app:start");
 
 /* =====================
    1️⃣ GLOBAL STYLES
 ===================== */
 
 mark("styles:start");
 
 import "../styles/style.scss";
 
 
 mark("styles:end");
 measure("Styles loaded", "styles:start", "styles:end");
 
 /* =====================
    2️⃣ INFRASTRUCTURE
 ===================== */
 
 mark("infra:start");
 
 import { initModules } from "./modulesLoader.js";
 import { initWatcherPro } from "@components/effects/watcher-pro/watcher-pro.js";
 
 import { getTheme, setTheme } from "./services/theme.js";
 import { init as initThemeToggle } from "@components/ui/theme-toggle/theme-toggle.js";
 
 import { init as initRipple } from "@components/effects/ripple/ripple.js";
 
 import { init as initScrollTo } from "@components/effects/scrollto/scrollto.js";
 import { init as initScrollToPro } from "@components/effects/scrollto-pro/scrollto-pro.js";
 
 import { init as initPreloader } from "@components/effects/preloader/preloader.js";
 import { init as initCursor } from "@components/effects/cursor/cursor.js";
 import { init as initDarklite } from "@components/effects/darklite/darklite.js";
 
 mark("infra:end");
 measure("Infrastructure loaded", "infra:start", "infra:end");
 
 /* =====================
    3️⃣ GLOBAL INIT
 ===================== */
 
 log.group("Global init");
 mark("global:init:start");
 
 initWatcherPro();
 log.info("Watcher-PRO ready");
 
 initScrollTo();
 initPreloader();
 initDarklite();
 
 initScrollToPro();
 log.info("ScrollTo-PRO ready");
 
 setTheme(getTheme());
 initThemeToggle();
 log.info("Theme initialized");
 
 initRipple();
 // initCursor(); // optional
 
 mark("global:init:end");
 measure("Global init", "global:init:start", "global:init:end");
 
 log.groupEnd();
 
 /* =====================
    4️⃣ PAGE-BASED JS
 ===================== */
 
 const page = location.pathname.split("/").pop().replace(".html", "") || "index";
 
 mark(`page:${page}:start`);
 
 const pageMap = {
   index: () => import("../components/pages/home/home.js"),
   contacts: () => import("../components/pages/contacts/contacts.js"),
   work: () => import("../components/pages/work/work.js"),
   "dev-root": () => import("../components/pages/dev-root/dev-root.js"),
 };
 
 if (pageMap[page]) {
   pageMap[page]()
     .then(() => {
       mark(`page:${page}:end`);
       measure(`Page init: ${page}`, `page:${page}:start`, `page:${page}:end`);
       log.page(`${page}.js loaded`);
     })
     .catch((e) => log.error(`[PAGE ERROR] ${page}`, e));
 }
 
 /* =====================
    5️⃣ DEV ONLY
 ===================== */
 
 if (import.meta.env.DEV) {
   import("./dev-icons.js").then(() => log.info("Dev icons loaded"));
 
   import("./productivity/break-reminder.js")
     .then((m) => {
       m.initBreakReminder();
       log.info("Break reminder active ⏳");
     })
     .catch((e) => log.warn("Break reminder failed", e));
 }
 
 /* =====================
    6️⃣ MODULES
 ===================== */
 
 mark("modules:init:start");
 
 initModules();
 log.info("Modules initialized");
 
 mark("modules:init:end");
 measure("Modules init", "modules:init:start", "modules:init:end");
 
 /* =====================
    🏁 APP READY
 ===================== */
 
 mark("app:end");
 measure("APP TOTAL", "app:start", "app:end");
 
 log.boot("ready 🚀");
 

 3)Перевір що app.js реально підключений в layout -- де це подивитись-перевірити в якому файлі?
 4)Відредагуй(якщо треба-під новий білд) файл vite.config:
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

5)Додав import "./component.scss" у кожен js-компонент