// || setup canvas and html variables

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.container');
const div = document.querySelector('div');
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

let height = canvas.height;
let width = canvas.height;

let retry = document.createElement('button');
retry.className = 'start';
retry.textContent = 'Retry?';
retry.addEventListener('click', retryGame);

// || Global variables __________________________________

let gridSectionWidth = width / 15;
let gridSectionHeight = height / 15;
let onGrid = false;
let onGridY = false;

let wPressed = false;
let sPressed = false;
let aPressed = false;
let dPressed = false;

let movUp = false;
let movDown = false;
let movLeft = false;
let movRight = false;

let tailExists = false;

let start = false;
let gameOver = false;

let tails = [];
let tl = tails.length;
let arrPosNo = 0;

let snakeArrX = [];
let snakeArrY = [];
let globalDirArr=[];

let newFoodX;
let newFoodY;

let score = 0;
let highScore = 0;

let secondsPassed;
let oldTimeStamp;
let fps;

// || Game Loop __________________________________________

function loop (timeStamp) {
    drawCanvas();

    snake.draw();
    snake.setControl();
    snake.checkBounds();
    snake.collisionDetect();

       
    for (i=0; i < tails.length; i++) {
        tails[i].draw();
        tails[i].move();
        tails[i].collision();
    }

    apple.drawFood();
   
    if (start) {
        requestAnimationFrame(loop);
    }

    if (gameOver) {
        div.appendChild(retry);
    }


    //number of s since last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // fps
    fps = Math.round(1 / secondsPassed);

    // get the snake moving at a good speed
    velocityMatch();

    // draw to screen
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("FPS: " + fps, 10, 30);
    ctx.fillText('Score: ' + score, 600, 30);
    ctx.fillText('High Score: ' + highScore, 720, 30);
}

// || Random number generator ______________________________________

function random (min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// || Snake constructor _________________________________________

class Snake {
    constructor(velX, velY,) {
        this.velX = velX;
        this.velY = velY;
        this.x = gridSectionWidth * 7;
        this.y = gridSectionHeight * 7;
        this.size = gridSectionWidth;
        this.color = 'orange';
    }
}

// || Draw method

Snake.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
}

// || Set control method

Snake.prototype.setControl = function() {
    let this_ = this;

    if ((this_.y + gridSectionHeight) % gridSectionHeight === 0) {
        onGridY = true;
    } else {onGridY = false;}

    if ((this_.x + gridSectionWidth) % gridSectionWidth === 0) {
        onGrid = true;
    } else {onGrid = false;}

    if (onGrid && onGridY && start) {
        this.addMovementPath();
        if (snakeArrX.length >= 2 && tails.length < 2) {
            anotherTail();
        }}
    
    window.addEventListener('click', function(e) { 
    if (e.target === upBtn && !movDown) {
        wPressed = true;
    } else if (e.target === downBtn && !movUp) {
        sPressed = true;
    } else if (e.target === leftBtn && !movRight) {
        aPressed = true;
    } else if (e.target === rightBtn && !movLeft) {
        dPressed = true;
    }})    

    window.onkeydown = function(e) {
            
        if (e.key === 'a' && !movRight) {
            aPressed = true;
        } else if (e.key === 'd' && !movLeft) {
            dPressed = true;
        } else if (e.key === 'w' && !movDown) {
            wPressed = true;
        } else if (e.key === 's' && !movUp) {
            sPressed = true;
        }
    }


    if (wPressed && onGrid) {
        wPressed = false;
        clearMov();
        movUp = true;
    } else if (sPressed && onGrid) {
        sPressed = false;
        clearMov();
        movDown = true;
    } else if (aPressed && onGridY) {
        aPressed = false;
        clearMov();
        movLeft = true;
    } else if (dPressed && onGridY) {
        dPressed = false;
        clearMov();
        movRight = true;
    }

    if (movUp) {
        this.y -= this.velY;
    } else if (movLeft) {
        this.x -= this.velX
    } else if (movDown) {
        this.y += this.velY;
    } else if (movRight) {
        this.x += this.velX;
    }
}

// || Collision detection with the edge of the canvas

Snake.prototype.checkBounds = function() {
    if ((this.x + (this.size - 1)) >= width || (this.x + 1) <= 0 || (this.y + (this.size - 1)) >= height || (this.y + 1) <= 0) {
        clearMov();
        start = false;
        gameOver = true;
    } 
}

// || collision detection to the snake prototype

Snake.prototype.collisionDetect = function() {

    // collision with the apple
    if (this.x < apple.xLocation + apple.width &&
        this.x + this.size > apple.xLocation &&
        this.y < apple.yLocation + apple.height &&
        this.y + this.size > apple.yLocation) {
            apple.newLocation();
            score++;
            anotherTail();
        }
    
    // collision with other parts of the snake
    for (i=2; i < tails.length; i++) {
        if (this.x < tails[i].x + tails[i].width &&
            this.x + this.size > tails[i].x &&
            this.y < tails[i].y + tails[i].height && 
            this.y + this.size > tails[i].y) {
                clearMov();
                start = false;
                gameOver = true;
            }
    }
}

