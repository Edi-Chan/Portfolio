let tool = "none";
let drawing = false;
let draggingText = null;

let startX = 0;
let startY = 0;

let texts = [];
let shapes = [];
let penLines = [];

let history = [];
let redoStack = [];

const viewer = document.getElementById("viewer");

let canvas, ctx;

/* ===========================================
   INITIALISIERUNG
=========================================== */

viewer.addEventListener("load", () => {
    const doc = viewer.contentDocument;

    canvas = doc.createElement("canvas");
    canvas.id = "drawInside";
    doc.body.appendChild(canvas);

    ctx = canvas.getContext("2d");

    updateCanvasSize(doc);

    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "999999";

    setupEvents(doc);
    applyPointerMode();
    saveState();

    viewer.contentWindow.addEventListener("resize", () => {
        updateCanvasSize(doc);
        renderAll();
    });

    viewer.contentWindow.addEventListener("scroll", () => {
        renderAll();
    });
});

/* ===========================================
   CANVAS SIZE FIX
=========================================== */

function updateCanvasSize(doc) {
    canvas.width = doc.documentElement.scrollWidth;
    canvas.height = doc.documentElement.scrollHeight;
}

/* ===========================================
   KOORDINATEN FIX (richtige Position im IFRAME!)
=========================================== */

function getCoords(e) {
    const iframeRect = viewer.getBoundingClientRect();
    const win = viewer.contentWindow;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    // Koordinaten IM IFRAME
    const x = (clientX - iframeRect.left) + win.scrollX;
    const y = (clientY - iframeRect.top) + win.scrollY;

    return { x, y };
}

/* ===========================================
   UNDO / REDO
=========================================== */

function saveState() {
    redoStack = [];
    history.push(JSON.stringify({ texts, shapes, penLines }));
}

function restoreState(state) {
    const parsed = JSON.parse(state);
    texts = parsed.texts;
    shapes = parsed.shapes;
    penLines = parsed.penLines;
    renderAll();
}

document.getElementById("btn-undo").onclick = () => {
    if (history.length <= 1) return;
    redoStack.push(history.pop());
    restoreState(history[history.length - 1]);
};

document.getElementById("btn-redo").onclick = () => {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    history.push(next);
    restoreState(next);
};

/* ===========================================
   TOOLBAR
=========================================== */

document.querySelectorAll(".tool-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool-btn")
            .forEach(b => b.classList.remove("active"));

        tool = btn.dataset.tool;
        btn.classList.add("active");

        applyPointerMode();
    });
});

function applyPointerMode() {
    canvas.style.pointerEvents = "auto";
}

/* ===========================================
   RENDER ENGINE
=========================================== */

function renderAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    penLines.forEach(line => {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        line.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
    });

    shapes.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;

        if (s.type === "line") {
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
        }

        if (s.type === "rect") {
            ctx.strokeRect(s.x, s.y, s.w, s.h);
        }
    });

    texts.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.font = `${t.size}px Inter`;
        ctx.fillText(t.value, t.x, t.y);
    });
}

/* ===========================================
   TEXT
=========================================== */

function getTextAtPos(x, y) {
    return texts.find(t => {
        ctx.font = `${t.size}px Inter`;
        const w = ctx.measureText(t.value).width;
        return x >= t.x && x <= t.x + w && y <= t.y && y >= t.y - t.size;
    });
}

function spawnTextInput(doc, x, y) {
    const input = doc.createElement("input");
    input.type = "text";
    input.placeholder = "Text…";

    input.style.position = "absolute";
    input.style.top = y + "px";
    input.style.left = x + "px";
    input.style.zIndex = "100000";

    doc.body.appendChild(input);
    input.focus();

    input.addEventListener("keydown", ev => {
        if (ev.key === "Enter") {
            texts.push({
                x, y,
                value: input.value,
                color: colorPicker.value,
                size: 20
            });
            input.remove();
            renderAll();
            saveState();
        }
        if (ev.key === "Escape") input.remove();
    });
}

/* ===========================================
   EVENTS (Maus + Touch)
=========================================== */

function setupEvents(doc) {

    function start(e) {
        const { x, y } = getCoords(e);

        if (tool === "text") {
            spawnTextInput(doc, x, y);
            tool = "none";
            return;
        }

        if (tool === "pen") {
            drawing = true;
            penLines.push({
                type: "pen",
                color: colorPicker.value,
                size: sizePicker.value,
                points: [{ x, y }]
            });
            return;
        }

        if (tool === "line" || tool === "rect") {
            startX = x;
            startY = y;
            drawing = true;
            return;
        }

        const clicked = getTextAtPos(x, y);
        if (clicked) draggingText = clicked;
    }

    function move(e) {
        const { x, y } = getCoords(e);

        if (drawing && tool === "pen") {
            penLines[penLines.length - 1].points.push({ x, y });
            renderAll();
        }

        if (draggingText) {
            draggingText.x = x;
            draggingText.y = y;
            renderAll();
        }

        if (drawing && tool === "line") {
            renderAll();
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = sizePicker.value;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        if (drawing && tool === "rect") {
            renderAll();
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = sizePicker.value;
            ctx.strokeRect(startX, startY, x - startX, y - startY);
        }
    }

    function end(e) {
        const { x, y } = getCoords(e);

        if (drawing && tool === "line") {
            shapes.push({
                type: "line",
                x1: startX,
                y1: startY,
                x2: x,
                y2: y,
                color: colorPicker.value,
                size: sizePicker.value
            });
            saveState();
        }

        if (drawing && tool === "rect") {
            shapes.push({
                type: "rect",
                x: startX,
                y: startY,
                w: x - startX,
                h: y - startY,
                color: colorPicker.value,
                size: sizePicker.value
            });
            saveState();
        }

        drawing = false;
        draggingText = null;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);

    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("touchmove", move);
    canvas.addEventListener("touchend", end);
}

/* ===========================================
   CLEAR
=========================================== */

document.getElementById("btn-clear").onclick = () => {
    saveState();
    texts = [];
    shapes = [];
    penLines = [];
    renderAll();
    saveState();
};
