// setup canvas and html variables

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.container');



if ((window.innerHeight * 0.8) % 30 !== 0) {
    canvas.height = Math.ceil((window.innerHeight * 0.8)/30) * 30;
    canvas.width = canvas.height;
} else {
    canvas.height = window.innerHeight * 0.8;
    canvas.width = height;
}

let height = canvas.height;
let width = height;

// should take 2730 ms for the snake to reach the other end of the screen

let gameSpeed = Math.round ((2730 / canvas.height) * 10) / 10;
//let gameSpeed = 2730 / gameSpeed;

const div = document.querySelector('div');

// add some code to make the snake move on more of a grid system like in the OG game

let gridSectionWidth = width / 15;
let gridSectionHeight = height / 15;
let onGrid = false;
let onGridY = false;


// setup the random number generator

function random (min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// define the snake constructor

class Snake {
    constructor(velX, velY,) {
        this.velX = velX;
        this.velY = velY;
        this.x = gridSectionWidth * 7;
        this.y = gridSectionHeight * 7;
        this.size = gridSectionWidth;
        this.color = 'green';
    }

    // creating the draw method for Snake

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    // creating the setControl method for Snake

    setControl() {
        let this_ = this;
        
        if (movUp || movDown) {
            let __this = this;

            window.onkeydown = function(e) {
                
                if (e.key === 'a') {
                    aPressed = true;
                    dPressed = false;
                }  else if (e.key === 'd') {
                    dPressed = true;
                    aPressed = false;
                }
            }

            if ((__this.y + gridSectionHeight) % gridSectionHeight === 0) {
                onGridY = true;
            } else {
                onGridY = false;
            }
        }

        if (movLeft || movRight) {
            
            let _this = this;

            window.onkeydown = function(e) {

                if (e.key === 'w') {
                   wPressed = true;
                   sPressed = false;

                } else if (e.key === 's') {
                    sPressed = true;
                    wPressed = false;
                }
            }

            if ((_this.x + gridSectionWidth) % gridSectionWidth === 0) {
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
}

// || Collision detection with the edge of the canvas

Snake.prototype.checkBounds = function() {
    if ((this.x + (this.size - 1)) >= width) {    
        movRight = false;
        start = false;
        gameOver = true;
    } 
    
    if ((this.x + 1) <= 0) {
        movLeft = false;
        start = false;
        gameOver = true;
    } 
    
    if ((this.y + (this.size - 1)) >= height) {
        movDown = false;
        start = false;
        gameOver = true;
    } 
    
    if ((this.y + 1) <= 0) {
        movUp = false;
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
            anotherTail();
            if (!tailExists) {
                tailExists = true;
            } else {}
        } else {}
    
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



//The tails array

let tails = [];
let tl = tails.length;

// The Tail Class constructor

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

// tail draw method

Tail.prototype.draw = function () {
    ctx.fillstyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// tail creation method

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

    ctx.fillstyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// tail move method

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

// code for creating new tails

let arrPosNo = 0;

function anotherTail() {
    let tail = new Tail(snake.velX, snake.velY, arrPosNo);
    tail.createTail();
    tails.push(tail);
    arrPosNo += 1;
    tl = tails.length;
};



// create the food class

class Food {
    constructor() {
        this.height = gridSectionHeight;
        this.width = gridSectionWidth;
        this.colour = 'red';
        this.xLocation = random(0, 14) * gridSectionWidth;
        this.yLocation = random(0, 14) * gridSectionHeight;
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

let newFoodX;
let newFoodY;


// create a new snake and food instance

let snake = new Snake(1, 1);
let apple = new Food();

// draw the initial canvas
function drawCanvas() {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, width, height);
}

// create the animation loop

function loop () {
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
    
    apple.drawFood();
   
    if (start) {
        requestAnimationFrame(loop);
    }

    // adding the retry button if gameOver is true

    if (gameOver) {

        div.appendChild(retry);
    
    }
}

// variables for use on first load. First time drawing the snake and canvas.

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

ctx.fillStyle = 'rgba(0,0,0,1)';
ctx.fillRect(0, 0 , width, height);

snake.draw();
snake.setControl();
snake.checkBounds();

// function to reset the mov variables to false

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

// start the game with startGame function

const btn = document.querySelector('button');
btn.className = 'start';
btn.addEventListener('click', startGame);

function startGame(e) {
    div.removeChild(e.target);
    movUp = true;
    start = true;
    gameOver = false;
    loop();
    backgroundLoop();
}

// making the retry button 

let retry = document.createElement('button');
retry.className = 'start';
retry.textContent = 'Retry?';

retry.addEventListener('click', retryGame);

// function to reset the gamestate

function retryGame(e) {

    div.removeChild(e.target);
    div.appendChild(btn);

    clearMov();
    tailExists = false;

    tails.length = 0;
    arrPosNo = 0;

    snake.x = gridSectionWidth * 7;
    snake.y = gridSectionHeight * 7;
    apple.newLocation();
    drawCanvas();
    snake.draw();
}