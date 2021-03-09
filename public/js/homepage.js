const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//3D

const imageW = 100;
const imageH = 100;

let circleArray = [];

class Circle {
  constructor() {
    this.width = imageW;
    this.height = imageH;
    this.x = Math.random() * (innerWidth - this.width * 2);
    this.y = Math.random() * (innerHeight - this.height * 2);
    this.radius = Math.random() * 5 + 2;
    this.dx = (Math.random() - 0.5) * 4 + 1;
    this.dy = (Math.random() - 0.5) * 4 + 1;
    this.color = `rgb(${getRandomNum(0, 255)}, ${getRandomNum(
      0,
      255
    )}, ${getRandomNum(0, 255)})`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }

  update() {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.radius > canvas.width || this.x < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y < 0) {
      this.dy = -this.dy;
    }
  }
}

function init() {
  circleArray = [];

  for (let i = 0; i < 50; i++) {
    circleArray.push(new Circle());
  }

  if (innerWidth > 900) {
    init2();
    boxDisplay("block");
  } else {
    boxDisplay("none");
  }
}

function boxDisplay(display) {
  document.querySelectorAll(".wrap").forEach((wrap) => {
    wrap.style.display = display;
  });
}

function connect(circleArray, distant) {
  let opacity = 1;
  circleArray.forEach((circle1) => {
    circleArray.forEach((circle2) => {
      if (circle1.x === circle2.x && circle1.y === circle2.y) return;

      const dx = circle1.x - circle2.x;
      const dy = circle1.y - circle2.y;
      const dist = Math.hypot(dx, dy);

      if (dist < distant) {
        ctx.beginPath();
        ctx.lineWidth = 1 - dist / 100;
        ctx.moveTo(circle1.x, circle1.y);
        ctx.lineTo(circle2.x, circle2.y);
        ctx.strokeStyle = "#9b5de5";

        ctx.stroke();
        ctx.closePath();

        opacity = 1 - dist / 60;
      }
    });
  });
}

let imageEntityArray = [];

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class ImageEntity {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.dx = Math.random() - 0.5 * 1.5;
    this.dy = Math.random() - 0.5 * 1.5;
  }

  draw() {}
}

const cubicNum = document.querySelectorAll(".cube").length;

function init2() {
  imageEntityArray = [];
  let protection = 10000;
  let counter = 0;
  let overlapping = false;

  while (imageEntityArray.length < cubicNum && counter < protection) {
    const cubicW = getRandomNum(100, 140);
    const cubic = {
      width: cubicW,
      x: getRandomNum(30, innerWidth - cubicW),
      y: getRandomNum(30, innerHeight - cubicW),
    };

    overlapping = false;

    for (let i = 0; i < imageEntityArray.length; i++) {
      const previousCubic = imageEntityArray[i];
      if (
        previousCubic &&
        cubic.x + cubic.width > previousCubic.x &&
        cubic.x < previousCubic.x + previousCubic.width &&
        cubic.y + cubic.width > previousCubic.y &&
        cubic.y < previousCubic.y + previousCubic.width
      ) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      imageEntityArray.push(new ImageEntity(cubic.x, cubic.y, cubic.width));
    }

    counter++;
  }
}

function handleImgRotation(index, img, cube) {
  if (index === 0)
    img.style.transform = `rotateY(0deg) translateZ(${cube.width / 2}px)`;
  if (index === 1)
    img.style.transform = `rotateY(90deg) translateZ(${cube.width / 2}px)`;
  if (index === 2)
    img.style.transform = `rotateY(180deg) translateZ(${cube.width / 2}px)`;
  if (index === 3)
    img.style.transform = `rotateY(-90deg) translateZ(${cube.width / 2}px)`;
  if (index === 4)
    img.style.transform = `rotateX(90deg) translateZ(${cube.width / 2}px)`;
  if (index === 5)
    img.style.transform = `rotateX(-90deg) translateZ(${cube.width / 2}px)`;
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  connect(imageEntityArray, 400);
  connect(circleArray, 80);

  circleArray.forEach((circle) => {
    circle.update();
  });

  imageEntityArray.forEach((cube, index) => {
    imageEntityArray.forEach((cube2, index2) => {
      cube.x += cube.dx;
      cube.y += cube.dy;

      // Collision between cubes
      if (
        cube.x + cube.width > cube2.x &&
        cube.x < cube2.x + cube2.width &&
        cube.y + cube.width > cube2.y &&
        cube.y < cube2.y + cube2.width &&
        // avoid comparing to itself
        cube.x !== cube2.x &&
        cube.y !== cube2.y
      ) {
        cube.dx *= -1;
        cube.dy *= -1;
      }

      // movement of cubes
      const cubeEntity = document.querySelector(`.cube${index}`);
      const cubeImges = document.querySelectorAll(`.cube${index} img`);

      cubeEntity.style.cssText = `left:${cube.x}px; top:${cube.y}px; width:${cube.width}px; height:${cube.width}px`;

      cubeImges.forEach((img, index) => {
        img.style.cssText = `width:${cube.width}px; height:${cube.width}px`;

        handleImgRotation(index, img, cube);
      });

      // wall collisions
      if (cube.x + cube.width + cube.width / 2 > innerWidth || cube.x <= 50) {
        cube.dx = -cube.dx;
      }
      if (cube.y + cube.width + cube.width / 2 > innerHeight || cube.y <= 50) {
        cube.dy = -cube.dy;
      }
    });
  });
}
init();
animate();

addEventListener("resize", (e) => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});
