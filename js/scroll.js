// scroll.js
// Verantwortlich für: Smooth Scrolling auf der Seite

export function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');

  if (!anchors.length) {
    return;
  }

  const scrollToId = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
  };

  anchors.forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      // Falls ein reiner Anker wie "#" existiert, einfach ignorieren
      if (href === "#") return;

      const id = href.substring(1);
      if (!id) return;

      e.preventDefault();
      scrollToId(id);
    });
  });
}
