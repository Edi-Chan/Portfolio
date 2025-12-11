// scroll-sections.js
let scrolling = false;

function getSections() {
  return [...document.querySelectorAll("section, #hero")];
}

function getCurrentSection() {
  const sections = getSections();
  const scrollPos = window.scrollY + window.innerHeight / 2;
  return sections.findIndex(sec => scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight);
}

function scrollToSection(index) {
  const sections = getSections();
  if (index < 0 || index >= sections.length) return;

  scrolling = true;
  sections[index].scrollIntoView({ behavior: "smooth" });

  setTimeout(() => scrolling = false, 900);
}

export function initSectionScroll() {
  window.addEventListener("wheel", (e) => {
    if (scrolling) return;

    const currentIndex = getCurrentSection();
    if (currentIndex === -1) return;

    if (e.deltaY > 0) {
      scrollToSection(currentIndex + 1); // runter
    } else {
      scrollToSection(currentIndex - 1); // rauf
    }
  });
}
