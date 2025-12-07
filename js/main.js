// main.js
// Zentraler Einstiegspunkt des gesamten Portfolios

import { initNav } from "./nav.js";
import { initSmoothScroll } from "./scroll.js";
import { initFooterYear } from "./footer.js";
import { initTiltCards } from "./tilt.js";
import { initContactForm } from "./form.js";
import { initPricingCards } from "./pricing.js";
import { initProjectSliders } from "./slider.js";
import { initCatLoader } from "./cat-loader.js";

document.addEventListener("DOMContentLoaded", () => {

  // Navigation
  initNav();

  // Smooth Scroll
  initSmoothScroll();

  // Footer: dynamisches Jahr
  initFooterYear();

  // 3D Tilt Cards
  initTiltCards();

  // Kontaktformular
  initContactForm();

  // Pricing Cards auswählbar
  initPricingCards();

  // Slider + Lightbox
  initProjectSliders();

  // Katze dynamisch laden
  initCatLoader();

});
