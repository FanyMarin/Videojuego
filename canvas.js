let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let frames = 0;
let gravity = 0.1;
let platforms1 = [];
let platforms2 = [];
let platforms3 = [];
let tears = [];
let points = 0;
let requestId;
let audio = new Audio();
audio.src = "./Music/Battle-music.mp3";
audio.loop = true;
const button = document.getElementById("start-button");

//Para hacer el ancho y la altura del canvas igual al tama;o de la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Construyendo el escenario
class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./Images/movieBackground.png";
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

//Construyendo al personaje
class Pikachu {
  constructor(x, y, width, height) {
    this.image = new Image();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = 0;
    this.sy = 0;
    this.sw;
    this.sh;

    //gravity
    this.dy = 5;
  }
  draw() {
    if (this.y > 0 && this.y + this.height < canvas.height) {
      this.y += this.dy + gravity;
    } else {
      gameOver();
    }
    if (this.sx > 240) this.sx = 0;
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (frames % 4 === 0) this.sx += 62.5;
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width - this.width * 0.5 > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }
}

//Construyendo las plataformas
class Platform {
  constructor(x, width) {
    this.x = x;
    this.y = canvas.height;
    this.width = width;
    this.height = 30;
    this.image = new Image();
    this.image.src = "./Images/platform.jpeg";
  }

  draw() {
    this.y -= 3;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class StartPlatform {
  constructor() {
    this.x = canvas.width / 2 - canvas.width * 0.1;
    this.y = canvas.height / 1.05;
    this.width = canvas.width * 0.15;
    this.height = 30;
    this.image = new Image();
    this.image.src = "./Images/platform.jpeg";
  }

  draw() {
    this.y -= 3;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (pikachu.collision(startPlatform)) {
      pikachu.y = startPlatform.y - pikachu.height;
    } else {
      pikachu.y = pikachu.y + 2;
    }
  }
}

class Tears {
  constructor(x, y) {
    this.x = x;
    this.y = canvas.height;
    this.width = 25;
    this.height = 25;
    this.image = new Image();
    this.image.src = "./Images/pokemonTear.png";
  }

  draw() {
    this.y -= 3;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

let startPlatform = new StartPlatform();
let pikachu = new Pikachu(
  canvas.width / 2 - (canvas.width * 0.1) / 2,
  canvas.height / 1.05 - 50,
  60,
  50
);
let backround = new Background();

//HELPER FUNCTIONS

//Generate & draw tears
function generateTears() {
  if (!(frames % 240 === 0)) return;
  const x = Math.floor(Math.random() * canvas.width) - 25;
  const tear = new Tears(x);
  tears = [...tears, tear];
}

function drawTears() {
  tears.forEach((tear, index) => {
    if (tear.y < -25) {
      return tears.splice(index, 1);
    }
    tear.draw();
    if (pikachu.collision(tear)) {
      points += 1;
      tear.x = -25;
    }
    if (points == 2) {
      won();
    }
  });
}

//Generate & draw platforms

function generatePlatforms1() {
  if (!(frames % 70 === 0)) return;
  const x = Math.floor(Math.random() * (canvas.width / 5));
  const width1 = canvas.width * 0.15;
  const platform1 = new Platform(x, width1);
  platforms1 = [...platforms1, platform1];
}

function generatePlatforms2() {
  if (!(frames % 100 === 0)) return;
  const x2 =
    canvas.width / 5 + 200 + Math.floor(Math.random() * (canvas.width / 8));
  const width2 = canvas.width * 0.15;
  const platform2 = new Platform(x2, width2);
  platforms2 = [...platforms2, platform2];
}

function generatePlatforms3() {
  if (!(frames % 70 === 0)) return;
  const x3 =
    canvas.width / 1.5 + Math.floor(Math.random() * (canvas.width / 5));
  const width3 = canvas.width * 0.15;
  const platform3 = new Platform(x3, width3);
  platforms3 = [...platforms3, platform3];
}

function drawPlatforms() {
  platforms1.forEach((platform, index) => {
    if (platform.y < -30) {
      return platforms1.splice(index, 1);
    }
    platform.draw();
    if (pikachu.collision(platform)) {
      pikachu.y = platform.y - pikachu.height;
    } else {
      pikachu.y = pikachu.y + 2;
    }
  });
}

function drawPlatforms2() {
  platforms2.forEach((platform, index) => {
    if (platform.y < -30) {
      return platforms2.splice(index, 1);
    }
    platform.draw();
    if (pikachu.collision(platform)) {
      pikachu.y = platform.y - pikachu.height;
    }
  });
}

function drawPlatforms3() {
  platforms3.forEach((platform, index) => {
    if (platform.y < -30) {
      return platforms3.splice(index, 1);
    }
    platform.draw();
    if (pikachu.collision(platform)) {
      pikachu.y = platform.y - pikachu.height;
    }
  });
}

//Cuando se pierde el juego:

function gameOver() {
  audio.pause();
  button.disabled = false;
  // button.onclick = restart;
  requestId = undefined;
  ctx.font = "100px Avenir";
  ctx.fillText("Game Over", canvas.width / 2 - 250, canvas.height / 2);
}

function won() {
  audio.pause();
  button.disabled = false;
  // button.onclick = restart;
  requestId = undefined;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "100px Avenir";
  ctx.fillText("You Won!", canvas.width / 2 - 250, canvas.height / 2);
}

//To start the game
function animate() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  generatePlatforms1();
  generatePlatforms2();
  generatePlatforms3();
  generateTears();
  backround.draw();
  startPlatform.draw();
  pikachu.draw();
  controllerGame();
  drawPlatforms();
  drawPlatforms2();
  drawPlatforms3();
  drawTears();

  ctx.font = "40px Avenir";
  ctx.fillStyle = "white";
  ctx.fillText("Score:", canvas.width - 220, 100);
  ctx.fillText(points, canvas.width - 100, 100);
  if (!requestId) gameOver();
  if (requestId) {
    requestId = requestAnimationFrame(animate);
  }
}

//Event listener
controller = {
  up: false,
  left: false,
  right: false,
  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;
    switch (event.keyCode) {
      case 37: // left key
        controller.left = key_state;
        break;
      case 39: // right key
        controller.right = key_state;
        break;
      case 38: // up key
        controller.up = key_state;
        break;
    }
  }
};

function controllerGame() {
  if (controller.left && pikachu.x > 0 + 30) {
    pikachu.image.src = "./Images/pikachuLeft.png";
    pikachu.sw = 62.5;
    pikachu.sh = 40;
    pikachu.x -= pikachu.width / 7;
  }

  if (controller.right && pikachu.x < canvas.width - 100) {
    pikachu.image.src = "./Images/pikachuRight.png";
    pikachu.sw = 62.5;
    pikachu.sh = 40;
    pikachu.x += pikachu.width / 7;
  }

  if (!controller.left && !controller.right) {
    pikachu.image.src = "./Images/pikachuFront.png";
    pikachu.sw = 62.5;
    pikachu.sh = 46;
  }

  if (controller.up) {
    pikachu.image.src = "./Images/pikachuFront.png";
    pikachu.sw = 62.5;
    pikachu.sh = 46;
    pikachu.y -= pikachu.height * 2;
    controller.up = false;
  }
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    button.disabled = true;
    audio.play();
    requestId = requestAnimationFrame(animate);
  }
};

//Falta:
//No funciona la funcion gameOver, por que?
//como hacer para que pikachu no pueda seguir saltando?
