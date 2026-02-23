export const breakoutTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Breakout</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #fff;
}
#info {
  display: flex;
  gap: 30px;
  margin-bottom: 10px;
  font-size: 20px;
}
canvas {
  border: 2px solid #f0f;
  background: #000;
  cursor: pointer;
}
#instructions {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
}
#gameOver {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}
#gameOver button {
  margin-top: 20px;
  padding: 10px 30px;
  font-size: 18px;
  background: #f0f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
#startPrompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: bold;
  color: #f0f;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  z-index: 15;
  text-align: center;
  pointer-events: none;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
}
</style>
</head>
<body>
<div id="info">
  <div>Score: <span id="score">0</span></div>
  <div>Lives: <span id="lives">3</span></div>
  <div>Level: <span id="level">1</span></div>
</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="600" height="500"></canvas>
<div id="instructions">Use Arrow Keys or Mouse to move paddle</div>
<div id="gameOver">
  <h2 id="gameOverText"></h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const gameOverTextEl = document.getElementById('gameOverText');
const finalScoreEl = document.getElementById('finalScore');

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let gameStarted = false;

const paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  width: 100,
  height: 15,
  dx: 0,
  speed: 7
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  radius: 8,
  dx: 4,
  dy: -4,
  speed: 4
};

const brickInfo = {
  rows: 5,
  cols: 8,
  width: 70,
  height: 20,
  padding: 5,
  offsetX: 10,
  offsetY: 40
};

let bricks = [];

function createBricks() {
  bricks = [];
  for (let row = 0; row < brickInfo.rows; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickInfo.cols; col++) {
      bricks[row][col] = {
        x: brickInfo.offsetX + col * (brickInfo.width + brickInfo.padding),
        y: brickInfo.offsetY + row * (brickInfo.height + brickInfo.padding),
        status: 1,
        color: \`hsl(\${row * 40}, 70%, 50%)\`
      };
    }
  }
}

function drawBricks() {
  bricks.forEach(row => {
    row.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brickInfo.width, brickInfo.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(brick.x, brick.y, brickInfo.width, brickInfo.height);
      }
    });
  });
}

function drawPaddle() {
  ctx.fillStyle = '#f0f';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
}

function update() {
  if (!gameRunning) return;
  
  // Move paddle
  paddle.x += paddle.dx;
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
  
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Ball collision with walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }
  
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }
  
  // Ball collision with paddle
  if (ball.y + ball.radius > paddle.y &&
      ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    ball.dy = -Math.abs(ball.dy);
    const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = hitPos * 5;
  }
  
  // Ball collision with bricks
  bricks.forEach(row => {
    row.forEach(brick => {
      if (brick.status === 1) {
        if (ball.x > brick.x && ball.x < brick.x + brickInfo.width &&
            ball.y > brick.y && ball.y < brick.y + brickInfo.height) {
          ball.dy *= -1;
          brick.status = 0;
          score += 10;
          scoreEl.textContent = score;
          
          // Check if all bricks are destroyed
          if (bricks.every(row => row.every(brick => brick.status === 0))) {
            level++;
            levelEl.textContent = level;
            ball.speed += 0.5;
            createBricks();
            resetBall();
          }
        }
      }
    });
  });
  
  // Ball falls below paddle
  if (ball.y + ball.radius > canvas.height) {
    lives--;
    livesEl.textContent = lives;
    
    if (lives === 0) {
      endGame(false);
    } else {
      resetBall();
    }
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 50;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;
}

function endGame(won) {
  gameRunning = false;
  gameOverTextEl.textContent = won ? 'You Win!' : 'Game Over!';
  finalScoreEl.textContent = \`Final Score: \${score} | Level: \${level}\`;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    startGame();
  }
  
  if (e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  } else if (e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    paddle.dx = 0;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!gameStarted) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
});

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
});

createBricks();
gameLoop();
</script>
</body>
</html>`;
