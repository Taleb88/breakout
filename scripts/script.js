let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let x = canvas.width / 2;
let y = canvas.height - 30;
// ball painted in new position per update going north east diagonally 
let dx = 2;
let dy = -2;
// ball radius
let ballRadius = 10;
// paddle
let paddleHeight = 11;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
// key movements
let rightPressed = false;
let leftPressed = false;
// bricks
let brickRowCount = 5;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
// score
let score = 0;
// lives
let lives = 5;

// loop through the rows and columns and create new bricks
let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// event gets fired up when user presses down on a right or left key
function keyDownHandler(event) {
    if(event.key == 'Right' || event.key == 'ArrowRight') {
      rightPressed = true;  
    } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
        leftPressed = true;
    }
} 

// event gets fired up when user releases a right or left key
function keyUpHandler(event) {
    if(event.key == 'Right' || event.key == 'ArrowRight') {
        rightPressed = false;  
    } else if (event.key == 'Left' || event.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(event) {
    let relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //x y; radius; start and end angle
    ctx.fillStyle = '#990000';
    ctx.fill();
    ctx.closePath();
}


drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, Math.PI * 2); // left, top, high, wide
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.closePath();    
}

drawBricks = () => {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // bricks
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); // left, top, high, wide
                ctx.fillStyle = '#FFCC00';
                ctx.fill();
                ctx.closePath();  
            }
        }
    }
}

collisionDetection = () => {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                // position of ball; position of brick
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    // score increases when each brick is hit
                    score++;
                    // if all the bricks are gone/broken
                    if(score == brickRowCount * brickColumnCount) {
                        alert('You win. Congrats!');
                        document.location.reload();
                    }  
                }
            }
        }
    }
}

drawScore = () => {
    ctx.font = '0.8rem Verdana';
    ctx.fillStyle = '#FFCC00';
    ctx.fillText('Score: ' + score, 6, 25)
}

drawLives = () => {
    ctx.font = '0.8 Verdana';
    ctx.fillStyle = '#FFCC00'
    ctx.fillText('Lives: ' + lives, canvas.width - 60, 25)   
}

draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas content; no trail
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();


    // left and right edge; bounce ball off right edge by reversing x axis movement as before;
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        // reverse the direction of the ball if condition evaluates to true
        dx = -dx;
    }
    
    // top and bottom edge; bounce ball off bottom edge by reversing y axis movement as before;
    if(y + dy < ballRadius) {
        // reverse the direction of the ball if condition evaluates to true
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) { // center of ball between left and right edges of paddle
        if(x > paddleX && x < paddleX + paddleWidth) {
            if(y = y - paddleHeight) {
                dy = -dy;
            }
        } else { // if the ball hits the bottom
            lives--;
            if(!lives) {
                alert('Miss');
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    } 

    // paddle moving pixels when key is pressed
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7; // paddle goes in opposite direction when it reaches the edge
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw); // game will start over smoothly
}

draw();