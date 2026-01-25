// src/js/modulesLoader.js
import { log, mark, measure } from "./services/logger.js";

console.log("INIT MODULES LOADER");

const IS_DEV = import.meta.env.DEV;
const SLOW = 50;
const CRITICAL = 120;

/* -------------------------
   HELPERS
------------------------- */
async function profileInit(loader, name, el = null, type = "MODULE") {
  const start = `mod:${type}:${name}:start`;
  const end = `mod:${type}:${name}:end`;

  mark(start);

  try {
    const mod = await loader();
    mod?.init?.(el);
  } catch (e) {
    log.error(`${type} FAIL → ${name}`);
    console.error(e);
    return;
  }

  mark(end);
  const entry = measure(`⏱ ${type} ${name}`, start, end);
  if (!entry || !IS_DEV) return;

  const time = entry.duration.toFixed(1);

  if (entry.duration > CRITICAL) {
    log.error(`${type} ${name} ⏱ ${time} ms ❌ CRITICAL`);
  } else if (entry.duration > SLOW) {
    log.warn(`${type} ${name} ⏱ ${time} ms ⚠ SLOW`);
  } else {
    log.module(`${type} ${name} ⏱ ${time} ms`);
  }
}

/* -------------------------
   CORE MODULES (data-ww-*)
------------------------- */
const CORE_MODULES = {
  header: () => import("@components/layout/header/header.js"),
  footer: () => import("@components/layout/footer/footer.js"),
  overlay: () => import("@components/layout/overlay/overlay.js"),
  menu: () => import("@components/layout/menu/menu.js"),
  map: () => import("@components/layout/map/map.js"),

  tabs: () => import("@components/layout/tabs/tabs.js"),
  spollers: () => import("@components/layout/spollers/spollers.js"),
  popup: () => import("@components/layout/popup/popup.js"),

  form: () => import("@components/forms/form/form.js"),
  input: () => import("@components/forms/input/input.js"),
  masonry: () => import("@components/layout/mansory/mansory.js"),

  marquee: () => import("@components/effects/marquee/marquee.js"),
  ripple: () => import("@components/effects/ripple/ripple.js"),

  quantity: () => import("@components/forms/quantity/quantity.js"),
  checkbox: () => import("@components/forms/checkbox/checkbox.js"),
  radio: () => import("@components/forms/radio/radio.js"),

  // 🟣 NEW — modern showmore
  showmore: () => import("@components/layout/showmore/showmore.js"),
};

/* -------------------------
   CORE INIT
------------------------- */
async function initCoreModules() {
  log.group("CORE MODULES");

  for (const name in CORE_MODULES) {
    const selector = `[data-ww-${name}]`;
    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) continue;

    for (const el of nodes) {
      await profileInit(CORE_MODULES[name], name, el, "CORE");
    }
  }

  log.groupEnd();
}

/* -------------------------
   CUSTOM MODULES
------------------------- */
async function initCustomModules() {
  log.group("CUSTOM MODULES");

  const nodes = document.querySelectorAll("*");

  for (const el of nodes) {
    for (const attr of el.attributes) {
      if (!attr.name.startsWith("data-wwc-")) continue;

      const name = attr.name.replace("data-wwc-", "");

      await profileInit(
        () => import(`@components/custom/${name}/${name}.js`),
        name,
        el,
        "CUSTOM"
      );
    }
  }

  log.groupEnd();
}

/* -------------------------
   LAYOUT MODULES
------------------------- */
async function initLayoutModules() {
  const nodes = document.querySelectorAll("[data-module]");
  if (!nodes.length) return;

  log.group("LAYOUT MODULES");

  for (const el of nodes) {
    const name = el.dataset.module;

    await profileInit(
      () => import(`@components/layout/${name}/${name}.js`),
      name,
      el,
      "LAYOUT"
    );
  }

  log.groupEnd();
}

/* -------------------------
   PUBLIC API
------------------------- */
export async function initModules() {
  mark("modules:init:start");

  await initCoreModules();
  await initCustomModules();
  await initLayoutModules();

  mark("modules:init:end");
  measure("Modules init", "modules:init:start", "modules:init:end");
}
