// tilt.js
// Verantwortlich für: 3D-Hover-Effekt auf Projektkarten

export function initTiltCards() {
  const cards = document.querySelectorAll("[data-tilt-container]");

  if (!cards.length) return;

  cards.forEach(card => {
    const tilt = card.querySelector(".project-tilt");
    if (!tilt) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 16;
      const rotateX = ((y / rect.height) - 0.5) * -16;

      tilt.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    };

    const resetTilt = () => {
      tilt.style.transform = "rotateX(0) rotateY(0)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", resetTilt);
  });
}
