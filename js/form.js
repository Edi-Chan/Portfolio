// form.js
// Kontaktformular + Custom Selects + Validierung + Supabase Mail

export function initContactForm() {
  const form = document.querySelector(".contact-form");
  const status = document.querySelector(".form-status");
  const fileInput = form?.querySelector('input[type="file"]');

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

  /* ---------- LIVE FILE VALIDATION ---------- */
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const files = [...fileInput.files];

      const MAX_FILES = 5;
      const MAX_SIZE = 5 * 1024 * 1024;
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf"
      ];

      if (files.length > MAX_FILES) {
        setStatus("Maximal 5 Dateien erlaubt.", "#f97373");
        fileInput.value = "";
        return;
      }

      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setStatus("Nur Bilder oder PDF-Dateien erlaubt.", "#f97373");
          fileInput.value = "";
          return;
        }

        if (file.size > MAX_SIZE) {
          setStatus("Eine Datei ist größer als 5 MB.", "#f97373");
          fileInput.value = "";
          return;
        }
      }
    });
  }

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

    /* ---------- FILE VALIDATION (FINAL CHECK) ---------- */
    const files = data.getAll("files[]").filter(f => f.size > 0);

    const MAX_FILES = 5;
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf"
    ];

    if (files.length > MAX_FILES) {
      setStatus("Maximal 5 Dateien erlaubt.", "#f97373");
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setStatus("Nur Bilder oder PDF-Dateien erlaubt.", "#f97373");
        return;
      }

      if (file.size > MAX_SIZE) {
        setStatus("Eine Datei ist größer als 5 MB.", "#f97373");
        return;
      }
    }

    /* ---------- SEND (noch ohne Files) ---------- */
    fetch("https://vvqjqfslnhydvpainlrv.supabase.co/functions/v1/send-contact-mail", {
  method: "POST",
  headers: {
    "apikey": "sb_publishable_...",
    "Authorization": "Bearer sb_publishable_..."
  },
  body: data
})

      .then(() => {
        setStatus("Danke! Nachricht wurde gesendet.", "#1dfc00ff");
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
