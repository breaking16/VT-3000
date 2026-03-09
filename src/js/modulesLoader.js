/* src/js/modulesLoader.js */
import { log, mark, measure } from "./services/logger.js";

console.log("INIT MODULES LOADER");

const IS_DEV = import.meta.env.DEV;
const SLOW = 50;
const CRITICAL = 120;

/* =====================================================
   HELPERS
===================================================== */

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

/* =====================================================
   AUTO REGISTRIES
===================================================== */

// 🔥 CORE (все крім custom)
const CORE_FILES = import.meta.glob(
  "../components/{layout,forms,effects,ui}/**/*.js",
);

// 🔥 CUSTOM
const CUSTOM_FILES = import.meta.glob("../components/custom/**/*.js");

// 🔥 LAYOUT (для data-module)
const LAYOUT_FILES = import.meta.glob("../components/layout/**/*.js");

function buildRegistry(files) {
  const registry = {};

  for (const path in files) {
    const parts = path.split("/");
    const file = parts[parts.length - 1];
    const name = file.replace(".js", "");

    registry[name] = files[path];
  }

  return registry;
}

const CORE_REGISTRY = buildRegistry(CORE_FILES);
const CUSTOM_REGISTRY = buildRegistry(CUSTOM_FILES);
const LAYOUT_REGISTRY = buildRegistry(LAYOUT_FILES);

/* =====================================================
   CACHE (щоб не імпортувати 10 разів)
===================================================== */

const loadedModules = new Set();

/* =====================================================
   CORE INIT (data-ww-*)
===================================================== */

async function initCoreModules() {
  log.group("CORE MODULES");

  const nodes = document.querySelectorAll("*");

  for (const el of nodes) {
    for (const attr of el.attributes) {
      if (!attr.name.startsWith("data-ww-")) continue;

      const name = attr.name.replace("data-ww-", "");

      const loader = CORE_REGISTRY[name];

      if (!loader) {
        if (IS_DEV) log.warn(`No CORE module → ${name}`);
        continue;
      }

      if (loadedModules.has(`core-${name}`)) continue;

      await profileInit(loader, name, el, "CORE");
      loadedModules.add(`core-${name}`);
    }
  }

  log.groupEnd();
}

/* =====================================================
   CUSTOM INIT (data-wwc-*)
===================================================== */

async function initCustomModules() {
  log.group("CUSTOM MODULES");

  const nodes = document.querySelectorAll("*");

  for (const el of nodes) {
    for (const attr of el.attributes) {
      if (!attr.name.startsWith("data-wwc-")) continue;

      const name = attr.name.replace("data-wwc-", "");

      const loader = CUSTOM_REGISTRY[name];

      if (!loader) {
        if (IS_DEV) log.warn(`No CUSTOM module → ${name}`);
        continue;
      }

      if (loadedModules.has(`custom-${name}`)) continue;

      await profileInit(loader, name, el, "CUSTOM");
      loadedModules.add(`custom-${name}`);
    }
  }

  log.groupEnd();
}

/* =====================================================
   LAYOUT INIT (data-module="")
===================================================== */

async function initLayoutModules() {
  const nodes = document.querySelectorAll("[data-module]");
  if (!nodes.length) return;

  log.group("LAYOUT MODULES");

  for (const el of nodes) {
    const name = el.dataset.module;
    const loader = LAYOUT_REGISTRY[name];

    if (!loader) {
      if (IS_DEV) log.warn(`No LAYOUT module → ${name}`);
      continue;
    }

    if (loadedModules.has(`layout-${name}`)) continue;

    await profileInit(loader, name, el, "LAYOUT");
    loadedModules.add(`layout-${name}`);
  }

  log.groupEnd();
}

/* =====================================================
   PUBLIC API
===================================================== */

export async function initModules() {
  mark("modules:init:start");

  await initCoreModules();
  await initCustomModules();
  await initLayoutModules();

  mark("modules:init:end");
  measure("Modules init", "modules:init:start", "modules:init:end");
}
