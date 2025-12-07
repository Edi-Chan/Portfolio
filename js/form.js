// form.js
// Verantwortlich für: Kontaktformular-Validierung & Feedback

export function initContactForm() {
  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");

  if (!form || !status) return;

  const setStatus = (message, color) => {
    status.textContent = message;
    status.style.color = color;

    clearTimeout(status._timeoutId);
    status._timeoutId = setTimeout(() => {
      status.textContent = "";
    }, 4000);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get("name")?.trim();
    const email = data.get("email")?.trim();
    const message = data.get("message")?.trim();

    if (!name || !email || !message) {
      setStatus("Bitte alle Felder ausfüllen.", "#f97373");
      return;
    }

    // Hier würde später ein echter Request stehen
    setStatus("Danke für deine Nachricht! Ich melde mich so bald wie möglich.", "#a5b4fc");

    form.reset();
  });
}
