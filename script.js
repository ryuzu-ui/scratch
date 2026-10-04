const canvas = document.getElementById("scratchCanvas");
const card = document.querySelector(".scratch-card");
const image = document.querySelector(".prize-image");

const ctx = canvas.getContext("2d", {
  willReadFrequently: true
});


let scratching = false;

let lastX = null;
let lastY = null;


/* =========================================
   CREATE SCRATCH SURFACE
   ========================================= */

function setupCanvas() {

  const rect = card.getBoundingClientRect();

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );


  canvas.width =
    Math.round(rect.width * dpr);

  canvas.height =
    Math.round(rect.height * dpr);


  canvas.style.width =
    `${rect.width}px`;

  canvas.style.height =
    `${rect.height}px`;


  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  /*
   * NEO-BRUTALIST YELLOW
   * SCRATCH COATING
   */

  ctx.globalCompositeOperation =
    "source-over";

  ctx.globalAlpha = 1;


  ctx.fillStyle = "#b6b6b6";

  ctx.fillRect(
    0,
    0,
    rect.width,
    rect.height
  );


  /*
   * BIG YELLOW BLOCKS
   */

  ctx.globalAlpha = 0.25;

  ctx.fillStyle = "#ffd21c";


  for (
    let x = 0;
    x < rect.width;
    x += 30
  ) {

    for (
      let y = 0;
      y < rect.height;
      y += 30
    ) {

      ctx.fillRect(
        x,
        y,
        15,
        15
      );

    }
  }


  /*
   * DIAGONAL TEXTURE
   */

  ctx.globalAlpha = 0.15;

  ctx.strokeStyle = "#ffffff";

  ctx.lineWidth = 3;


  for (
    let x = -rect.height;
    x < rect.width + rect.height;
    x += 18
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(
      x + rect.height,
      rect.height
    );

    ctx.stroke();

  }


  ctx.globalAlpha = 1;


  /*
   * SCRATCH TITLE
   */

  ctx.fillStyle = "#111111";

  ctx.font =
    "900 18px Arial";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";


  ctx.fillText(
    "SCRATCH",
    rect.width / 2,
    rect.height / 2
  );
}


/* =========================================
   GET MOUSE / TOUCH POSITION
   ========================================= */

function getPosition(event) {

  const rect =
    canvas.getBoundingClientRect();


  const point =
    event.touches
      ? event.touches[0]
      : event;


  return {

    x:
      point.clientX -
      rect.left,

    y:
      point.clientY -
      rect.top

  };
}


/* =========================================
   SCRATCH
   ========================================= */

function scratch(x, y) {

  const width =
    canvas.getBoundingClientRect().width;


  const radius =
    Math.max(
      24,
      width * 0.055
    );


  ctx.save();


  ctx.globalCompositeOperation =
    "destination-out";


  ctx.lineCap = "round";

  ctx.lineJoin = "round";

  ctx.lineWidth =
    radius * 2;


  /*
   * DRAW LINE
   */

  if (
    lastX !== null &&
    lastY !== null
  ) {

    ctx.beginPath();

    ctx.moveTo(
      lastX,
      lastY
    );

    ctx.lineTo(
      x,
      y
    );

    ctx.stroke();

  }


  /*
   * DRAW CIRCLE
   */

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.restore();


  lastX = x;
  lastY = y;
}


/* =========================================
   START
   ========================================= */

function startScratch(event) {

  event.preventDefault();

  scratching = true;

  lastX = null;
  lastY = null;


  const pos =
    getPosition(event);


  scratch(
    pos.x,
    pos.y
  );
}


/* =========================================
   MOVE
   ========================================= */

function moveScratch(event) {

  if (!scratching) {
    return;
  }


  event.preventDefault();


  const pos =
    getPosition(event);


  scratch(
    pos.x,
    pos.y
  );
}


/* =========================================
   STOP
   ========================================= */

function stopScratch() {

  if (!scratching) {
    return;
  }


  scratching = false;

  lastX = null;
  lastY = null;


  checkScratchProgress();
}


/* =========================================
   CHECK HOW MUCH WAS SCRATCHED
   ========================================= */

function checkScratchProgress() {

  const pixels =
    ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;


  let cleared = 0;

  let samples = 0;


  /*
   * Sample every 20 pixels
   * instead of checking every pixel.
   */

  for (
    let i = 3;
    i < pixels.length;
    i += 4 * 20
  ) {

    samples++;


    if (
      pixels[i] < 40
    ) {

      cleared++;

    }

  }


  const percentage =
    cleared / samples;


  /*
   * AUTOMATIC REVEAL
   */

  if (
    percentage > 0.58
  ) {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    card.classList.add(
      "scratched"
    );

  }

}


/* =========================================
   MOUSE
   ========================================= */

canvas.addEventListener(
  "mousedown",
  startScratch
);


canvas.addEventListener(
  "mousemove",
  moveScratch
);


window.addEventListener(
  "mouseup",
  stopScratch
);


/* =========================================
   TOUCH
   ========================================= */

canvas.addEventListener(
  "touchstart",
  startScratch,
  {
    passive: false
  }
);


canvas.addEventListener(
  "touchmove",
  moveScratch,
  {
    passive: false
  }
);


canvas.addEventListener(
  "touchend",
  stopScratch,
  {
    passive: false
  }
);


/* =========================================
   INITIALIZE
   ========================================= */

function initialize() {

  if (image.complete) {

    setupCanvas();

  } else {

    image.addEventListener(
      "load",
      setupCanvas,
      {
        once: true
      }
    );

  }
}


window.addEventListener(
  "resize",
  setupCanvas
);


initialize();