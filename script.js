// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navMobile = document.querySelector(".nav-mobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("is-open");
  });

  // Mobile Nav: Close after click on link
  navMobile.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navMobile.classList.remove("is-open");
    }
  });
}

// Dynamisches Jahr im Footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth Scroll für interne Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Dummy-Formular-Handling (Frontend-Feedback ohne echtes Backend)
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!name || !email || !message) {
      formStatus.textContent = "Bitte alle Felder ausfüllen.";
      formStatus.style.color = "#f97373";
      return;
    }

    formStatus.textContent =
      "Danke für deine Nachricht! Ich melde mich so bald wie möglich.";
    formStatus.style.color = "#a5b4fc";

    contactForm.reset();

    setTimeout(() => {
      formStatus.textContent = "";
    }, 4000);
  });
}

// Intro Logo automatisch ausblenden und entfernen
const introLogo = document.getElementById("intro-logo");

if (introLogo) {
  // Sicherstellen, dass es nach der Animation wirklich weg ist
  setTimeout(() => {
    introLogo.style.display = "none";
  }, 3800); // 2.5s visible + 1.5s Fade-Out = 4.0s (klein bisschen früher weg)
}
