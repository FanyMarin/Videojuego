let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let frames = 0;
let gravity = 0.1;
let platforms1 = [];
let platforms2 = [];
let platforms3 = [];
let requestId;
let audio = new Audio();
audio.src = "./Music/opening.mp3";
audio.loop = true;
const button = document.getElementById("start-button");
ctx.font = "30px Avenir";

//Para hacer el ancho y la altura del canvas igual al tama;o de la pantalla
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

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
    this.y += this.dy + gravity;
    if (this.sx > 1750) this.sx = 0;
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
    if (frames % 5 === 0) this.sx += 439;
  }

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width - this.width * 0.35 > item.x &&
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

let pikachu = new Pikachu(90, 100, 60, 50);
let backround = new Background();

//HELPER FUNCTIONS

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

//To start the game
function animate() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  generatePlatforms1();
  generatePlatforms2();
  generatePlatforms3();
  backround.draw();
  pikachu.draw();
  controllerGame();
  drawPlatforms();
  drawPlatforms2();
  drawPlatforms3();
  if (!requestId) gameOver();
  if (requestId) {
    requestId = requestAnimationFrame(animate);
  }
}

//Cuando se pierde el juego:
function gameOver() {
  if (pikachu.y == 0 || pikachu.y == canvas.height - pikachu.height) {
    audio.pause();
    button.disabled = false;
    button.onclick = restart;
    requestId = undefined;
    ctx.fillText("Game Over", canvas.width / 2 - 300, canvas.height / 2);
  }
}

//Event listener
controller = {
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
    }
  }
};

function controllerGame() {
  if (controller.left && pikachu.x > 0 + 30) {
    pikachu.image.src = "./Images/pikachuCorriendoIzq.png";
    pikachu.sw = 439;
    pikachu.sh = 321;
    pikachu.x -= pikachu.width / 4;
  }

  if (controller.right && pikachu.x < canvas.width - 100) {
    pikachu.image.src = "./Images/pikachuCorriendoSprite.png";
    pikachu.sw = 439;
    pikachu.sh = 321;
    pikachu.x += pikachu.width / 4;
  }

  if (!controller.left && !controller.right) {
    pikachu.image.src = "./Images/pikachuStanding.png";
    pikachu.sw = 244;
    pikachu.sh = 256;
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
