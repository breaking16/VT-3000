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
