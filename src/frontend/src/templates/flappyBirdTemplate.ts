export const flappyBirdTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Flappy Bird</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #4ec0ca;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  overflow: hidden;
}
#score {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  z-index: 10;
}
canvas {
  display: block;
  border: 3px solid #2c3e50;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  cursor: pointer;
}
#gameOver {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.9);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  z-index: 20;
  color: #fff;
}
#gameOver h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #f39c12;
}
#gameOver p {
  font-size: 24px;
  margin-bottom: 10px;
}
#gameOver button {
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
#gameOver button:hover {
  background: #229954;
}
#startPrompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
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
<div id="score">0</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="400" height="600"></canvas>
<div id="gameOver">
  <h2>Game Over!</h2>
  <p id="finalScore"></p>
  <p id="highScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const highScoreEl = document.getElementById('highScore');

let score = 0;
let highScore = 0;
let gameRunning = false;
let gameStarted = false;

// Bird properties
const bird = {
  x: 80,
  y: canvas.height / 2,
  width: 34,
  height: 24,
  velocity: 0,
  gravity: 0.5,
  jump: -9,
  rotation: 0
};

// Pipe properties
const pipes = [];
const pipeWidth = 52;
const pipeGap = 150;
const pipeSpeed = 2;
let frameCount = 0;

// Load sprites
const birdImg = new Image();
birdImg.src = '/assets/generated/flappy-bird-sprite.dim_64x64.png';
const pipeImg = new Image();
pipeImg.src = '/assets/generated/pipe-sprite.dim_64x128.png';

function createPipe() {
  const minHeight = 50;
  const maxHeight = canvas.height - pipeGap - minHeight - 100;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomY: topHeight + pipeGap,
    scored: false
  });
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  
  // Rotate bird based on velocity
  bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 90) * Math.PI / 180;
  ctx.rotate(bird.rotation);
  
  ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();
}

function drawPipes() {
  pipes.forEach(pipe => {
    // Draw top pipe (flipped)
    ctx.save();
    ctx.translate(pipe.x + pipeWidth / 2, pipe.topHeight);
    ctx.scale(1, -1);
    ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, pipe.topHeight);
    ctx.restore();
    
    // Draw bottom pipe
    const bottomHeight = canvas.height - pipe.bottomY;
    ctx.drawImage(pipeImg, pipe.x, pipe.bottomY, pipeWidth, bottomHeight);
  });
}

function drawBackground() {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#4ec0ca');
  gradient.addColorStop(1, '#87ceeb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Ground
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  ctx.fillStyle = '#8b7355';
  ctx.fillRect(0, canvas.height - 55, canvas.width, 5);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Prevent bird from going above canvas
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
  
  // Check if bird hit ground
  if (bird.y + bird.height > canvas.height - 50) {
    endGame();
  }
}

function updatePipes() {
  // Create new pipes
  if (frameCount % 90 === 0) {
    createPipe();
  }
  
  // Move and check pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    const pipe = pipes[i];
    pipe.x -= pipeSpeed;
    
    // Remove off-screen pipes
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(i, 1);
      continue;
    }
    
    // Check collision
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
      if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
        endGame();
      }
    }
    
    // Score point
    if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
      pipe.scored = true;
      score++;
      scoreEl.textContent = score;
    }
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
  
  if (gameRunning) {
    bird.velocity = bird.jump;
  }
}

function endGame() {
  if (!gameRunning) return;
  
  gameRunning = false;
  finalScoreEl.textContent = 'Score: ' + score;
  
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = 'New High Score!';
  } else {
    highScoreEl.textContent = 'High Score: ' + highScore;
  }
  
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function gameLoop() {
  frameCount++;
  
  drawBackground();
  
  if (gameRunning) {
    updateBird();
    updatePipes();
  }
  
  drawPipes();
  drawBird();
  
  requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    startGame();
  }
});

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
});

// Start game loop when images are loaded
let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    gameLoop();
  }
}

birdImg.onload = imageLoaded;
pipeImg.onload = imageLoaded;

// Fallback if images don't load
setTimeout(() => {
  if (imagesLoaded < 2) {
    gameLoop();
  }
}, 1000);
</script>
</body>
</html>`;
