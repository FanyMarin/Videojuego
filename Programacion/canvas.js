let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let frames = 0;
let timerId;
let audio = new Audio();
audio.src =
  "https://www.youtube.com/watch?v=wR3gaYTqkDQ&list=RDwR3gaYTqkDQ&start_radio=1";
audio.loop = true;

//Para hacer el ancho y la altura del canvas igual al tama;o de la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//para hacer la animacion de pikachu
let sprites = {
  running: {
    src: "./Images/pikachuCorriendoSprite.png",
    width: 439,
    height: 321
  }
};

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
  }
  draw() {
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
}

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    //     this.image = new Image();
    //     this.image.src = "./Images/backround1.jpg"
    // }

    // draw(){
    //     ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    // }
  }
}

let pikachu = new Pikachu(90, 100, 100, 100);
let backround = new Background();

function animate() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // backround.draw();
  pikachu.draw();

  if (timerId) {
    timerId = requestAnimationFrame(animate);
  }

  // requestAnimationFrame(animate);
  // ctx.clearRect(0,0,canvas.width,canvas.height);
  // pikachu.draw();
}

//Event listener
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    addEventListener("keydown", event => {
      const keyLeft = 37;
      const keyRight = 39;
      const jump = 38;
      const down = 40;

      if (event.keyCode === keyLeft && pikachu.x > 0 + 30) {
        pikachu.x -= pikachu.width / 2;
      }

      if (event.keyCode === keyRight && pikachu.x < canvas.width - 100) {
        pikachu.x += pikachu.width / 2;
      }

      if (event.keyCode === jump && pikachu.y >= 0) {
        pikachu.y -= pikachu.height / 2;
      }

      if (event.keyCode === down && pikachu.y <= canvas.height -100) {
          pikachu.y += pikachu.height / 2;
      }
    });
    timerId = requestAnimationFrame(animate);
  }
};
