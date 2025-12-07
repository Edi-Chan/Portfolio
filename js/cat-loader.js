// cat-loader.js
// Verantwortlich für: Laden der Cat-Seite + Starten der Animation

export function initCatLoader() {
  const container = document.getElementById("cat-container");
  if (!container) return; // Wenn kein Container existiert, leise aussteigen

  loadCatHTML(container)
    .then(() => loadCatScript())
    .then(() => {
      if (typeof window.animateCat === "function") {
        window.animateCat();
      }
    })
    .catch(err => {
      console.error("Cat konnte nicht geladen werden:", err);
    });
}

function loadCatHTML(container) {
  return fetch("../html/cat.html")
    .then(res => {
      if (!res.ok) throw new Error("Fehler beim Laden der cat.html");
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
    });
}

function loadCatScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "../js/cat.js";
    script.onload = resolve;
    script.onerror = () => reject("cat.js konnte nicht geladen werden");

    document.body.appendChild(script);
  });
}
