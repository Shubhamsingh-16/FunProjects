let buffer = "0";
let prevopr = null;
let runningtotal = 0;
const screen = document.querySelector(".display");
function buttonClick(value) {
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleDigit(value);
  }
  console.log(value);
  render();
}

function handleDigit(value) {
  if (buffer === "0") {
    buffer = value;
  } else {
    buffer += value;
  }
}

function handlemath(value) {
  const intbuffer = parseInt(buffer);
  if (runningtotal === 0) {
    runningtotal = intbuffer;
  } else {
    flushopertion(intbuffer);
  }
  prevopr = value;
  buffer = "0";
}


function flushopertion(intbuffer) {
  if (prevopr === "+") {
    runningtotal += intbuffer;
  } else if (prevopr === "-") {
    runningtotal -= intbuffer;
  } else if (prevopr === "/") {
    runningtotal /= intbuffer;
  } else {
    runningtotal *= intbuffer;
  }
}

function handleSymbol(value) {
  switch (value) {
    case "AC":
      buffer = "0";
      prevopr = null;
      runningtotal = 0;
      break;
    case "=":
      if (prevopr === null) {
        return;
      }
      flushopertion(parseInt(buffer));
      prevopr = null;
      buffer = runningtotal;
      runningtotal = null;
      break;
    case "[x]":
      buffer = buffer.substring(0, buffer.length - 1);
      break;
    case "+":
    case "-":
    case "/":
    case "X":
      handlemath(value);
      break;
  }
}
function render() {
  screen.innerText = buffer;
}
function init() {
  document
    .querySelector(".calButtons")
    .addEventListener("click", function (event) {
      if (0 < event.target.innerText.length <= 3) {
        buttonClick(event.target.innerText);
      }
    });
}
init();
