let tool = "none";
let drawing = false;
let startX = 0;
let startY = 0;

const viewer = document.getElementById("viewer");

let canvas, ctx;
let history = [];
let redoStack = [];

/* iframe geladen → Canvas INS iframe */
viewer.addEventListener("load", () => {
  const doc = viewer.contentDocument;

  canvas = doc.createElement("canvas");
  canvas.id = "drawInside";
  doc.body.appendChild(canvas);

  updateCanvasSize(doc);

  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "auto";
  canvas.style.zIndex = "99999";

  ctx = canvas.getContext("2d");

  setupDrawing(doc);

  saveState();
});

/* Größe an Inhalt anpassen */
function updateCanvasSize(doc) {
  const w = doc.documentElement.scrollWidth;
  const h = doc.documentElement.scrollHeight;
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
}

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

/* Werkzeugauswahl */
document.querySelectorAll(".tool-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    tool = btn.dataset.tool;
    btn.classList.add("active");
  });
});

/* Seite laden */
document.getElementById("btn-load").addEventListener("click", () => {
  let url = document.getElementById("urlInput").value.trim();
  viewer.src = url;
});

/* ZEICHNEN */
function setupDrawing(doc) {

  canvas.addEventListener("mousedown", e => {
    drawing = true;

    startX = e.pageX;
    startY = e.pageY;

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }

    if (tool === "text") {
      const txt = prompt("Text eingeben:");
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

    const x = e.pageX;
    const y = e.pageY;
    const color = colorPicker.value;
    const size = sizePicker.value;

    if (tool === "pen") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = size * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  });

  canvas.addEventListener("mouseup", e => {
    if (!drawing) return;

    const x = e.pageX;
    const y = e.pageY;
    const color = colorPicker.value;
    const size = sizePicker.value;

    if (tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (tool === "rect") {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
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
