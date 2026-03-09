Sky, hello! В мене в шаблоні є файли де підключаються всі стилі проекту! Дам тобі всі основні файли з папок style/scss, а ти проаналізуєш і скажеш які файли можна об`єнати, а які видалити чи перенести, а можливо створити додаткові папки з файлами для різних потреб в майбутньому при масштабуванні нашого шаблону! Домовились?
Я кидаю тобі простиню з файлів від головного до другорядних, а ти кажеш що так а що не так !?

/* ************************************************************************************ стилі впорядкування ************************************************************************************ */
1)/* src/styles/style.scss */

@use "./fonts";
/* Core */
@use "./vars";

/* Mixins API */
@use "./mixins/index" as *;

/* Base */
@use "./base/null";
@use "./base/layout";
@use "./base/themes";
@use "./base/colors";
@use "./base/effects";
@use "./base/utilities";

/* Project settings */
@use "./settings";

/* Dev only */
@use "./dev";


2)/* src/styles/settings.scss */

/* Utility icon placeholder */
.icon {
   display: inline-block;
   width: 1em;
   height: 1em;
   fill: currentColor;
   stroke: currentColor;
}

/* Reset helpers (REQUIRED by forms) */
.btn-reset {
   padding: 0;
   border: none;
   background: transparent;
   cursor: pointer;
}

.input-reset {
   appearance: none;
   border: none;
   background: transparent;
   border-radius: 0;
}

3)/* src\styles\dev.scss */
/* dev-only visibility */
[data-dev-only] {
  display: none;
}

.is-dev [data-dev-only] {
  display: block;
}

/* DEV toggle button */
.dev-toggle {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
}

.dev-toggle__btn {
  background: #7e74f1;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.dev-toggle__btn:hover {
  background: #6b62e6;
}
4)/* src/styles/_vars.scss */
@use "sass:math";
/* ************************************************************************************ Налаштування стилів за промовчуванням) ************************************************************************************ */
/* Typography */
$fontFamily: "Satoshi", system-ui, -apple-system, sans-serif;
$fontSize: 14px;

// Основні кольори
$darkColor: #111;
$mainColor: #fff;

/* ==================================================================================== Налаштування адаптивної сітки ==================================================================================== */
/* Layout,мінімальна ширина сторінки */

//Мінімальна ширина сторінки 
$minWidth: 320px;
//Максимальна ширина сторінки 
$maxWidth: 1920px;
//Ширина обмежуючого контейнера
$maxWidthContainer: 1400px;
// Загальний горизонтальний відступ контейнера (left + right)
$containerPadding: 30px;

// Половина для використання в padding-inline
$containerPaddingSide: math.div($containerPadding, 2);

// Ширина спрацювання першого breakpoint
$containerWidth: $maxWidthContainer + $containerPadding;


/* Breakpoints */
$pc: $containerWidth; // ПК, ноутбуки, деякі планшети в горизонтальному положенні
$tablet: 991.98px; // Планшети, деякі телефони в горизонтальному положенні
$mobile: 767.98px; // Телефони L
$mobileSmall: 479.98px; // S

// Тип адаптива:
// 1 = чуйність (у контейнера немає брейкпоінтів),
// 2 = по брейк-поінтах (контейнер змінює свою ширину по брейк-поінтах)
$responsiveType: 1;

5)/* src\styles\_fonts.scss */

/* AUTO-GENERATED — DO NOT EDIT */


@font-face {
  font-family: "Satoshi";
  src: url("/assets/fonts/Satoshi-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Satoshi-Light";
  src: url("/assets/fonts/Satoshi-Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Satoshi";
  src: url("/assets/fonts/Satoshi-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Satoshi";
  src: url("/assets/fonts/Satoshi-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
  6)/* src\styles\mixins\_units.scss */
@use "sass:math";

@function rem($px, $base: 16) {
  @return math.div($px, $base) * 1rem;
}

@function em($px, $base: 16) {
  @return math.div($px, $base) * 1em;
}

// 🔥 ALIAS ДЛЯ СТАРИХ СНІПЕТІВ
@function toRem($px, $base: 16) {
  @return rem($px, $base);
}

@function toEm($px, $base: 16) {
  @return em($px, $base);
}

7)/* src\styles\mixins\_media.scss */

@mixin up($width) {
  @media (min-width: $width) {
    @content;
  }
}

@mixin down($width) {
  @media (max-width: $width) {
    @content;
  }
}
  8)/* src\styles\mixins\_layout.scss */
// Adaptive grid cards
// gridCards(fit, 280px, 1fr, 24px)

@mixin gridCards($type: fit, $min: 280px, $max: 1fr, $gap: 24px) {
  display: grid;
  gap: $gap;
  grid-template-columns: repeat(auto-#{$type}, minmax($min, $max));
}


// Triangle helper — good for tooltips, dropdowns etc.
@mixin triangle($direction, $color, $size, $size2: $size) {
  width: 0;
  height: 0;

  @if $direction ==left {
    border-top: $size2 solid transparent;
    border-bottom: $size2 solid transparent;
    border-right: $size solid $color;
  }

  @if $direction ==right {
    border-top: $size2 solid transparent;
    border-bottom: $size2 solid transparent;
    border-left: $size solid $color;
  }

  @if $direction ==top {
    border-left: $size2 solid transparent;
    border-right: $size2 solid transparent;
    border-bottom: $size solid $color;
  }

  @if $direction ==bottom {
    border-left: $size2 solid transparent;
    border-right: $size2 solid transparent;
    border-top: $size solid $color;
  }
}

// src/styles/mixins/_index.scss

@forward "./units";
@forward "./media";

9)/* src\styles\mixins\_index.scss */

@forward "./units";
@forward "./media";
@forward "./adaptive";

10)/* src\styles\mixins\_content.scss */
// Add currency symbol
@mixin currency($symbol) {
  &::after {
    content: "#{$symbol}";
  }
}

11)/* src\styles\mixins\_optional-adaptive.scss */
@use "sass:math";
@use "../vars" as *;
@use "./units" as *;

/*
  Adaptive property via clamp()
  Usage:
  @include adaptiveValue(font-size, 32, 18);
  @include adaptiveValue(padding-top, 120, 60, 1440, 480);
*/

@mixin adaptiveValue($property,
  $startSize,
  $minSize,
  $widthFrom: $containerWidth,
  $widthTo: $minWidth) {

  // якщо значення однакові — просто ставимо фіксоване
  @if $startSize ==$minSize {
    #{$property}: toRem($startSize);
  }

  @else {

    $slope: math.div(($startSize - $minSize), ($widthFrom - $widthTo));
    $yIntersection: -$widthTo * $slope + $minSize;

    #{$property}: clamp(#{toRem($minSize)},
      #{toRem($yIntersection)} + #{$slope * 100}vw,
      #{toRem($startSize)});

  }
}

12)/* src\styles\base\_utilities.scss */
/* ============================
   UTILITY SPACE MODIFIERS
============================ */

.no-padding {
  padding: 0 !important;
}

.no-top {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.no-bottom {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

13)/* src/styles/base/_themes.scss */
:root {
  --bg: #ffffff;
  --text: #111111;
}

html[data-theme="dark"] {
  --bg: #0f0f0f;
  --text: #f5f5f5;
}

body {
  background: var(--bg);
  color: var(--text);
}

14)/* src/styles/base/_null.scss */
@use "../vars" as *;

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

*::before,
*::after {
  display: inline-block;
}

/* Document */
html,
body {
  height: 100%;
  min-width: $minWidth;
}

html.lock,
body.lock {
  overflow: hidden;
}

body {
  color: $darkColor;
  font-family: $fontFamily;
  font-size: $fontSize;
  background-color: $mainColor;
}

body {
  scrollbar-gutter: stable;
  //text-rendering: optimizeLegibility;
  -ms-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input,
button,
textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background-color: transparent;
}

input,
textarea {
  width: 100%;
}

label {
  display: inline-block;
}

button,
select,
option {
  cursor: pointer;
}

/* Media */
img,
video {
  max-width: 100%;
  display: block;
  vertical-align: middle;
}



/* Links & lists */
a {
  display: inline-block;
  color: inherit;
  text-decoration: none;
}

ul,
li,
ol {
  list-style: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: inherit;
  font-size: inherit;
}

15)/* src\styles\base\_layout.scss */
@use "sass:math";
@use "../vars" as *;

/* ============================
   WRAPPER
============================ */
.wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.wrapper>main {
  flex: 1 1 auto;
}

/* ============================
   CONTAINERS
============================ */

.container {
  width: 100%;
  max-width: $maxWidthContainer;
  padding-inline: $containerPaddingSide;
  margin-inline: auto;
}

.container-fluid {
  width: 100%;
  padding-inline: $containerPadding;
}

/* ============================
   PAGE SECTIONS
============================ */

$page-section-lg: 96px;
$page-section-md: 72px;
$page-section-sm: 48px;

.page-section {
  padding-block: $page-section-lg;

  @media (max-width: 1024px) {
    padding-block: $page-section-md;
  }

  @media (max-width: 768px) {
    padding-block: $page-section-sm;
  }
}

.page-section--tight {
  padding-block: calc($page-section-sm * 0.75);
}

.page-section--wide {
  padding-block: calc($page-section-lg * 1.35);
}

/* ============================
   CONTENT WRAPPER
============================ */

$content-narrow: 760px;
$content-default: 960px;

.content-wrap {
  max-width: $content-default;
  margin-inline: auto;
}

.content-wrap--narrow {
  max-width: $content-narrow;
}

.content-wrap--wide {
  max-width: none;
}

16)/* src\styles\base\_effects.scss */
[data-ww-watch] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes marqueeMove {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

17)/* src/styles/base/_colors.scss */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --color-primary-active: #0d0d0d;
  --color-danger: #dc2626;


  --text-primary: #111111;
  --text-secondary: #666666;

  --border-color: #e5e5e5;
}

18)/* src\scss\base\ripple.scss */
[data-ripple] {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: button-circle 1.5s ease forwards;
}

@keyframes button-circle {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(10);
    opacity: 0;
  }
}

19)/* src\scss\base\_hover.scss */

/* =====================
   Hover helpers
===================== */

@media (any-hover: hover) {
  [data-hover-scale] {
    transition: transform 0.25s ease;

    &:hover {
      transform: scale(1.03);
    }
  }

  [data-hover-opacity] {
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  [data-hover-underline] {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 0;
      height: 1px;
      background: currentColor;
      transition: width 0.25s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

20)/* src\scss\base\_focus.scss */
/* =====================
   Focus ring (A11Y)
===================== */

:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Buttons, inputs, links */
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--color-accent);
}

/* ************************************************************************************ Стилі -- структура ************************************************************************************ */

Шаблон має бути універсальний і масштабований! Один раз зробив основні папки і стилі на тепер і на майбутнє і все! Щоб завжди пам`ятати де які файли лежать!
Код основних файлів стилів ти вже маєш, а зараз даю тобі повністю структуру нашого шаблона:
Folder PATH listing
Volume serial number is 6CAD-DBB6
C:.
|   .gitignore
|   .vt-activity.log
|   .vt-deadline.json
|   EXAMPLE.html
|   EXAMPLE.js
|   EXAMPLE.SCSS
|   package.json
|   README.md
|   README_ARCHITECTURE.md
|   structure.txt
|   template.config.js
|   vite.config.js
|   
+---.vscode
|       fls.code-snippets
|       settings.json
|       
+---backend
|   |   README.md
|   |   
|   \---php
|       +---api
|       |       README.md
|       |       
|       \---sendmail
|               README.md
|               sendmail.php
|               
+---public
|   |   android-chrome-144x144.png
|   |   android-chrome-192x192.png
|   |   android-chrome-256x256.png
|   |   android-chrome-36x36.png
|   |   android-chrome-384x384.png
|   |   android-chrome-48x48.png
|   |   android-chrome-512x512.png
|   |   android-chrome-72x72.png
|   |   android-chrome-96x96.png
|   |   apple-touch-icon-1024x1024.png
|   |   apple-touch-icon-114x114.png
|   |   apple-touch-icon-120x120.png
|   |   apple-touch-icon-144x144.png
|   |   apple-touch-icon-152x152.png
|   |   apple-touch-icon-167x167.png
|   |   apple-touch-icon-180x180.png
|   |   apple-touch-icon-57x57.png
|   |   apple-touch-icon-60x60.png
|   |   apple-touch-icon-72x72.png
|   |   apple-touch-icon-76x76.png
|   |   apple-touch-icon-precomposed.png
|   |   apple-touch-icon.png
|   |   favicon-16x16.png
|   |   favicon-32x32.png
|   |   favicon-48x48.png
|   |   favicon.ico
|   |   manifest.webmanifest
|   |   
|   \---assets
|       |   sprite.svg
|       |   
|       \---img
|           \---cover
|                   cover-1200.webp
|                   cover-600.webp
|                   cover.webp
|                   test-auto.png
|                   
+---scripts
|       activity-watcher.js
|       add-component.js
|       break-reminder.js
|       build-dev-pages.js
|       build-favicons.js
|       build-fonts.js
|       build-images.js
|       build-preload.js
|       build-svg-sprite.js
|       build-zip.js
|       clean-svg.js
|       create-page.js
|       html-include-plugin.js
|       layout-engine.js
|       online.js
|       posthtml-engine.js
|       projectpage.js
|       stat-build.js
|       stat.js
|       
\---src
    |   contacts-map.html
    |   contacts-support.html
    |   contacts.html
    |   dev-root.html
    |   index.html
    |   work-cases.html
    |   work-team.html
    |   work.html
    |   
    +---assets
    |   |   sprite.svg
    |   |   
    |   +---data
    |   |       menu.docs.json
    |   |       menu.json
    |   |       menu.main.json
    |   |       menu.shop.json
    |   |       
    |   +---files
    |   +---fonts
    |   |       Satoshi-Bold.woff2
    |   |       Satoshi-Light.woff2
    |   |       Satoshi-Medium.woff2
    |   |       Satoshi-Regular.woff2
    |   |       
    |   +---img
    |   |       cover.jpg
    |   |       cover.webp
    |   |       logo.svg
    |   |       
    |   +---svgicons
    |   |       arrow-down.svg
    |   |       arrow-up.svg
    |   |       btn-right-black.svg
    |   |       btn-right.svg
    |   |       control-left.svg
    |   |       control-right.svg
    |   |       favicon.png
    |   |       favicon.svg
    |   |       footer-icon.svg
    |   |       heart-line.svg
    |   |       heart.svg
    |   |       id-card-line.svg
    |   |       logo.svg
    |   |       search-line.svg
    |   |       search.svg
    |   |       social-01.svg
    |   |       social-02.svg
    |   |       social-03.svg
    |   |       social-04.svg
    |   |       user-star-line.svg
    |   |       user.svg
    |   |       website.svg
    |   |       
    |   \---video
    +---components
    |   +---custom
    |   |   +---aside
    |   |   |       aside.html
    |   |   |       aside.js
    |   |   |       aside.scss
    |   |   |       
    |   |   +---promo
    |   |   |       promo.html
    |   |   |       promo.js
    |   |   |       promo.scss
    |   |   |       
    |   |   \---test
    |   |           test.html
    |   |           test.js
    |   |           test.json
    |   |           test.scss
    |   |           
    |   +---dev
    |   |       button-preview.html
    |   |       checkbox-preview.html
    |   |       colors-preview.html
    |   |       da-preview.html
    |   |       focus-preview.html
    |   |       footer-preview.html
    |   |       fullpage-preview.html
    |   |       gallery-preview.html
    |   |       grid-container-preview.html
    |   |       header-preview.html
    |   |       hover-preview.html
    |   |       icons-preview.html
    |   |       layout-core.html
    |   |       layout-grid-preview.html
    |   |       loader-preview.html
    |   |       mansory-preview.html
    |   |       pages-list.html
    |   |       pagging-preview.html
    |   |       quantity-preview.html
    |   |       radio-preview.html
    |   |       range-preview.html
    |   |       rating-preview.html
    |   |       ripple-preview.html
    |   |       scrollto-pro.html
    |   |       section-preview.html
    |   |       select-preview.html
    |   |       showmore-preview.html
    |   |       skeleton-preview.html
    |   |       spollers-preview.html
    |   |       swiper-preview.html
    |   |       tabs-preview.html
    |   |       theme-preview.html
    |   |       watcher-pro.html
    |   |       
    |   +---effects
    |   |   +---cursor
    |   |   |       cursor.js
    |   |   |       cursor.scss
    |   |   |       
    |   |   +---darklite
    |   |   |       darklite.js
    |   |   |       darklite.scss
    |   |   |       
    |   |   +---gsap
    |   |   +---marquee
    |   |   |       marquee.html
    |   |   |       marquee.js
    |   |   |       marquee.scss
    |   |   |       
    |   |   +---mouse
    |   |   +---parallax
    |   |   +---preloader
    |   |   |       preloader.html
    |   |   |       preloader.js
    |   |   |       preloader.scss
    |   |   |       
    |   |   +---ripple
    |   |   |       ripple.js
    |   |   |       ripple.scss
    |   |   |       
    |   |   +---screenshot
    |   |   +---scrollto
    |   |   |       scrollto.html
    |   |   |       scrollto.js
    |   |   |       
    |   |   +---scrollto-pro
    |   |   |       scrollto-pro.html
    |   |   |       scrollto-pro.js
    |   |   |       
    |   |   +---splittype
    |   |   +---tippy
    |   |   \---watcher-pro
    |   |           watcher-pro.js
    |   |           
    |   +---forms
    |   |   +---button
    |   |   |       button.scss
    |   |   |       
    |   |   +---checkbox
    |   |   |       checkbox.html
    |   |   |       checkbox.js
    |   |   |       checkbox.scss
    |   |   |       
    |   |   +---datepicker
    |   |   +---form
    |   |   |       form.html
    |   |   |       form.js
    |   |   |       form.scss
    |   |   |       validation.js
    |   |   |       
    |   |   +---input
    |   |   |       input.html
    |   |   |       input.js
    |   |   |       input.scss
    |   |   |       
    |   |   +---quantity
    |   |   |       quantity.html
    |   |   |       quantity.js
    |   |   |       quantity.scss
    |   |   |       
    |   |   +---radio
    |   |   |       radio.html
    |   |   |       radio.js
    |   |   |       radio.scss
    |   |   |       
    |   |   +---range
    |   |   |       range.html
    |   |   |       range.js
    |   |   |       range.scss
    |   |   |       
    |   |   +---rating
    |   |   |       rating.html
    |   |   |       rating.js
    |   |   |       rating.scss
    |   |   |       
    |   |   +---select
    |   |   |       select.html
    |   |   |       select.js
    |   |   |       select.scss
    |   |   |       
    |   |   \---skeleton
    |   |           skeleton.scss
    |   |           
    |   +---layout
    |   |   +---beforeafter
    |   |   |       beforeafter.html
    |   |   |       beforeafter.js
    |   |   |       beforeafter.scss
    |   |   |       
    |   |   +---dev-pages
    |   |   |       dev-pages.html
    |   |   |       dev-pages.js
    |   |   |       dev-pages.scss
    |   |   |       
    |   |   +---digcounter
    |   |   |       digcounter.html
    |   |   |       digcounter.js
    |   |   |       digcounter.scss
    |   |   |       
    |   |   +---dynamic
    |   |   |       dynamic.js
    |   |   |       dynamic.scss
    |   |   |       
    |   |   +---favicons
    |   |   |       favicons.html
    |   |   |       
    |   |   +---footer
    |   |   |       footer.html
    |   |   |       footer.js
    |   |   |       footer.scss
    |   |   |       
    |   |   +---fullpage
    |   |   |       fullpage.html
    |   |   |       fullpage.js
    |   |   |       fullpage.scss
    |   |   |       
    |   |   +---gallery
    |   |   |       gallery.html
    |   |   |       gallery.js
    |   |   |       gallery.scss
    |   |   |       
    |   |   +---grid-container
    |   |   |       grid-container.html
    |   |   |       grid-container.scss
    |   |   |       
    |   |   +---head
    |   |   |       head.html
    |   |   |       meta.html
    |   |   |       preload.html
    |   |   |       scripts.html
    |   |   |       
    |   |   +---header
    |   |   |       header-js.html
    |   |   |       header.html
    |   |   |       header.js
    |   |   |       header.scss
    |   |   |       
    |   |   +---mansory
    |   |   |       mansory.html
    |   |   |       mansory.js
    |   |   |       mansory.scss
    |   |   |       
    |   |   +---map
    |   |   |       map.js
    |   |   |       map.scss
    |   |   |       
    |   |   +---menu
    |   |   |       menu.dynamic.html
    |   |   |       menu.html
    |   |   |       menu.js
    |   |   |       menu.render.js
    |   |   |       menu.scss
    |   |   |       menu.simple.html
    |   |   |       menu.static.html
    |   |   |       
    |   |   +---overlay
    |   |   |       overlay.html
    |   |   |       overlay.js
    |   |   |       overlay.scss
    |   |   |       
    |   |   +---pagging
    |   |   |       pagging.html
    |   |   |       pagging.js
    |   |   |       pagging.scss
    |   |   |       
    |   |   +---popup
    |   |   |       popup.html
    |   |   |       popup.js
    |   |   |       popup.scss
    |   |   |       
    |   |   +---showmore
    |   |   |       showmore.html
    |   |   |       showmore.js
    |   |   |       showmore.scss
    |   |   |       
    |   |   +---slider
    |   |   +---spollers
    |   |   |       spollers.html
    |   |   |       spollers.js
    |   |   |       spollers.scss
    |   |   |       
    |   |   +---swiper
    |   |   |       swiper.html
    |   |   |       swiper.js
    |   |   |       swiper.scss
    |   |   |       
    |   |   \---tabs
    |   |           tabs.html
    |   |           tabs.js
    |   |           tabs.scss
    |   |           
    |   +---other
    |   |   \---components
    |   |           components.html
    |   |           
    |   +---pages
    |   |   +---contacts
    |   |   |       contacts.html
    |   |   |       contacts.js
    |   |   |       contacts.scss
    |   |   |       
    |   |   +---contacts-map
    |   |   |       contacts-map.html
    |   |   |       contacts-map.js
    |   |   |       contacts-map.scss
    |   |   |       
    |   |   +---contacts-support
    |   |   |       contacts-support.html
    |   |   |       contacts-support.js
    |   |   |       contacts-support.scss
    |   |   |       
    |   |   +---dev-root
    |   |   |       dev-root.js
    |   |   |       
    |   |   +---home
    |   |   |       home.html
    |   |   |       home.js
    |   |   |       home.scss
    |   |   |       
    |   |   +---index
    |   |   |       index.js
    |   |   |       
    |   |   +---work
    |   |   |       work.html
    |   |   |       work.js
    |   |   |       work.scss
    |   |   |       
    |   |   +---work-cases
    |   |   |       work-cases.html
    |   |   |       work-cases.js
    |   |   |       work-cases.scss
    |   |   |       
    |   |   \---work-team
    |   |           work-team.html
    |   |           work-team.js
    |   |           work-team.scss
    |   |           
    |   +---templates
    |   |   +---dev
    |   |   |       dev.html
    |   |   |       
    |   |   +---inner
    |   |   |       inner.html
    |   |   |       inner.js
    |   |   |       inner.scss
    |   |   |       
    |   |   +---main
    |   |   |       main.html
    |   |   |       main.js
    |   |   |       main.scss
    |   |   |       
    |   |   \---projectpage
    |   |           projectpage.html
    |   |           
    |   +---ui
    |   |   +---loader
    |   |   |       loader.scss
    |   |   |       
    |   |   +---theme-toggle
    |   |   |       theme-toggle.html
    |   |   |       theme-toggle.js
    |   |   |       theme-toggle.scss
    |   |   |       
    |   |   \---tooltip
    |   |           tooltip.js
    |   |           tooltip.scss
    |   |           
    |   \---wordpress
    +---copy
    |   |   contacts-map.html
    |   |   contacts-support.html
    |   |   contacts.html
    |   |   index.html
    |   |   work-cases.html
    |   |   work-team.html
    |   |   work.html
    |   |   
    |   +---contacts
    |   |       contacts.html
    |   |       contacts.js
    |   |       contacts.scss
    |   |       
    |   +---contacts-map
    |   |       contacts-map.html
    |   |       contacts-map.js
    |   |       contacts-map.scss
    |   |       
    |   +---contacts-support
    |   |       contacts-support.html
    |   |       contacts-support.js
    |   |       contacts-support.scss
    |   |       
    |   +---index
    |   |       index.js
    |   |       
    |   +---work
    |   |       work.html
    |   |       work.js
    |   |       work.scss
    |   |       
    |   +---work-cases
    |   |       work-cases.html
    |   |       work-cases.js
    |   |       work-cases.scss
    |   |       
    |   \---work-team
    |           work-team.html
    |           work-team.js
    |           work-team.scss
    |           
    +---entries
    |       page.contacts-map.js
    |       page.contacts-support.js
    |       page.contacts.js
    |       page.index.js
    |       page.work-cases.js
    |       page.work-team.js
    |       page.work.js
    |       
    +---js
    |   |   app.js
    |   |   asset-entry.js
    |   |   dev-icons.js
    |   |   modulesLoader.js
    |   |   
    |   +---frameworks
    |   |   +---react
    |   |   \---vue
    |   +---productivity
    |   |       break-reminder.js
    |   |       
    |   +---services
    |   |       body.js
    |   |       events.js
    |   |       focus.js
    |   |       gsap.js
    |   |       keyboard.js
    |   |       logger.js
    |   |       media.js
    |   |       scroll.js
    |   |       splittype.js
    |   |       theme.js
    |   |       
    |   \---utils
    |           body-lock.js
    |           debounce.js
    |           dom.js
    |           index.js
    |           render-template.js
    |           slide.js
    |           throttle.js
    |           
    +---pug
    |   \---components
    +---scss
    |   \---base
    |           ripple.scss
    |           _focus.scss
    |           _hover.scss
    |           
    \---styles
        |   dev.scss
        |   settings.scss
        |   style.scss
        |   _fonts.scss
        |   _vars.scss
        |   
        +---base
        |       _colors.scss
        |       _effects.scss
        |       _layout.scss
        |       _null.scss
        |       _themes.scss
        |       _utilities.scss
        |       
        +---includes
        |       mix.scss
        |       
        \---mixins
                _adaptive.scss
                _content.scss
                _index.scss
                _layout.scss
                _media.scss
                _units.scss
                
Ти накресли також структуру--куда і які файли я маю поперекидувати чи які нові файли і папки маю створити !! ok ?