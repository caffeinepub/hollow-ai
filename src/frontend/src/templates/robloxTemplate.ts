export const robloxTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Roblox</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: linear-gradient(to bottom, #1e90ff, #87ceeb);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  overflow: hidden;
}
#info {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  z-index: 10;
}
canvas {
  display: block;
  border: 4px solid #ff6b6b;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  cursor: pointer;
}
#instructions {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  z-index: 10;
}
#gameOver {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.95);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  z-index: 20;
  color: #fff;
  border: 3px solid #ff6b6b;
}
#gameOver h2 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #FFD700;
}
#gameOver button {
  margin-top: 20px;
  padding: 15px 40px;
  font-size: 20px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
#startPrompt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
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
  <div>Coins: <span id="coins">0</span></div>
  <div>Score: <span id="score">0</span></div>
</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="600" height="400"></canvas>
<div id="instructions">Arrow Keys to Move & Jump | Collect Coins!</div>
<div id="gameOver">
  <h2>Level Complete!</h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const coinsEl = document.getElementById('coins');
const scoreEl = document.getElementById('score');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');

let score = 0;
let coinsCollected = 0;
let gameRunning = false;
let gameStarted = false;

// Player (Roblox character)
const player = {
  x: 50,
  y: canvas.height - 100,
  width: 30,
  height: 40,
  velocityY: 0,
  velocityX: 0,
  speed: 5,
  jumpPower: -12,
  gravity: 0.6,
  onGround: false,
  color: '#ff6b6b'
};

// Platforms
const platforms = [
  { x: 0, y: canvas.height - 50, width: canvas.width, height: 50 },
  { x: 150, y: 300, width: 100, height: 20 },
  { x: 300, y: 250, width: 100, height: 20 },
  { x: 450, y: 200, width: 100, height: 20 },
  { x: 200, y: 150, width: 80, height: 20 },
  { x: 400, y: 100, width: 80, height: 20 }
];

// Coins
const coins = [
  { x: 180, y: 260, collected: false },
  { x: 330, y: 210, collected: false },
  { x: 480, y: 160, collected: false },
  { x: 230, y: 110, collected: false },
  { x: 430, y: 60, collected: false },
  { x: 100, y: 320, collected: false },
  { x: 500, y: 320, collected: false }
];

// Input
const keys = {};
document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    startGame();
  }
  
  keys[e.key] = true;
  
  if (e.key === ' ' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (player.onGround) {
      player.velocityY = player.jumpPower;
      player.onGround = false;
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
}

function updatePlayer() {
  if (!gameRunning) return;
  
  // Horizontal movement
  player.velocityX = 0;
  if (keys['ArrowLeft']) player.velocityX = -player.speed;
  if (keys['ArrowRight']) player.velocityX = player.speed;
  
  player.x += player.velocityX;
  
  // Boundary check
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  
  // Gravity
  player.velocityY += player.gravity;
  player.y += player.velocityY;
  
  // Platform collision
  player.onGround = false;
  platforms.forEach(platform => {
    if (player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + platform.height &&
        player.velocityY > 0) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.onGround = true;
    }
  });
  
  // Coin collection
  coins.forEach(coin => {
    if (!coin.collected) {
      const dx = (player.x + player.width / 2) - coin.x;
      const dy = (player.y + player.height / 2) - coin.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 20) {
        coin.collected = true;
        coinsCollected++;
        score += 100;
        coinsEl.textContent = coinsCollected;
        scoreEl.textContent = score;
        
        // Win condition
        if (coinsCollected === coins.length) {
          endGame();
        }
      }
    }
  });
  
  // Fall off screen
  if (player.y > canvas.height) {
    player.x = 50;
    player.y = canvas.height - 100;
    player.velocityY = 0;
  }
}

function draw() {
  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1e90ff');
  gradient.addColorStop(1, '#87ceeb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw platforms
  ctx.fillStyle = '#8B4513';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
  });
  
  // Draw coins
  coins.forEach(coin => {
    if (!coin.collected) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  
  // Player face
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x + 8, player.y + 10, 4, 4);
  ctx.fillRect(player.x + 18, player.y + 10, 4, 4);
  ctx.fillRect(player.x + 10, player.y + 20, 10, 2);
}

function endGame() {
  gameRunning = false;
  finalScoreEl.textContent = \`Final Score: \${score} | Coins: \${coinsCollected}/\${coins.length}\`;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function gameLoop() {
  updatePlayer();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
});

gameLoop();
</script>
</body>
</html>`;
