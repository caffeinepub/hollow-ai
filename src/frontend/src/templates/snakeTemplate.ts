export const snakeTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Snake Game</title>
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
  text-align: center;
}
canvas { 
  border: 2px solid #0f0; 
  background: #000;
  cursor: pointer;
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
  background: #0f0;
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
  color: #0f0;
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
<div id="score">Score: 0</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="400" height="400"></canvas>
<div id="gameOver">
  <h2>Game Over!</h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');

const grid = 20;
let count = 0;
let score = 0;
let gameRunning = false;
let gameStarted = false;

const snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

const apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
}

function gameOver() {
  gameRunning = false;
  finalScoreEl.textContent = 'Final Score: ' + score;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function loop() {
  requestAnimationFrame(loop);

  if (!gameRunning) {
    // Still draw the initial state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f00';
    ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(snake.x, snake.y, grid-1, grid-1);
    return;
  }

  if (++count < 4) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    gameOver();
    return;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  ctx.fillStyle = '#f00';
  ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

  ctx.fillStyle = '#0f0';
  snake.cells.forEach((cell, index) => {
    ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      scoreEl.textContent = 'Score: ' + score;
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    startGame();
  }
  
  if (e.key === 'ArrowLeft' && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowUp' && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.key === 'ArrowRight' && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.key === 'ArrowDown' && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
});

requestAnimationFrame(loop);
</script>
</body>
</html>`;