// || code for the snake to create a movement path that the body/tail follows

Snake.prototype.addMovementPath = function () {
    let pushDir;
    if (movUp) {
        pushDir = 'up';
    } else if (movDown) {
        pushDir = 'down';
    } else if (movLeft) {
        pushDir = 'left';
    } else if (movRight) {
        pushDir = 'right';
    };
    
    snakeArrX.unshift(this.x);
    snakeArrY.unshift(this.y);
    globalDirArr.unshift(pushDir);

    if (snakeArrX.length > tails.length + 2) {
        snakeArrX.pop();
    };
    if (snakeArrY.length > tails.length + 2) {
        snakeArrY.pop();
    }
    if (globalDirArr.length > tails.length + 2) {
        globalDirArr.pop();
    }
}

// || The Tail Class _____________________________________
class Tail {
    constructor(velX, velY, arrPos, color) {
        this.height = gridSectionWidth;
        this.width = gridSectionWidth;
        this.color = color;
        this.x;
        this.y;
        this.velX = velX;
        this.velY = velY;
        this.tailDirection;
        this.arrPos = arrPos;
    }
}

// || Tail draw method

Tail.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// || createTail method

Tail.prototype.createTail = function () {
        this.x = [snakeArrX][this.arrPos + 1];
        this.y = snakeArrY[this.arrPos + 1];
        this.tailDirection = globalDirArr[this.arrPos];
}

// || tail move method

Tail.prototype.move = function() {

    if (onGrid && onGridY) {
        this.x = snakeArrX[this.arrPos + 1];
        this.y = snakeArrY[this.arrPos + 1];
        this.tailDirection = globalDirArr[this.arrPos];
    }

    if (this.tailDirection === 'up') {
        this.y -= this.velY;
    } else if (this.tailDirection === 'down') {
        this.y += this.velY;
    } else if (this.tailDirection === 'left') {
        this.x -= this.velX;
    } else if (this.tailDirection === 'right') {
        this.x += this.velX;
    }
}

Tail.prototype.collision = function() {
    if (this.x < apple.xLocation + apple.width &&
        this.x + this.width > apple.xLocation &&
        this.y < apple.yLocation + apple.height &&
        this.y + this.height > apple.yLocation) {
            apple.newLocation();
    }
}

// Food class _______________________________________________________

class Food {
    constructor(colour, xLocation, yLocation) {
        this.height = gridSectionHeight;
        this.width = gridSectionWidth;
        this.colour = colour;
        this.xLocation = xLocation;
        this.yLocation = yLocation;
    }

    drawFood() {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.xLocation, this.yLocation, this.width, this.height);
    }

    newLocation() {
        newFoodX = random(0, 14) * gridSectionWidth;
        newFoodY = random(0, 14) * gridSectionHeight;

        this.xLocation = newFoodX;
        this.yLocation = newFoodY;

    }
}

// || create a new snake and food instance

let snake = new Snake(6, 6);
let apple = new Food('red', random(0, 14) * gridSectionWidth, random(0, 14) * gridSectionWidth);

// || velocityMatch function _______________________________

function velocityMatch() {
    if (fps >= 120) {
        snake.velX = 3;
        snake.velY = 3;
    } else {
        snake.velX = 6;
        snake.velY = 6;
    }
}

// || anotherTail function __________________________________

function anotherTail() {
    let tail = new Tail(snake.velX, snake.velY, arrPosNo, 'green');
    tail.createTail();
    tails.push(tail);
    arrPosNo += 1;
    tl = tails.length;
};

// || drawCanvas function ____________________________________

function drawCanvas() {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, width, height);
}

// || clearMov function (resets mov variables) ________________

function clearMov() {
    movUp = false;
    movDown = false;
    movLeft = false;
    movRight = false;
    wPressed = false;
    aPressed = false;
    sPressed = false;
    dPressed = false;
}

// || startGame function _______________________________

const btn = document.querySelector('button');
btn.className = 'start';
btn.addEventListener('click', startGame);

function startGame(e) {
    div.removeChild(e.target);
    movUp = true;
    start = true;
    gameOver = false;
    loop();
}

// || Retry function ________________________________

function retryGame(e) {

    div.removeChild(e.target);
    div.appendChild(btn);

    clearMov();
    tailExists = false;

    if (score > highScore) {
        highScore = score;
    }

    tails.length = 0;
    arrPosNo = 0;
    snakeArrX.length = 0;
    snakeArrY.length = 0;
    globalDirArr.length = 0;
    score = 0;

    snake.x = gridSectionWidth * 7;
    snake.y = gridSectionHeight * 7;
    apple.newLocation();
    drawCanvas();
    snake.draw();
}

// || Init function _______________________________

window.onload = init;

function init() {
    drawCanvas();
    snake.draw();
    snake.setControl();
    snake.checkBounds();
}