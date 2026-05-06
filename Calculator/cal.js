// ── State ─────────────────────────────────────────────────
let buffer      = "0";     // what's currently being typed
let runningTotal = 0;      // accumulated result
let prevOp      = null;    // last operator pressed
let justEvaled  = false;   // true right after = is pressed

// ── DOM ───────────────────────────────────────────────────
const display  = document.getElementById("display");
const exprLine = document.getElementById("expr");

// ── Render ────────────────────────────────────────────────
function render() {
  // auto-shrink font for long numbers
  display.classList.remove("small", "xsmall");
  if (buffer.length > 12) display.classList.add("xsmall");
  else if (buffer.length > 8) display.classList.add("small");

  display.innerText = buffer;
}

// ── Digit handler ─────────────────────────────────────────
function handleDigit(val) {
  // after = is pressed, start fresh
  if (justEvaled) {
    buffer = val;
    justEvaled = false;
    return;
  }
  // only one decimal point
  if (val === "." && buffer.includes(".")) return;

  if (buffer === "0" && val !== ".") {
    buffer = val;
  } else {
    buffer += val;
  }
}

// ── Operator handler ──────────────────────────────────────
function handleOp(op) {
  // highlight the active op button
  document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
  const opMap = { "/": "÷", "×": "×", "-": "−", "+": "+" };
  document.querySelectorAll(".btn-op").forEach(b => {
    if (b.dataset.val === op) b.classList.add("active");
  });

  const num = parseFloat(buffer);

  if (prevOp === null || justEvaled) {
    runningTotal = num;
  } else {
    flush(num);
  }

  prevOp     = op;
  buffer     = "0";
  justEvaled = false;

  exprLine.textContent = `${runningTotal} ${op === "×" ? "×" : op === "/" ? "÷" : op}`;
}

// ── Flush (apply prevOp) ──────────────────────────────────
function flush(num) {
  switch (prevOp) {
    case "+": runningTotal += num; break;
    case "-": runningTotal -= num; break;
    case "/": runningTotal  = num !== 0 ? runningTotal / num : "Error"; break;
    case "×": runningTotal *= num; break;
  }
}

// ── Special keys ──────────────────────────────────────────
function handleSpecial(val) {
  switch (val) {
    case "AC":
      buffer       = "0";
      prevOp       = null;
      runningTotal = 0;
      justEvaled   = false;
      exprLine.textContent = "";
      document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
      break;

    case "=":
      if (prevOp === null) return;
      flush(parseFloat(buffer));
      exprLine.textContent = `${buffer} ${prevOp === "×" ? "×" : prevOp === "/" ? "÷" : prevOp} ... = ${format(runningTotal)}`;
      prevOp     = null;
      buffer     = format(runningTotal);
      justEvaled = true;
      document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
      break;

    case "±":
      if (buffer !== "0") {
        buffer = buffer.startsWith("-") ? buffer.slice(1) : "-" + buffer;
      }
      break;

    case "%":
      buffer = String(parseFloat(buffer) / 100);
      break;
  }
}

// ── Format result (avoid ugly floating point) ─────────────
function format(num) {
  if (num === "Error") return "Error";
  // round to 10 sig figs to kill floating point noise
  const rounded = parseFloat(num.toPrecision(10));
  // if it's an integer, show without decimal
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

// ── Main dispatcher ───────────────────────────────────────
function buttonClick(val) {
  if (val === "AC" || val === "=" || val === "±" || val === "%") {
    handleSpecial(val);
  } else if (["+", "-", "×", "/"].includes(val)) {
    handleOp(val);
  } else {
    handleDigit(val);
  }
  render();
}

// ── Physical press animation ──────────────────────────────
function pressAnim(btn) {
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
}

// ── Button click events ───────────────────────────────────
document.querySelector(".calButtons").addEventListener("click", function(e) {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  pressAnim(btn);
  buttonClick(btn.dataset.val);
});

// ── Keyboard support ─────────────────────────────────────
document.addEventListener("keydown", function(e) {
  const keyMap = {
    "0":"0","1":"1","2":"2","3":"3","4":"4",
    "5":"5","6":"6","7":"7","8":"8","9":"9",
    ".":".","Enter":"=","=":"=","Escape":"AC",
    "Backspace":"AC","+":"+","-":"-","*":"×","/":"/"
  };
  const val = keyMap[e.key];
  if (!val) return;
  e.preventDefault();

  // animate matching button
  document.querySelectorAll(".btn").forEach(btn => {
    if (btn.dataset.val === val) pressAnim(btn);
  });

  buttonClick(val);
});

// ── Init ─────────────────────────────────────────────────
render();
