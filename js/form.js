// form.js
// Kontaktformular + Custom Selects + Validierung + Supabase Mail

export function initContactForm() {
  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");

  if (!form || !status) return;

  /* ---------- STATUS ---------- */
  const setStatus = (msg, color) => {
    status.textContent = msg;
    status.style.color = color;
    clearTimeout(status._t);
    status._t = setTimeout(() => (status.textContent = ""), 4000);
  };

  /* ---------- CUSTOM SELECTS ---------- */
  const selects = form.querySelectorAll(".custom-select");

  selects.forEach(select => {
    const trigger = select.querySelector(".select-trigger");
    const options = select.querySelector(".select-options");
    const hidden = select.querySelector("input[type='hidden']");

    if (!trigger || !options || !hidden) return;

    trigger.addEventListener("click", e => {
      e.stopPropagation();
      selects.forEach(s => {
        if (s !== select) s.classList.remove("open");
      });
      select.classList.toggle("open");
    });

    options.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => {
        hidden.value = li.dataset.value;
        trigger.textContent = li.textContent;
        select.classList.remove("open");
      });
    });
  });

  document.addEventListener("click", () => {
    selects.forEach(s => s.classList.remove("open"));
  });

  /* ---------- SUBMIT ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(form);

    const requiredFields = [
      "name",
      "email",
      "message",
      "projectType",
      "goal"
    ];

    for (const field of requiredFields) {
      if (!data.get(field)) {
        setStatus("Bitte alle Pflichtfelder ausfüllen.", "#f97373");
        return;
      }
    }

    if (!data.get("consent")) {
      setStatus("Bitte der Datenschutzerklärung zustimmen.", "#f97373");
        return;
    }

fetch("https://vvqjqfslnhydvpainlrv.supabase.co/functions/v1/send-contact-mail", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "apikey": "sb_publishable_1bKa6jFeVLd4JxrBqjQ4sA_hkVqyuOA",
    "Authorization": "Bearer sb_publishable_1bKa6jFeVLd4JxrBqjQ4sA_hkVqyuOA"
  },
  body: JSON.stringify({
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message"),
  }),
})


      .then(() => {
        setStatus("Danke! Nachricht wurde gesendet.", "#a5b4fc");
        form.reset();

        selects.forEach(s => {
          const trigger = s.querySelector(".select-trigger");
          if (trigger) trigger.textContent = "Bitte auswählen";
        });
      })
      .catch(() => {
        setStatus("Fehler beim Senden der Nachricht.", "#f97373");
      });
  });
}
