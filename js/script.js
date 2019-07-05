const SPEED = 2;
const NUM_OF_BALLS = 50;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 800;

let canvas = document.createElement('canvas');
document.body.appendChild(canvas);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundColor = 'black';
canvas.style.margin = '0px auto';
canvas.style.display = 'block';
canvas.style.border = '1px solid black'
let ctx = canvas.getContext("2d");

/**
 * [generates Random Number]
 * @param  {Number} min minimum Number
 * @param  {Number} max Maximum Number
 * @return {Number}     Random Number
 */
let generateRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Generaters Random color
 * @return {rgb(Number,Number,Number)} Random RGB value
 */
let generateRandomColor = () => {
  var red = generateRandomNumber(0, 255);
  var blue = generateRandomNumber(0, 255);
  var green = generateRandomNumber(0, 255);

  return `rgb(${red},${green},${blue})`
}

/**
 * Ball Class
 */
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = Math.random() < 0.5 ? -1 : 1;
    this.dy = Math.random() < 0.5 ? -1 : 1;
    this.radius = generateRandomNumber(5, 15);
    this.color = generateRandomColor();
    this.mass = this.radius;
  }

  /**
   * Draws the ball
   */
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  /**
   * Updates the poisition of the ball on each frame
   */
  update() {
    this.x = this.x + this.dx * SPEED;
    this.y = this.y + this.dy * SPEED;

    if (this.x + this.radius >= CANVAS_WIDTH || this.x - this.radius <= 0) {
      this.dx *= -1;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= CANVAS_HEIGHT) {
      this.dy *= -1;
    }
  }
}

/**
 * Angle of the ball after collision
 * @param  {Object} velocity Object contains direction of ball in x and y key
 * @param  {Number} angle    Angle in radian
 * @return {Object}          RotatedVelocities
 */
let rotate = (velocity, angle) => {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

/**
 * Resolves Collision between two ballList
 * @param  {Object} ballA current Ball
 * @param  {Object} ballB Other ball
 */
let resolveCollision = (ballA, ballB) => {
  let dxDiff = ballA.dx - ballB.dx;
  let dyDiff = ballA.dy - ballB.dy;


  let xDist = ballB.x - ballA.x;
  let yDist = ballB.y - ballA.y;

  if (dxDiff * xDist + dyDiff * yDist >= 0) {
    const angle = -Math.atan2(yDist, xDist);

    let m1 = ballA.mass;
    let m2 = ballB.mass;

    let u1 = rotate({
      x: ballA.dx,
      y: ballA.dy
    }, angle);
    let u2 = rotate({
      x: ballB.dx,
      y: ballB.dy
    }, angle);

    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y
    };

    let vf1 = rotate(v1, -angle);
    let vf2 = rotate(v2, -angle);

    ballA.dx = vf1.x;
    ballA.dy = vf1.y;

    ballB.dx = vf2.x;
    ballB.dy = vf2.y;
  }
}

/**
 * Detectes the Collision and resolves
 * @param  {Object} ball Current ballList
 */
let collisionDetection = (ball) => {
  for (eachBallFromList in ballList) {
    var dx = ball.x - ballList[eachBallFromList].x;
    var dy = ball.y - ballList[eachBallFromList].y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + ballList[eachBallFromList].radius) {
      // console.log('collision');
      resolveCollision(ball, ballList[eachBallFromList]);
    }
  }
}

/**
 * Checks if the balls are colliding
 * @param  {Object}  ball Current ball
 * @return {Boolean}      Returns true if ball is coliding else returns false
 */
let isColliding = (ball) => {
  for (eachBallFromBallList in ballList) {
    var dx = ball.x - ballList[eachBallFromBallList].x;
    var dy = ball.y - ballList[eachBallFromBallList].y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + ballList[eachBallFromBallList].radius) {
      
      return true;
    }
  }

  return false;
}

/**
 * Animates all the ball
 */
let animate = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ballList.forEach((ball) => {
    ball.draw();
    ball.update();
    collisionDetection(ball);
  });
}


let ballList = [];

/**
 * Initiliaze the simulation
 */
let init = () => {
  for (var ballNumber = 0; ballNumber < NUM_OF_BALLS; ballNumber++) {

    do {
      var ball = new Ball(generateRandomNumber(50, CANVAS_WIDTH - 50), generateRandomNumber(50, CANVAS_WIDTH - 50));
    } while (isColliding(ball));

    ballList.push(ball);
  }
}

setInterval(animate, 1000 / 60);

init();
