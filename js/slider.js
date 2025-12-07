// slider.js
// Verantwortlich für: Projekt-Slider + Lightbox-Funktion

export function initProjectSliders() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  cards.forEach(card => setupSlider(card));
  initLightbox();
}

function setupSlider(card) {
  const imgEl = card.querySelector(".slider-image");
  const prevBtn = card.querySelector(".slider-prev");
  const nextBtn = card.querySelector(".slider-next");

  if (!imgEl || !prevBtn || !nextBtn) return;

  const images = card.dataset.images?.split(",") || [];
  const titles = card.dataset.titles?.split(",") || [];
  const descs = card.dataset.descs?.split(",") || [];
  const links = card.dataset.links?.split(",") || [];

  let index = 0;

  const updateSlider = () => {
    imgEl.style.opacity = 0;

    setTimeout(() => {
      imgEl.src = images[index];
      imgEl.alt = titles[index] || "Project image";
      imgEl.style.opacity = 1;
    }, 180);
  };

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

  // Lightbox öffnen per Klick
  imgEl.addEventListener("click", () => {
    openLightbox({
      src: images[index],
      title: titles[index] || "",
      desc: descs[index] || "",
      link: links[index] || null
    });
  });
}

function initLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");
  const lbClose = document.getElementById("lightbox-close");

  if (!lb || !lbImg || !lbTitle || !lbDesc || !lbClose) return;

  lbClose.addEventListener("click", () => lb.classList.remove("is-active"));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.classList.remove("is-active");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lb.classList.remove("is-active");
  });
}

function openLightbox({ src, title, desc }) {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");

  lbImg.src = src;
  lbTitle.textContent = title;
  lbDesc.textContent = desc;

  lb.classList.add("is-active");
}
