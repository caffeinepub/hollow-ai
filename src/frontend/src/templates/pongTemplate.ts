export const pongTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Pong</title>
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
#score {
  font-size: 24px;
  margin-bottom: 10px;
}
canvas {
  border: 2px solid #0af;
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
  background: #0af;
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
  color: #0af;
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
<div id="score">Player: 0 | AI: 0</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="600" height="400"></canvas>
<div id="instructions">Use Arrow Keys or Mouse to move paddle | First to 10 wins!</div>
<div id="gameOver">
  <h2 id="winnerText"></h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const winnerTextEl = document.getElementById('winnerText');
const finalScoreEl = document.getElementById('finalScore');

let playerScore = 0;
let aiScore = 0;
let gameRunning = false;
let gameStarted = false;
const WINNING_SCORE = 10;

const paddle = {
  x: 10,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  dy: 0,
  speed: 6
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  dx: 4,
  dy: 4,
  speed: 4
};

const aiPaddle = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  speed: 3.5
};

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
  ball.dy = (Math.random() * 2 - 1) * ball.speed;
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw center line
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw paddles
  ctx.fillStyle = '#0af';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function update() {
  if (!gameRunning) return;
  
  // Move player paddle
  paddle.y += paddle.dy;
  paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
  
  // AI paddle follows ball with some prediction
  const aiCenter = aiPaddle.y + aiPaddle.height / 2;
  const targetY = ball.y + ball.dy * 10;
  if (targetY < aiCenter - 10) {
    aiPaddle.y -= aiPaddle.speed;
  } else if (targetY > aiCenter + 10) {
    aiPaddle.y += aiPaddle.speed;
  }
  aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));
  
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Ball collision with top/bottom
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy *= -1;
  }
  
  // Ball collision with player paddle
  if (ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y > paddle.y && ball.y < paddle.y + paddle.height &&
      ball.dx < 0) {
    ball.dx = Math.abs(ball.dx) * 1.05;
    const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    ball.dy = hitPos * 5;
  }
  
  // Ball collision with AI paddle
  if (ball.x + ball.radius > aiPaddle.x &&
      ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height &&
      ball.dx > 0) {
    ball.dx = -Math.abs(ball.dx) * 1.05;
    const hitPos = (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
    ball.dy = hitPos * 5;
  }
  
  // Ball out of bounds (player missed)
  if (ball.x < 0) {
    aiScore++;
    scoreEl.textContent = \`Player: \${playerScore} | AI: \${aiScore}\`;
    if (aiScore >= WINNING_SCORE) {
      endGame(false);
    } else {
      resetBall();
    }
  }
  
  // Ball out of bounds (AI missed)
  if (ball.x > canvas.width) {
    playerScore++;
    scoreEl.textContent = \`Player: \${playerScore} | AI: \${aiScore}\`;
    if (playerScore >= WINNING_SCORE) {
      endGame(true);
    } else {
      resetBall();
    }
  }
}

function endGame(playerWon) {
  gameRunning = false;
  winnerTextEl.textContent = playerWon ? 'You Win!' : 'AI Wins!';
  finalScoreEl.textContent = \`Final Score: \${playerScore} - \${aiScore}\`;
  gameOverEl.style.display = 'block';
  const finalScore = playerScore * 10;
  window.parent.postMessage({ type: 'gameScore', score: finalScore }, '*');
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
  
  if (e.key === 'ArrowUp') {
    paddle.dy = -paddle.speed;
  } else if (e.key === 'ArrowDown') {
    paddle.dy = paddle.speed;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    paddle.dy = 0;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!gameStarted) return;
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  paddle.y = mouseY - paddle.height / 2;
  paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
});

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
});

gameLoop();
</script>
</body>
</html>`;
