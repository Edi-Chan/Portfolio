document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro-intro");
  const video = document.querySelector(".intro-video");
  const logo = document.querySelector(".logo-img");

  if (!intro || !video || !logo) return;

  // Verlangsamtes Video
  video.playbackRate = 0.8;

  // Wenn das Video beendet ist → Logo zoomt rein → Intro verschwindet
  video.addEventListener("ended", () => {
    // Logo bekommt die Zoom-in-Animation
    logo.classList.add("zoom-in");

    // Intro nach Zoom-Out ausblenden
    setTimeout(() => {
      intro.classList.add("intro-hidden");
    }, 650); // exakt passend zur zoomIn-Animation
  });
});
