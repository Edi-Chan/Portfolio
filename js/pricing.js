// pricing.js
// Verantwortlich für: Pricing Cards auswählbar machen

export function initPricingCards() {
  const cards = document.querySelectorAll(".pricing-card");
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("pricing-card-highlight"));
      card.classList.add("pricing-card-highlight");
    });
  });
}
