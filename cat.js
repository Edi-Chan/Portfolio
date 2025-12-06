/* ============================================
   KATZEN-ANIMATION – SMOOTH VERSION
   - Kopf folgt Maus mit sanftem Nachziehen
   - Pupillen folgen weich
   - Körper atmet
   - Pfote hebt sich spielerisch
   - Schwanz wackelt
   - Blinzeln
   ============================================ */

const head = document.getElementById("head");
const body = document.getElementById("body");
const paw = document.getElementById("paw");
const tail = document.getElementById("tail");

const eyelidL = document.getElementById("eyelid-left");
const eyelidR = document.getElementById("eyelid-right");

const pupilL = document.getElementById("pupil-left");
const pupilR = document.getElementById("pupil-right");

let mouseX = 0;
let mouseY = 0;
let t = 0;
let blinkTimer = 0;

// für sanftes Nachziehen
let currentAngle = 0;
let targetAngle = 0;

let currentPupilX = 0;
let currentPupilY = 0;
let targetPupilX = 0;
let targetPupilY = 0;

/* ---------------------------------------------------
   GLOBAL MOUSE MOVE TRACKING
--------------------------------------------------- */
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

/* Kleines Hilfs-Lerp für sanfte Übergänge */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/* ---------------------------------------------------
   ANIMATION LOOP
--------------------------------------------------- */
function animateCat() {
  t += 0.05;
  blinkTimer++;

  /* ===========================
     KOPF FOLGT MAUS (SMOOTH)
     =========================== */
  const rect = head.getBoundingClientRect();

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = mouseX - cx;
  const dy = mouseY - cy;

  // Rohwinkel berechnen
  const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  // SVG-Rotation dreht "anders herum", daher invertieren
  const flippedAngle = -rawAngle;

  // Kopfbewegung begrenzen
  const limitedAngle = Math.max(-40, Math.min(40, flippedAngle));

  // Zielwinkel setzen
  targetAngle = limitedAngle;

  // Sanftes Nachziehen
  currentAngle = lerp(currentAngle, targetAngle, 0.08);

  head.setAttribute(
    "transform",
    `translate(150,120) rotate(${currentAngle})`
  );

  /* ===========================
     PUPILLEN – SMOOTH FOLLOW
     =========================== */
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  targetPupilX = ux * 4;
  targetPupilY = uy * 4;

  currentPupilX = lerp(currentPupilX, targetPupilX, 0.18);
  currentPupilY = lerp(currentPupilY, targetPupilY, 0.18);

  pupilL.setAttribute("cx", currentPupilX);
  pupilL.setAttribute("cy", currentPupilY);
  pupilR.setAttribute("cx", currentPupilX);
  pupilR.setAttribute("cy", currentPupilY);

  /* ===========================
     ATEM-EFFEKT (KÖRPER)
     =========================== */
  const breathe = Math.sin(t) * 4;
  body.setAttribute("transform", `translate(0, ${breathe})`);

  /* ===========================
     PFOTE
     =========================== */
  const pawMove = Math.sin(t * 2) * 6;
  paw.setAttribute("transform", `translate(0, ${pawMove})`);

  /* ===========================
     SCHWANZ
     =========================== */
  const tailAngle = Math.sin(t * 2) * 4;
  tail.setAttribute("transform", `rotate(${tailAngle} 215 220)`);

  /* ===========================
     BLINZELN
     =========================== */
  if (blinkTimer % 260 === 0) {
    eyelidL.setAttribute("ry", 2);
    eyelidR.setAttribute("ry", 2);

    setTimeout(() => {
      eyelidL.setAttribute("ry", 18);
      eyelidR.setAttribute("ry", 18);
    }, 150);
  }

  requestAnimationFrame(animateCat);
}

// Animation starten
animateCat();
