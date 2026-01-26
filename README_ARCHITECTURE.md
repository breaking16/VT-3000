🧠 VT-3000 — Architecture Guide

VT-3000 — модульний фронтенд-шаблон із живою документацією,
орієнтований на масштабування, повторне використання та чисту архітектуру.

📌 Основні принципи
1️⃣ Архітектура за роллю, а не за типом файлу

Файли розміщуються за призначенням, а не за розширенням (.js, .scss).

❗ Якщо компонент має HTML — він НЕ глобальний.

2️⃣ Один компонент = одна папка

component/
├─ component.html
├─ component.scss
└─ component.js

✔ легко переносити
✔ легко видаляти
✔ легко документувати
3️⃣ Жива документація замість README-пекла

Усі компоненти мають візуальний preview на службовій сторінці:
/dev-root.html

🗂 Структура проєкту (ключові зони)
🟣 src/styles — Global Core (Фундамент)

Тут НЕМАЄ компонентів.
src/styles/
├─ style.scss ← єдина точка входу стилів
├─ settings.scss ← глобальна типографія / базові правила
├─ dev.scss ← dev-only стилі
│
├─ base/
│ ├─ \_null.scss ← reset
│ ├─ \_themes.scss ← light / dark (CSS vars)
│ ├─ \_layout.scss ← body / wrapper / container
│ ├─ \_base.scss
│ ├─ \_colors.scss
│ └─ \_effects.scss

Дозволено:

reset / normalize

body, .wrapper, .container

CSS variables

themes

accessibility helpers

Заборонено:

gallery / popup / select / tooltip

будь-який HTML-залежний код

🔵 src/components/layout — Layout / UI

Все, що формує структуру сторінки.

components/layout/
├─ header/
├─ footer/
├─ menu/
├─ tabs/
├─ popup/
├─ gallery/
├─ mansory/
├─ swiper/
├─ showmore/

✔ мають HTML
✔ ініціалізуються через data-ww-\* або data-module
✔ підключаються автоматично через modulesLoader.js

🟢 src/components/forms — Form Controls

components/forms/
├─ input/
├─ select/
├─ checkbox/
├─ radio/
├─ range/
├─ rating/
├─ quantity/

✔ доступні через data-ww-\*
✔ мають preview у dev-root
✔ підтримують keyboard / aria

🟡 src/components/custom — Кастомні блоки
components/custom/
├─ aside/
├─ promo/

✔ підключаються через data-wwc-\*
✔ не є частиною core

🟠 src/components/dev — Жива документація

Ключова фішка VT-3000.
components/dev/
├─ header-preview.html
├─ theme-preview.html
├─ layout-core.html
├─ forms-preview.html

✔ показує, як користуватись компонентом
✔ не використовується в продакшені
✔ замінює документацію

🔴 src/scss — Legacy / Libraries
src/scss/
├─ base/ ← legacy (ЧФ3)
└─ libs/
└─ tippy.scss

Використовується ТІЛЬКИ, якщо:

бібліотека не має HTML

або мігрується поступово

⚙️ JS-архітектура
src/js/app.js

підключає стилі

ініціалізує theme

визначає сторінку

запускає modulesLoader

| Тип    | Атрибут       | Шлях              |
| ------ | ------------- | ----------------- |
| Core   | `data-ww-*`   | layout / forms    |
| Custom | `data-wwc-*`  | components/custom |
| Layout | `data-module` | components/layout |

🌗 Theme Architecture
Service (state & persistence)

src/js/services/theme.js

визначає системну тему

зберігає в localStorage

працює з <html data-theme>

❌ без DOM

❌ без UI

UI component

src/components/ui/theme-toggle/

рендер кнопки

user interaction

іконка 🌙 / ☀️

використовує Theme Service

❌ UI не працює з localStorage
❌ Theme логіка не живе в utils

🎛 Effects Policy (SHAO)

SHAO = Speed · Optimization · Automation

Effects — не core.

Effects НЕ повинні:

ламати layout

бути обовʼязковими

автозапускатись

Effects ЗАВЖДИ:

opt-in

ізольовані

керуються data-\* або init()

effects/
├─ scrollto/
├─ marquee/
├─ preloader/
├─ parallax/
├─ ripple/
├─ cursor/
└─ darklite/

❌ не імпортуються глобально
❌ не ініціалізуються без DOM-ознаки

🧩 Типи effects
✅ Recommended

scrollto

marquee

🟡 Opt-in

preloader

parallax

screenshot

GSAP-based

🔴 Demo / Playground

cursor

mouse

experimental visuals

src/js/services/
├─ theme.js
├─ gsap.js
├─ splittype.js

src/js/services/
├─ theme.js
├─ gsap.js
├─ splittype.js

🎨 Styles loading (ВАЖЛИВО)

❗ Компонентні стилі НЕ імпортуються вручну в SCSS.

Вони автоматично підключаються Vite через:

// src/js/app.js
import.meta.glob("../components/**/**/\*.scss", { eager: true });

🌲 Navigation / Menu Architecture

Меню у VT-3000 — data-driven.

HTML:

- не містить логіки
- не містить структури меню

JSON:

- описує дерево навігації
- підтримує необмежену вкладеність

JS:

- рендерить recursive menu
- визначає active path
- будує breadcrumbs / mobile / desktop

components/layout/menu/
├─ menu.html
├─ menu.js
├─ menu.scss
├─ menu.main.json
├─ menu.shop.json
└─ menu.docs.json

style.scss містить ТІЛЬКИ:

variables

mixins

reset

base layout

🏁 Статус

✅ Architecture locked
✅ Готово до масштабування
✅ Готово для фрілансу

🧠 Філософія VT-3000 / SHAO

Краще без ефекту, ніж із зайвим.
Краще opt-in, ніж auto.
Краще швидко, ніж “вау”.
