// Watcher-PRO — VT-3000 Core
// Нормальний, акуратний IntersectionObserver
// Підтримує: threshold, root, margin, once + події

export function initWatcherPro(root = document) {
  const items = root.querySelectorAll("[data-ww-watch]");
  if (!items.length) return;

  const observers = new Map();

  function parseConfig(el) {
    return {
      root: el.dataset.wwWatchRoot
        ? document.querySelector(el.dataset.wwWatchRoot)
        : null,

      margin: el.dataset.wwWatchMargin || "0px",

      threshold: el.dataset.wwWatchThreshold
        ? Number(el.dataset.wwWatchThreshold)
        : 0.15,

      once: el.hasAttribute("data-ww-watch-once"),
    };
  }

  function getObserverKey(cfg) {
    return `${cfg.root || "viewport"}|${cfg.margin}|${cfg.threshold}`;
  }

  function getOrCreateObserver(cfg) {
    const key = getObserverKey(cfg);

    if (observers.has(key)) return observers.get(key);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => handleEntry(entry, cfg, obs));
      },
      {
        root: cfg.root,
        rootMargin: cfg.margin,
        threshold: cfg.threshold,
      }
    );

    observers.set(key, obs);
    return obs;
  }

  function handleEntry(entry, cfg, obs) {
    const el = entry.target;

    if (entry.isIntersecting) {
      el.classList.add("is-in-view");

      el.dispatchEvent(
        new CustomEvent("ww:in-view", { detail: { entry, target: el } })
      );

      document.dispatchEvent(
        new CustomEvent("ww:in-view", { detail: { entry, target: el } })
      );

      if (cfg.once) {
        obs.unobserve(el);
      }
    } else {
      el.classList.remove("is-in-view");

      document.dispatchEvent(
        new CustomEvent("ww:out-view", { detail: { entry, target: el } })
      );
    }
  }

  items.forEach((el) => {
    const cfg = parseConfig(el);
    const obs = getOrCreateObserver(cfg);
    obs.observe(el);
  });

  console.log("[CORE] watcher-pro init");
}
