//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -2; //pipe moving left speed
let velocityY = 0; //bird falling speed
let gravity = 0.4; //gravity effect on the bird

let gameOver = false; // Game over flag
let score = 0; // Score variable

let wingSound = new Audio("assets/sfx_wing.wav");
let hitSound = new Audio("assets/sfx_hit.wav");
let dieSound = new Audio("assets/sfx_die.wav");
let bgm = new Audio("assets/bgm_mario.mp3");

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //Draw the flappy bird
    birdImg = new Image();
    birdImg.src = "assets/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "assets/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "assets/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);

    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {return; } // Stop updating if game is over
    context.clearRect(0, 0, boardWidth, boardHeight);

    //bird
    velocityY += gravity; // Apply gravity to the bird's vertical velocity
    //bird.y += velocityY; // Apply gravity to the bird
    bird.y = Math.max(bird.y + velocityY,0); // Prevent bird from going above the top of the board
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        dieSound.play(); // Play die sound if bird falls below the board

    gameOver = true; // Set game over flag if bird falls below the board
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // Move the pipes to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check if the bird has passed the pipe
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score += 0.5; // Increment score if the bird passes the pipe
            pipe.passed = true;
            // Increment score or perform any action when the bird passes a pipe
        }

        // Check for collision with the bird
        if (detectCollision(bird, pipe)) {
            hitSound.play(); // Play hit sound on collision
            gameOver = true; // Set game over flag if collision occurs}
        }
        
    }

    //clear pipes that are off-screen
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Remove the first pipe if it's off-screen
    }
    //score 
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 20); // Display

    if (gameOver  ) {
        context.fillStyle = "red ";
        context.font = "30px Arial black";
        context.fillText("GAME OVER", boardWidth / 2 - 100, boardHeight / 2);
        context.fillText("Final Score: " + score, boardWidth / 2 - 105, boardHeight / 2 + 40);
    }

}

function placePipes() {
    if (gameOver) {return; } // Stop updating if game is over
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = boardHeight/4; // Space between top and bottom pipes

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArray.push(bottomPipe);
}

function moveBird(event) {
    if (event.key === "ArrowUp" || event.key === " ") {
        wingSound.play(); // Play wing sound on jump
        //jump the bird
        velocityY = -6; // Move the bird up by 50 pixels
        //reset
        if (gameOver) {
            // Reset the game
            bird.y = boardHeight / 2; // Reset bird position
            pipeArray = []; // Clear pipes
            score = 0; // Reset score
            gameOver = false; // Reset game over flag
            velocityY = 0; // Reset bird's vertical velocity
        }
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
              a.x + a.width > b.x &&
              a.y < b.y + b.height &&
              a.y + a.height > b.y; 
}