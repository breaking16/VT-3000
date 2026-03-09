// src/components/layout/swiper/swiper.js

import "./swiper.scss";

import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCards,
  EffectCreative,
  Thumbs,
  FreeMode,
  Mousewheel,
  Keyboard,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cards";
import "swiper/css/free-mode";

export function init(root) {
  if (!root) return;

  const options = {
    modules: [
      Navigation,
      Pagination,
      Autoplay,
      EffectFade,
      EffectCards,
      EffectCreative,
      Thumbs,
      FreeMode,
      Mousewheel,
      Keyboard,
    ],

    slidesPerView: 1,
    spaceBetween: 16,
    speed: 600,
    loop: root.hasAttribute("data-swiper-loop"),

    keyboard: {
      enabled: root.hasAttribute("data-swiper-keyboard"),
      onlyInViewport: true,
    },

    mousewheel: root.hasAttribute("data-swiper-mousewheel")
      ? { forceToAxis: true }
      : false,

    autoplay: root.hasAttribute("data-swiper-autoplay")
      ? {
          delay: 3000,
          disableOnInteraction: false,
        }
      : false,

    pagination: root.querySelector(".swiper-pagination")
      ? {
          el: root.querySelector(".swiper-pagination"),
          clickable: true,
        }
      : false,

    navigation: {
      nextEl: root.querySelector(".swiper-button-next"),
      prevEl: root.querySelector(".swiper-button-prev"),
    },

    breakpoints: {
      768: {
        slidesPerView: root.dataset.slidesMd ? Number(root.dataset.slidesMd) : 2,
      },
      1024: {
        slidesPerView: root.dataset.slidesLg ? Number(root.dataset.slidesLg) : 3,
      },
    },
  };

  // 🎨 effects
  if (root.dataset.effect) {
    options.effect = root.dataset.effect;
  }

  const swiper = new Swiper(root, options);

  console.log("[LAYOUT] swiper init", swiper);
}
