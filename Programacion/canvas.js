let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let frames = 0;
let gravity = 0.1;
let platforms = [];
let timerId;
let audio = new Audio();
audio.src =
  "https://www.youtube.com/watch?v=wR3gaYTqkDQ&list=RDwR3gaYTqkDQ&start_radio=1";
audio.loop = true;
// let jumping = true;

//Para hacer el ancho y la altura del canvas igual al tama;o de la pantalla
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

//para hacer la animacion de pikachu
let sprites = {
  running: {
    src: "./Images/pikachuCorriendoSprite.png",
    width: 439,
    height: 321
  },

  runningBackwards: {
    src: "./Programacion/Images/pikachuCorriendoIzq.png",
    width: 439,
    height: 321
  },

  standing: {
    src: "./Programacion/Images/pikachuStanding2.png",
    width: 177,
    height: 222
  }
};

//Construyendo el escenario
class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./Images/VioletSky.png";
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

//Construyendo al personaje
class Pikachu {
  constructor(x, y, width, height) {
    this.image = new Image();
    this.image.src = sprites.running.src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sx = 0;
    this.sy = 0;
    this.sw = sprites.running.width;
    this.sh = sprites.running.height;
    //gravity
    this.dy = 2;
    this.jumping = false;
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

  moveLeft() {}

  moveRight() {}

  jump() {}

  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }
}

class Platform {
  constructor(x, width) {
    this.x = x;
    this.y = canvas.height;
    this.width = width;
    this.height = 30;
  }

  draw() {
    this.y -= 3;
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
}

let pikachu = new Pikachu(90, 100, 100, 100);
let backround = new Background();
//let platform = new Platform(200,200);

//HELPER FUNCTIONS
function generatePlatforms() {
  if (!(frames % 120 === 0)) return;

  const width = Math.floor(Math.random() * (canvas.width * 0.2)) + 100;
  const x = Math.floor(Math.random() * canvas.width) - 100;
  const platform1 = new Platform(0, width);
  const platform2 = new Platform(canvas.width, -width);
  const platform3 = new Platform(x, width);
  platforms = [...platforms, platform1, platform2, platform3];

  //  if(frames%39===0){
  //    return platforms = platform1;
  //  } else if(frames%79===0){
  //    return platforms = platform2;
  //  } else if(frames%120 === 0){
  //    return platforms = platform
  //  }
}

function drawPlatforms() {
  platforms.forEach(platform => {
    platform.draw();

    if (pikachu.collision(platform)) {
      pikachu.y = platform.y - 100;
    }
  });
}

function animate() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  generatePlatforms();
  backround.draw();
  pikachu.draw();
  controllerGame();
  drawPlatforms();
  console.log(platforms);

  if (timerId) {
    timerId = requestAnimationFrame(animate);
  }
}

//Event listener
controller = {
  left: false,
  right: false,
  up: false,
  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 37: // left key
        controller.left = key_state;
        break;
      case 38: // up key
        controller.up = key_state;
        break;
      case 39: // right key
        controller.right = key_state;
        break;
    }
  }
};

function controllerGame() {
  if (
    controller.up /*&& pikachu.jumping == false*/ &&
    pikachu.x > 0 + 30 &&
    pikachu.collision(platform) == true
  ) {
    pikachu.y -= pikachu.height / 4;
    // pikachu.jumping = true;
  }

  if (controller.left && pikachu.x > 0 + 30) {
    pikachu.x -= pikachu.width / 4;
  }

  if (controller.right && pikachu.x < canvas.width - 100) {
    pikachu.x += pikachu.width / 4;
  }
}

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    // controllerGame()
    timerId = requestAnimationFrame(animate);
  }
};

//Falta:
// Arreglar que salga una sola plataforma a la vez
// Cambiar de direccion a pikachu cuando se usen difentes comandos (usar un sprite por comando)
// Que cuando no este sobre una plataforma, pikachu no pueda subir de forma random
