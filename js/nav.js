// nav.js
// Verantwortlich für: Mobile Navigation ein-/ausklappen

export function initNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");

  if (!navToggle || !navMobile) {
    // Falls eine der Komponenten fehlt, einfach leise aussteigen
    return;
  }

  const toggleNav = () => {
    navMobile.classList.toggle("is-open");
  };

  const closeNav = () => {
    navMobile.classList.remove("is-open");
  };

  // Toggle per Button
  navToggle.addEventListener("click", toggleNav);

  // Beim Klick auf Link im mobilen Menü: Menü schließen
  navMobile.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      closeNav();
    }
  });

  // Optional: Wenn Fenster groß genug wird, mobile Menü sicher schließen
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && navMobile.classList.contains("is-open")) {
      closeNav();
    }
  });
}
