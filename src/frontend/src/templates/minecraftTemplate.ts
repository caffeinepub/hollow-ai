export const minecraftTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Minecraft</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #87CEEB;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  overflow: hidden;
}
#info {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  z-index: 10;
}
canvas {
  display: block;
  border: 4px solid #8B4513;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  image-rendering: pixelated;
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
  text-align: center;
}
#gameOver {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.95);
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  z-index: 20;
  color: #fff;
  border: 3px solid #8B4513;
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
  background: #8B4513;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
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
  <div>Blocks: <span id="blocks">0</span></div>
  <div>Score: <span id="score">0</span></div>
</div>
<div id="startPrompt">Tap to Start!</div>
<canvas id="game" width="640" height="480"></canvas>
<div id="instructions">Arrow Keys to Move | Space to Mine/Place Blocks | Collect Resources!</div>
<div id="gameOver">
  <h2>Game Complete!</h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const blocksEl = document.getElementById('blocks');
const scoreEl = document.getElementById('score');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');

let score = 0;
let blocksCollected = 0;
let gameRunning = false;
let gameStarted = false;
const blockSize = 32;
const gridWidth = canvas.width / blockSize;
const gridHeight = canvas.height / blockSize;

// Player
const player = {
  x: 5,
  y: 10,
  width: blockSize,
  height: blockSize,
  color: '#00BFFF'
};

// Block types
const BLOCK_TYPES = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  WOOD: 4,
  DIAMOND: 5
};

const BLOCK_COLORS = {
  [BLOCK_TYPES.AIR]: null,
  [BLOCK_TYPES.GRASS]: '#7CFC00',
  [BLOCK_TYPES.DIRT]: '#8B4513',
  [BLOCK_TYPES.STONE]: '#808080',
  [BLOCK_TYPES.WOOD]: '#DEB887',
  [BLOCK_TYPES.DIAMOND]: '#00CED1'
};

const BLOCK_SCORES = {
  [BLOCK_TYPES.GRASS]: 5,
  [BLOCK_TYPES.DIRT]: 3,
  [BLOCK_TYPES.STONE]: 10,
  [BLOCK_TYPES.WOOD]: 15,
  [BLOCK_TYPES.DIAMOND]: 50
};

// Initialize world
let world = [];
function initWorld() {
  for (let y = 0; y < gridHeight; y++) {
    world[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      if (y < 8) {
        world[y][x] = BLOCK_TYPES.AIR;
      } else if (y === 8) {
        world[y][x] = BLOCK_TYPES.GRASS;
      } else if (y < 12) {
        world[y][x] = BLOCK_TYPES.DIRT;
      } else {
        // Random stone, wood, and diamond
        const rand = Math.random();
        if (rand < 0.05) {
          world[y][x] = BLOCK_TYPES.DIAMOND;
        } else if (rand < 0.15) {
          world[y][x] = BLOCK_TYPES.WOOD;
        } else {
          world[y][x] = BLOCK_TYPES.STONE;
        }
      }
    }
  }
}

initWorld();

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    startGame();
  }
  
  keys[e.key] = true;
  
  if (e.key === ' ') {
    e.preventDefault();
    mineBlock();
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

function mineBlock() {
  if (!gameRunning) return;
  
  // Check block in front of player
  const checkX = player.x;
  const checkY = player.y + 1;
  
  if (checkY >= 0 && checkY < gridHeight && checkX >= 0 && checkX < gridWidth) {
    const blockType = world[checkY][checkX];
    if (blockType !== BLOCK_TYPES.AIR) {
      world[checkY][checkX] = BLOCK_TYPES.AIR;
      blocksCollected++;
      score += BLOCK_SCORES[blockType] || 0;
      blocksEl.textContent = blocksCollected;
      scoreEl.textContent = score;
      
      // Win condition
      if (blocksCollected >= 50) {
        endGame();
      }
    }
  }
}

function updatePlayer() {
  if (!gameRunning) return;
  
  const speed = 1;
  let newX = player.x;
  let newY = player.y;
  
  if (keys['ArrowLeft']) newX -= speed;
  if (keys['ArrowRight']) newX += speed;
  if (keys['ArrowUp']) newY -= speed;
  if (keys['ArrowDown']) newY += speed;
  
  // Boundary check
  newX = Math.max(0, Math.min(gridWidth - 1, newX));
  newY = Math.max(0, Math.min(gridHeight - 1, newY));
  
  // Collision check
  if (world[newY][newX] === BLOCK_TYPES.AIR) {
    player.x = newX;
    player.y = newY;
  }
}

function drawWorld() {
  // Sky
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw blocks
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const blockType = world[y][x];
      if (blockType !== BLOCK_TYPES.AIR) {
        const color = BLOCK_COLORS[blockType];
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        
        // Block outline
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
        
        // Highlight for special blocks
        if (blockType === BLOCK_TYPES.DIAMOND) {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(x * blockSize + 4, y * blockSize + 4, blockSize - 8, blockSize - 8);
        }
      }
    }
  }
}

function drawPlayer() {
  // Player body
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x * blockSize + 4,
    player.y * blockSize + 4,
    blockSize - 8,
    blockSize - 8
  );
  
  // Player outline
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    player.x * blockSize + 4,
    player.y * blockSize + 4,
    blockSize - 8,
    blockSize - 8
  );
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x * blockSize + 10, player.y * blockSize + 10, 4, 4);
  ctx.fillRect(player.x * blockSize + 18, player.y * blockSize + 10, 4, 4);
}

function endGame() {
  gameRunning = false;
  finalScoreEl.textContent = \`Final Score: \${score} | Blocks Mined: \${blocksCollected}\`;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function gameLoop() {
  updatePlayer();
  drawWorld();
  drawPlayer();
  
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
