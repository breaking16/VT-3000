/* src\js\asset-entry.js */

// 🔤 Fonts — реєструємо всі файли
import.meta.glob("../assets/fonts/**/*.{woff,woff2,ttf,otf}", {
  eager: true,
});

// 🖼 Images
import.meta.glob("../assets/img/**/*", {
  eager: true,
});

// 🧩 SVG sprite
import "../assets/sprite.svg";
