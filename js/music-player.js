const musicPlayer = document.getElementById("music-player");
const musicToggle = document.getElementById("music-toggle");
const musicPanel = document.getElementById("music-panel");

const audio = document.getElementById("audio-player");
const toggleBtn = document.getElementById("toggle-btn");
const progress = document.getElementById("progress-bar");
const volume = document.getElementById("volume");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");

/* Panel öffnen/schließen */
musicToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  musicPanel.classList.toggle("is-open");
});

/* Panel schließen bei Klick außerhalb */
document.addEventListener("click", (e) => {
  if (!musicPlayer.contains(e.target)) {
    musicPanel.classList.remove("is-open");
  }
});

/* Zeit formatieren */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* Audio-Daten geladen */
audio.addEventListener("loadedmetadata", () => {
  timeTotal.textContent = formatTime(audio.duration);
});

/* Fortschritt aktualisieren */
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
  timeCurrent.textContent = formatTime(audio.currentTime);
});

/* Play/Pause */
toggleBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    toggleBtn.textContent = "⏸";
    musicToggle.classList.add("is-playing");
  } else {
    audio.pause();
    toggleBtn.textContent = "▶";
    musicToggle.classList.remove("is-playing");
  }
});

/* Seek */
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

/* Volume */
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

/* Audio fertig */
audio.addEventListener("ended", () => {
  toggleBtn.textContent = "▶";
  musicToggle.classList.remove("is-playing");
});
