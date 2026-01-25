// template.config.js — ШАО v1 (foundation)

export default {
  // --------------------
  // Project
  // --------------------
  project: {
    name: "SHAO",
    lang: "en",
  },

  // --------------------
  // Pages
  // --------------------
  pages: {
    enable: true,
    src: "src",
    entries: ["index.html", "contacts.html"],
  },
  navpanel: {
    dev: true,
    build: false,
    position: "left",
    color: "#ffffff",
    background: "rgba(51, 51, 51, 0.5)",
    transition: "300",
  },

  // --------------------
  // Images
  // --------------------
  images: {
    optimize: {
      enable: true,
      sizes: [600, 1200],
      dpi: [],
      modern: "webp",
      quality: 80,
      attrIgnore: "data-fls-image-ignore",
    },
  },

  // --------------------
  // JavaScript
  // --------------------
  js: {
    perPage: true, // page-based js
    bundle: false, // all-in-one js
    react: false,
    vue: false,
  },

  // --------------------
  // PHP (dev)
  // --------------------
  php: {
    enable: false,
    base: "src/php",
    host: "localhost",
    port: 1111,
  },

  // --------------------
  // Logger
  // --------------------
  logger: {
    terminal: true,
    console: {
      enable: true,
      removeOnBuild: true,
    },
  },

  // --------------------
  // Coffee ☕
  // --------------------
  coffee: {
    enable: true,
    interval: 45,
    text: "(!) Зроби перерву ☕",
  },
};
