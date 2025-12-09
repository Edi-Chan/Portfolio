let tool = "none";
let drawing = false;
let startX = 0;
let startY = 0;

const viewer = document.getElementById("viewer");

let canvas, ctx;
let history = [];
let redoStack = [];

/* iframe geladen → Canvas INS iframe einfügen */
viewer.addEventListener("load", () => {
  const doc = viewer.contentDocument;

  // Neues Canvas ins iframe bauen
  canvas = doc.createElement("canvas");
  canvas.id = "drawInside";
  doc.body.appendChild(canvas);

  // Canvas fullscreen machen
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = 99999;
  canvas.style.pointerEvents = "auto";

  // Context holen
  ctx = canvas.getContext("2d");

  resizeCanvas();
  setupDrawing();

  saveState();
});

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resizeCanvas);

/* Undo/Redo */
function saveState() {
  redoStack = [];
  history.push(canvas.toDataURL());
}

function restoreState(dataUrl) {
  let img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

/* Werkzeuge */
document.querySelectorAll(".tool-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    tool = btn.dataset.tool;
    btn.classList.add("active");
  });
});

/* Laden */
document.getElementById("btn-load").addEventListener("click", () => {
  let url = document.getElementById("urlInput").value.trim();
  viewer.src = url;
});

/* Zeichnen im iframe */
function setupDrawing() {

  canvas.addEventListener("mousedown", e => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }

    if (tool === "text") {
      let txt = prompt("Text eingeben:");
      if (txt) {
        ctx.fillStyle = colorPicker.value;
        ctx.font = "20px Arial";
        ctx.fillText(txt, startX, startY);
        saveState();
      }
      drawing = false;
    }
  });

  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;

    const color = colorPicker.value;
    const size = sizePicker.value;

    if (tool === "pen") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }

    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = size * 2;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });

  canvas.addEventListener("mouseup", e => {
    if (!drawing) return;

    const color = colorPicker.value;
    const size = sizePicker.value;

    if (tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }

    if (tool === "rect") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    }

    drawing = false;
    saveState();
  });
}

/* Buttons */
document.getElementById("btn-clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
});

document.getElementById("btn-undo").addEventListener("click", () => {
  if (history.length <= 1) return;
  redoStack.push(history.pop());
  restoreState(history[history.length - 1]);
});

document.getElementById("btn-redo").addEventListener("click", () => {
  if (redoStack.length === 0) return;
  let state = redoStack.pop();
  history.push(state);
  restoreState(state);
});
