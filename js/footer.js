// footer.js
// Verantwortlich für: Dynamisches Copyright-Jahr

export function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;

  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
}
