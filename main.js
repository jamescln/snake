// || setup canvas and html variables

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.container');
const div = document.querySelector('div');

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

let newFoodX;
let newFoodY;

let score = 0;
let highScore = 0;

let secondsPassed;
let oldTimeStamp;
let fps;

// || Game Loop __________________________________________

function loop (timeStamp) {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0 , width, height);

    snake.draw();
    snake.setControl();
    snake.checkBounds();
    snake.collisionDetect();

    if (tailExists){    
        for (t=0; t < tails.length; t++) {
        tails[t].draw();
        tails[t].move();
        tails[t].collision();
        }
    }

    // if (tails.length < 1) {
    //     tailAdd1.drawFood();
    //     tailAdd1.collision();
    // }

    // if (tails.length < 2) {
    //     tailAdd2.drawFood();
    //     tailAdd2.collision();
    // } else {}

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

// ||| test

function test () {
    ctx.fillstyle = 'orange';
    for (i = 0; i < tails.length; i++) {
        let tail = tails[i];
        ctx.fillRect(tail)
    }
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
        
    if (movUp || movDown) {

        window.onkeydown = function(e) {
            
            if (e.key === 'a') {
                aPressed = true;
                dPressed = false;
            }  else if (e.key === 'd') {
                dPressed = true;
                aPressed = false;
            }
        }

        if ((this_.y + gridSectionHeight) % gridSectionHeight === 0) {
            onGridY = true;
        } else {
            onGridY = false;
        }
    }

    if (movLeft || movRight) {

        window.onkeydown = function(e) {

            if (e.key === 'w') {
               wPressed = true;
               sPressed = false;

            } else if (e.key === 's') {
                sPressed = true;
                wPressed = false;
            }
        }

        if ((this_.x + gridSectionWidth) % gridSectionWidth === 0) {
            onGrid = true;
        } else {
            onGrid = false;
        }
    }

    if (wPressed && onGrid) {
        wPressed = false;
        clearMov();
        movUp = true;
        if (tailExists) {    
            this_.addMovementPath();}
    } else if (sPressed && onGrid) {
        sPressed = false;
        clearMov();
        movDown = true;
        if (tailExists) {
            this_.addMovementPath();}
    } else if (aPressed && onGridY) {
        aPressed = false;
        clearMov();
        movLeft = true;
        if (tailExists) {
            this_.addMovementPath();}
    } else if (dPressed && onGridY) {
        dPressed = false;
        clearMov();
        movRight = true;
        if (tailExists) {    
            this_.addMovementPath();}
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
            if (!tailExists) {
                tailExists = true;
            }
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
    
    if (tailExists) {
            tails[0].pathX.unshift(this.x);
            tails[0].pathY.unshift(this.y);
            tails[0].dirArr.unshift(pushDir);
    }
}

// || The Tail Class _____________________________________
class Tail {
    constructor(velX, velY, arrPos) {
        this.height = gridSectionHeight;
        this.width = gridSectionWidth;
        this.colour = 'green';
        this.x;
        this.y;
        this.velX = velX;
        this.velY = velY;
        this.tailDirection;
        this.pathX = [];
        this.pathY = [];
        this.dirArr = [];
        this.arrPos = arrPos;
    }
}

// || Tail draw method

Tail.prototype.draw = function () {
    ctx.fillstyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// || createTail method

Tail.prototype.createTail = function () {
    if (!tailExists){
    if (movUp) {
        this.x = snake.x;
        this.y = snake.y + snake.size;
        this.tailDirection = 'up';
    } else if (movDown) {
        this.x = snake.x;
        this.y = snake.y - snake.size;
        this.tailDirection = 'down';
    } else if (movLeft) {
        this.x = snake.x + snake.size;
        this.y = snake.y;
        this.tailDirection = 'left';
    } else if (movRight) {
        this.x = snake.x - snake.size;
        this.y = snake.y;
        this.tailDirection = 'right';
    }}

    else if (tailExists) {

    this.tailDirection = tails[tl -1].tailDirection;
    this.pathX = tails[tl -1].pathX;
    this.pathY = tails[tl -1].pathY;
    this.dirArr = tails[tl -1].dirArr;

        if (tails[tl -1].tailDirection === 'up') {
            this.x = tails[tl -1].x;
            this.y = tails[tl -1].y + tails[tl -1].height;
        } else if (tails[tl -1].tailDirection === 'down') {
            this.x = tails[tl -1].x;
            this.y = tails[tl -1].y - tails[tl -1].height;
        } else if (tails[tl -1].tailDirection === 'left') {
            this.x = tails[tl -1].x + tails[tl -1].width;
            this.y = tails[tl -1].y;
        } else if (tails[tl -1].tailDirection === 'right') {
            this.x = tails[tl -1].x - tails[tl -1].width;
            this.y = tails[tl -1].y;
        }
    }
}

// || tail move method

Tail.prototype.move = function() {
    if (this.x === this.pathX[0] && this.y === this.pathY[0]) {
        this.tailDirection = this.dirArr[0];
        if (tails.length > 1 && this.arrPos !== tails.length -1) {
            tails[this.arrPos + 1].dirArr.push(this.dirArr[0]); 
            tails[this.arrPos + 1].pathX.push(this.pathX[0]);
            tails[this.arrPos + 1].pathY.push(this.pathY[0]);
        }
        this.clearMovPath();
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

Tail.prototype.clearMovPath = function() {
    this.dirArr.shift();
    this.pathX.shift();
    this.pathY.shift();
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

// Food.prototype.collision = function() {
//     if (this.xLocation < snake.x + snake.size &&
//         this.xLocation + this.width > snake.x &&
//         this.yLocation < snake.y + snake.size &&
//         this.yLocation + this.height > snake.y) {
//             anotherTail();
//             if (!tailExists) {
//                 tailExists = true;
//             }
//             this.xLocation = null;
//             this.yLocation = null;
//         }
// }

// || create a new snake and food instance

let snake = new Snake(6, 6);
let apple = new Food('red', random(0, 14) * gridSectionWidth, random(0, 14) * gridSectionWidth);
// let tailAdd1 = new Food('grey', snake.x, snake.y - gridSectionHeight);
// let tailAdd2 = new Food('grey', snake.x, snake.y - (gridSectionHeight * 2));

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
    let tail = new Tail(snake.velX, snake.velY, arrPosNo);
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