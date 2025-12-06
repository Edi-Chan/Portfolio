// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navMobile = document.querySelector(".nav-mobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("is-open");
  });

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

// Smooth Scroll
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

// Kontaktformular (Dummy)
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

// Intro Logo auto-hide
const introLogo = document.getElementById("intro-logo");

if (introLogo) {
  setTimeout(() => {
    introLogo.style.display = "none";
  }, 3800);
}

/* 3D Tilt Cards */
const tiltCards = document.querySelectorAll("[data-tilt-container]");

tiltCards.forEach(card => {
  const tilt = card.querySelector(".project-tilt");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = ((y / rect.height) - 0.5) * -16;

    tilt.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  });

  card.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateX(0) rotateY(0)";
  });
});

/* ============================================
   PRICING CARD – KLICKBARE AUSWAHL
=============================================== */

const pricingCards = document.querySelectorAll(".pricing-card");

pricingCards.forEach(card => {
  card.addEventListener("click", () => {

    // Alle entfernen
    pricingCards.forEach(c => c.classList.remove("pricing-card-highlight"));

    // Diesem hinzufügen
    card.classList.add("pricing-card-highlight");
  });
});


/* ============================================
   PROJECT CARD MINI-SLIDER
=============================================== */

document.querySelectorAll(".project-card").forEach(card => {
  
  const imgEl = card.querySelector(".slider-image");
  const prevBtn = card.querySelector(".slider-prev");
  const nextBtn = card.querySelector(".slider-next");

  if (!imgEl || !prevBtn || !nextBtn) return;

  const images = card.dataset.images.split(",");
  const links = card.dataset.links ? card.dataset.links.split(",") : [];
  const titles = card.dataset.titles ? card.dataset.titles.split(",") : [];

  let index = 0;

  function updateSlider() {
    imgEl.style.opacity = 0;

    setTimeout(() => {
      imgEl.src = images[index];
      imgEl.alt = titles[index] || "Project image";

      // Falls du später Titel oder Link im Body mitwechseln willst:
      const linkTag = card.querySelector(".project-links a");
      if (linkTag && links[index]) linkTag.href = links[index];

      imgEl.style.opacity = 1;
    }, 180);
  }

  prevBtn.addEventListener("click", e => {
    e.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    updateSlider();
  });

  nextBtn.addEventListener("click", e => {
    e.stopPropagation();
    index = (index + 1) % images.length;
    updateSlider();
  });
});
/* ============================================
   KATZE LADEN + ANIMATION STARTEN
=============================================== */

document.addEventListener("DOMContentLoaded", () => {

  fetch("cat.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("cat-container");
      if (container) container.innerHTML = html;
    })
    .then(() => {

      // Jetzt existiert die Katze im DOM → cat.js laden
      const script = document.createElement("script");
      script.src = "cat.js";
      script.onload = () => {
        // Sobald cat.js geladen ist → Animation starten
        if (typeof animateCat === "function") {
          animateCat();
        }
      };

      document.body.appendChild(script);
    });

});
/* Vorhandener Code bleibt vollständig */

document.querySelectorAll(".project-card").forEach(card => {
  const imgEl = card.querySelector(".slider-image");
  const prevBtn = card.querySelector(".slider-prev");
  const nextBtn = card.querySelector(".slider-next");

  const images = card.dataset.images.split(",");
  const desc = card.dataset.desc || "";
  const title = card.dataset.title || "";

  let index = 0;

  function updateSlider() {
    imgEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = images[index];
      imgEl.style.opacity = 1;
    }, 150);
  }

  prevBtn.onclick = e => {
    e.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    updateSlider();
  };

  nextBtn.onclick = e => {
    e.stopPropagation();
    index = (index + 1) % images.length;
    updateSlider();
  };

  /* LIGHTBOX BEI KLICK */
  imgEl.addEventListener("click", () => {
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbTitle = document.getElementById("lightbox-title");
    const lbDesc = document.getElementById("lightbox-desc");

    lbImg.src = images[index];
    lbTitle.textContent = title;
    lbDesc.textContent = desc;

    lb.classList.add("is-active");
  });
});

/* Lightbox schließen */
const lb = document.getElementById("lightbox");
const lbClose = document.getElementById("lightbox-close");

lbClose.onclick = () => lb.classList.remove("is-active");
lb.onclick = e => {
  if (e.target === lb) lb.classList.remove("is-active");
};
document.addEventListener("keydown", e => {
  if (e.key === "Escape") lb.classList.remove("is-active");
});


