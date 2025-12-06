/* PIXEL CAT ANIMATION – HEAD TILT + SAFE EYES + SQUINT IN CONTACT FORM + STRONG BLINK */

const head = document.getElementById("head");
const body = document.getElementById("body");
const pawL = document.getElementById("paw-left");
const pawR = document.getElementById("paw-right");
const tail = document.getElementById("tail");

const pupilL = document.getElementById("pupil-left");
const pupilR = document.getElementById("pupil-right");

const eyelidL = document.getElementById("eyelid-left");
const eyelidR = document.getElementById("eyelid-right");

let mouseX = 0, mouseY = 0;
let t = 0;
let blinkTimer = 0;
let isBlinking = false;
let mouseInsideForm = false;

/* DETECT IF MOUSE IS INSIDE THE CONTACT FORM */
const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("mouseenter", () => { mouseInsideForm = true; });
  form.addEventListener("mouseleave", () => { mouseInsideForm = false; });
}

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function blink() {
  if (isBlinking) return;

  isBlinking = true;
  eyelidL.setAttribute("height", 12);
  eyelidR.setAttribute("height", 12);

  setTimeout(() => {
    eyelidL.setAttribute("height", 0);
    eyelidR.setAttribute("height", 0);
    isBlinking = false;
  }, 150);
}

function animateCat() {
  t += 0.05;
  blinkTimer++;

  /* HEAD CENTER */
  const r = head.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  const dx = mouseX - cx;
  const dy = mouseY - cy;
  const distToHead = Math.hypot(dx, dy);

  /* HEAD TILT */
  const maxTiltX = 20;
  const maxTiltY_up = -5;
  const maxTiltY_down = 10;

  const tiltX = Math.max(-maxTiltX, Math.min(maxTiltX, dx * 0.08));

  let tiltY = dy * 0.10;
  if (tiltY < maxTiltY_up) tiltY = maxTiltY_up;
  if (tiltY > maxTiltY_down) tiltY = maxTiltY_down;

  head.setAttribute(
    "transform",
    `translate(60,40) rotate(${tiltX}) translate(0,${tiltY})`
  );

  /* EYE TRACKING WITH LIMITS */
  const dist = distToHead || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const limitX = 3.5;
  const limitY_up = 3.5;
  const limitY_down = 2;

  let px = ux * limitX;
  let py = uy * limitY_up;

  if (py > limitY_down) py = limitY_down;

  pupilL.setAttribute("x", -8 + px);
  pupilL.setAttribute("y", -2 + py);
  pupilR.setAttribute("x", 6 + px);
  pupilR.setAttribute("y", -2 + py);

  /* ----------------------------------------------- */
  /* NEW: SQUINT WHEN MOUSE IS INSIDE CONTACT FORM   */
  /* ----------------------------------------------- */

  if (mouseInsideForm && !isBlinking) {
    eyelidL.setAttribute("height", 6);
    eyelidR.setAttribute("height", 6);
  } else if (!isBlinking) {
    eyelidL.setAttribute("height", 0);
    eyelidR.setAttribute("height", 0);
  }

  /* BLINK – only when not squinting */
  if (!mouseInsideForm && !isBlinking) {
    if (blinkTimer > 180 + Math.random() * 120) {
      blink();
      blinkTimer = 0;
    }
  }

  /* BREATHING */
  body.setAttribute("transform", `translate(0, ${Math.sin(t) * 1.2})`);

  /* PAWS */
  const paw = Math.sin(t * 2) * 0.3;
  pawL.setAttribute("transform", `translate(0,${paw})`);
  pawR.setAttribute("transform", `translate(0,${paw})`);

  /* TAIL */
  const wag = Math.sin(t * 2) * 5;
  tail.setAttribute("transform", `rotate(${wag} 80 75)`);

  requestAnimationFrame(animateCat);
}
