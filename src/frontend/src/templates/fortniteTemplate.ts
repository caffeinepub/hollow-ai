export const fortniteTemplate = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Fortnite</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  overflow: hidden;
}
#gameContainer {
  display: flex;
  gap: 10px;
  align-items: flex-start;
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
  border: 4px solid #e74c3c;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  cursor: crosshair;
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
  border-radius: 15px;
  text-align: center;
  z-index: 20;
  color: #fff;
  border: 3px solid #e74c3c;
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
  background: #e74c3c;
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
.shopPanel {
  width: 200px;
  background: rgba(0,0,0,0.85);
  border: 3px solid #e74c3c;
  border-radius: 10px;
  padding: 10px;
  color: #fff;
  max-height: 500px;
  overflow-y: auto;
}
.shopPanel h3 {
  text-align: center;
  color: #FFD700;
  margin-bottom: 10px;
  font-size: 18px;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 5px;
}
.shopScore {
  text-align: center;
  color: #f39c12;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 5px;
  background: rgba(243, 156, 18, 0.2);
  border-radius: 5px;
}
.shopItem {
  background: rgba(255,255,255,0.1);
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  border: 2px solid transparent;
}
.shopItem:hover:not(.cantAfford) {
  background: rgba(255,255,255,0.2);
  transform: scale(1.02);
}
.shopItem.equipped {
  background: rgba(46, 204, 113, 0.3);
  border: 2px solid #2ecc71;
}
.shopItem.cantAfford {
  opacity: 0.4;
  cursor: not-allowed;
}
.shopItem.cantAfford:hover {
  transform: none;
}
.shopItem .name {
  font-weight: bold;
  color: #3498db;
  margin-bottom: 3px;
}
.shopItem .stats {
  font-size: 11px;
  color: #ecf0f1;
}
.shopItem .cost {
  color: #f39c12;
  font-weight: bold;
}
.shopItem .multiplier {
  color: #2ecc71;
}
.purchaseNotification {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 204, 113, 0.95);
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  z-index: 25;
  animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
  pointer-events: none;
}
@keyframes slideDown {
  from { top: 60px; opacity: 0; }
  to { top: 100px; opacity: 1; }
}
@keyframes fadeOut {
  to { opacity: 0; }
}
</style>
</head>
<body>
<div id="info">
  <div>Level: <span id="level">1</span></div>
  <div>Health: <span id="health">100</span></div>
  <div>Score: <span id="score">0</span></div>
  <div>Teammates: <span id="teammates">0</span></div>
</div>
<div id="startPrompt">Tap to Start!</div>
<div id="gameContainer">
  <div class="shopPanel" id="gunShop">
    <h3>🔫 Gun Shop</h3>
    <div class="shopScore">Your Score: <span id="gunShopScore">0</span></div>
    <div id="gunList"></div>
  </div>
  <canvas id="game" width="700" height="500"></canvas>
  <div class="shopPanel" id="teamShop">
    <h3>👥 Teams</h3>
    <div class="shopScore">Your Score: <span id="teamShopScore">0</span></div>
    <div id="teamList"></div>
  </div>
</div>
<div id="instructions">Click to Shoot | WASD to Move | Buy Guns & Teammates!</div>
<div id="gameOver">
  <h2 id="gameOverText"></h2>
  <p id="finalScore"></p>
  <button onclick="location.reload()">Play Again</button>
</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const healthEl = document.getElementById('health');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const teammatesEl = document.getElementById('teammates');
const startPromptEl = document.getElementById('startPrompt');
const gameOverEl = document.getElementById('gameOver');
const gameOverTextEl = document.getElementById('gameOverText');
const finalScoreEl = document.getElementById('finalScore');
const gunListEl = document.getElementById('gunList');
const teamListEl = document.getElementById('teamList');
const gunShopScoreEl = document.getElementById('gunShopScore');
const teamShopScoreEl = document.getElementById('teamShopScore');

let health = 100;
let score = 0;
let level = 1;
let gameRunning = false;
let gameStarted = false;
let currentGun = null;
let scoreMultiplier = 1.0;

// 25 Guns with different stats
const guns = [
  { id: 1, name: 'Pistol', cost: 0, multiplier: 1.0 },
  { id: 2, name: 'Revolver', cost: 100, multiplier: 1.2 },
  { id: 3, name: 'SMG', cost: 250, multiplier: 1.5 },
  { id: 4, name: 'Shotgun', cost: 400, multiplier: 1.8 },
  { id: 5, name: 'Rifle', cost: 600, multiplier: 2.0 },
  { id: 6, name: 'Sniper', cost: 900, multiplier: 2.5 },
  { id: 7, name: 'Minigun', cost: 1200, multiplier: 3.0 },
  { id: 8, name: 'Laser Gun', cost: 1600, multiplier: 3.5 },
  { id: 9, name: 'Plasma Rifle', cost: 2100, multiplier: 4.0 },
  { id: 10, name: 'Rail Gun', cost: 2700, multiplier: 4.5 },
  { id: 11, name: 'Rocket Launcher', cost: 3400, multiplier: 5.0 },
  { id: 12, name: 'Grenade Launcher', cost: 4200, multiplier: 5.5 },
  { id: 13, name: 'Flamethrower', cost: 5100, multiplier: 6.0 },
  { id: 14, name: 'Tesla Coil', cost: 6100, multiplier: 6.5 },
  { id: 15, name: 'Ion Cannon', cost: 7200, multiplier: 7.0 },
  { id: 16, name: 'Photon Blaster', cost: 8400, multiplier: 7.5 },
  { id: 17, name: 'Quantum Gun', cost: 9700, multiplier: 8.0 },
  { id: 18, name: 'Antimatter Rifle', cost: 11100, multiplier: 8.5 },
  { id: 19, name: 'Singularity Cannon', cost: 12600, multiplier: 9.0 },
  { id: 20, name: 'Dark Matter Gun', cost: 14200, multiplier: 9.5 },
  { id: 21, name: 'Void Destroyer', cost: 15900, multiplier: 10.0 },
  { id: 22, name: 'Cosmic Annihilator', cost: 17700, multiplier: 11.0 },
  { id: 23, name: 'Galaxy Obliterator', cost: 19600, multiplier: 12.0 },
  { id: 24, name: 'Universe Ender', cost: 21600, multiplier: 13.0 },
  { id: 25, name: 'Reality Breaker', cost: 24000, multiplier: 15.0 }
];

// Teammate system
const teammates = [];
const teammateTypes = [
  { name: 'Recruit', cost: 500 },
  { name: 'Soldier', cost: 500 },
  { name: 'Veteran', cost: 500 },
  { name: 'Elite', cost: 500 },
  { name: 'Commander', cost: 500 }
];

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 30,
  height: 40,
  speed: 4,
  color: '#3498db',
  shootCooldown: 0
};

// Gogs (renamed from targets/wasps)
const gogs = [];
let gogsToSpawn = 5;

function createGog() {
  const size = 30 + Math.random() * 20;
  return {
    x: Math.random() * (canvas.width - size),
    y: Math.random() * (canvas.height / 2 - size),
    width: size,
    height: size,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    color: '#e74c3c',
    active: true,
    shootCooldown: Math.random() * 60 + 30,
    health: 1
  };
}

function spawnGogsForLevel() {
  gogs.length = 0;
  gogsToSpawn = 5 + (level - 1) * 2; // Increases by 2 each level
  for (let i = 0; i < gogsToSpawn; i++) {
    gogs.push(createGog());
  }
}

// Bullets
const bullets = [];
const gogBullets = [];

// Initialize first level
currentGun = guns[0];
scoreMultiplier = currentGun.multiplier;
spawnGogsForLevel();

// Input
const keys = {};
document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    startGame();
  }
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('click', (e) => {
  if (!gameStarted) {
    startGame();
    return;
  }
  
  if (!gameRunning) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  shootBullet(player.x + player.width / 2, player.y, mouseX, mouseY, bullets, '#f39c12');
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!gameStarted) {
    startGame();
    return;
  }
  
  if (!gameRunning) return;
  
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;
  
  shootBullet(player.x + player.width / 2, player.y, touchX, touchY, bullets, '#f39c12');
});

function shootBullet(fromX, fromY, toX, toY, bulletArray, color) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  bulletArray.push({
    x: fromX,
    y: fromY,
    vx: (dx / distance) * 8,
    vy: (dy / distance) * 8,
    radius: 4,
    color: color
  });
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameRunning = true;
    startPromptEl.style.display = 'none';
  }
}

function updatePlayer() {
  if (!gameRunning) return;
  
  if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
  if (keys['d'] || keys['arrowright']) player.x += player.speed;
  if (keys['w'] || keys['arrowup']) player.y -= player.speed;
  if (keys['s'] || keys['arrowdown']) player.y += player.speed;
  
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(canvas.height / 2, Math.min(canvas.height - player.height, player.y));
  
  if (player.shootCooldown > 0) player.shootCooldown--;
}

function updateGogs() {
  if (!gameRunning) return;
  
  gogs.forEach(gog => {
    if (!gog.active) return;
    
    gog.x += gog.vx;
    gog.y += gog.vy;
    
    if (gog.x < 0 || gog.x + gog.width > canvas.width) {
      gog.vx *= -1;
    }
    if (gog.y < 0 || gog.y + gog.height > canvas.height / 2) {
      gog.vy *= -1;
    }
    
    // Gogs shoot at player
    gog.shootCooldown--;
    if (gog.shootCooldown <= 0) {
      const gogCenterX = gog.x + gog.width / 2;
      const gogCenterY = gog.y + gog.height / 2;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      
      shootBullet(gogCenterX, gogCenterY, playerCenterX, playerCenterY, gogBullets, '#ff0000');
      gog.shootCooldown = Math.random() * 60 + 30;
    }
  });
}

function updateTeammates() {
  if (!gameRunning) return;
  
  teammates.forEach(teammate => {
    teammate.shootCooldown--;
    if (teammate.shootCooldown <= 0 && gogs.some(g => g.active)) {
      // Find random active gog
      const activeGogs = gogs.filter(g => g.active);
      if (activeGogs.length > 0) {
        const targetGog = activeGogs[Math.floor(Math.random() * activeGogs.length)];
        const targetX = targetGog.x + targetGog.width / 2;
        const targetY = targetGog.y + targetGog.height / 2;
        
        // 50% chance to hit
        const willHit = Math.random() < 0.5;
        let aimX = targetX;
        let aimY = targetY;
        
        if (!willHit) {
          // Miss by adding random offset
          aimX += (Math.random() - 0.5) * 100;
          aimY += (Math.random() - 0.5) * 100;
        }
        
        shootBullet(teammate.x, teammate.y, aimX, aimY, bullets, '#2ecc71');
        teammate.shootCooldown = 40;
      }
    }
  });
}

function updateBullets() {
  if (!gameRunning) return;
  
  // Player and teammate bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(i, 1);
      continue;
    }
    
    for (let j = 0; j < gogs.length; j++) {
      const gog = gogs[j];
      if (!gog.active) continue;
      
      if (bullet.x > gog.x && bullet.x < gog.x + gog.width &&
          bullet.y > gog.y && bullet.y < gog.y + gog.height) {
        gog.active = false;
        bullets.splice(i, 1);
        const points = Math.floor(50 * scoreMultiplier);
        score += points;
        updateScore();
        
        // Check if level complete
        if (gogs.every(g => !g.active)) {
          advanceLevel();
        }
        break;
      }
    }
  }
  
  // Gog bullets
  for (let i = gogBullets.length - 1; i >= 0; i--) {
    const bullet = gogBullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      gogBullets.splice(i, 1);
      continue;
    }
    
    // Check collision with player
    if (bullet.x > player.x && bullet.x < player.x + player.width &&
        bullet.y > player.y && bullet.y < player.y + player.height) {
      health -= 5;
      healthEl.textContent = health;
      gogBullets.splice(i, 1);
      
      if (health <= 0) {
        endGame(false);
      }
    }
  }
}

function advanceLevel() {
  if (level >= 50) {
    endGame(true);
    return;
  }
  
  level++;
  levelEl.textContent = level;
  spawnGogsForLevel();
  
  // Bonus score for completing level
  score += level * 100;
  updateScore();
}

function updateScore() {
  scoreEl.textContent = score;
  gunShopScoreEl.textContent = score;
  teamShopScoreEl.textContent = score;
  renderGunShop();
  renderTeamShop();
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'purchaseNotification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function draw() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#34495e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#95a5a6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  
  // Draw gogs
  gogs.forEach(gog => {
    if (gog.active) {
      ctx.fillStyle = gog.color;
      ctx.fillRect(gog.x, gog.y, gog.width, gog.height);
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.strokeRect(gog.x, gog.y, gog.width, gog.height);
      
      // Gog gun
      ctx.fillStyle = '#34495e';
      ctx.fillRect(gog.x + gog.width / 2 - 2, gog.y + gog.height, 4, 8);
    }
  });
  
  // Draw bullets
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  gogBullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Draw teammates
  teammates.forEach(teammate => {
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(teammate.x, teammate.y, 25, 35);
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.strokeRect(teammate.x, teammate.y, 25, 35);
    
    // Teammate gun
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(teammate.x + 12, teammate.y - 8, 3, 8);
  });
  
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  
  ctx.fillStyle = '#7f8c8d';
  ctx.fillRect(player.x + player.width / 2 - 2, player.y - 10, 4, 10);
}

function endGame(won) {
  gameRunning = false;
  if (won) {
    gameOverTextEl.textContent = 'Victory! All 50 Levels Complete!';
  } else {
    gameOverTextEl.textContent = 'Eliminated!';
  }
  finalScoreEl.textContent = \`Final Score: \${score} | Level: \${level}/50\`;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

// Gun Shop
function renderGunShop() {
  gunListEl.innerHTML = '';
  guns.forEach(gun => {
    const div = document.createElement('div');
    div.className = 'shopItem';
    
    const canAfford = score >= gun.cost;
    const isEquipped = currentGun && currentGun.id === gun.id;
    
    if (isEquipped) div.classList.add('equipped');
    if (!canAfford && !isEquipped) div.classList.add('cantAfford');
    
    div.innerHTML = \`
      <div class="name">\${gun.name}</div>
      <div class="stats">
        <div class="cost">Cost: \${gun.cost}</div>
        <div class="multiplier">×\${gun.multiplier.toFixed(1)} Score</div>
      </div>
      \${isEquipped ? '<div style="color: #2ecc71; font-weight: bold;">✓ EQUIPPED</div>' : ''}
    \`;
    
    div.addEventListener('click', () => {
      // If already equipped, just show notification
      if (isEquipped) {
        showNotification(\`\${gun.name} is already equipped!\`);
        return;
      }
      
      // Check if player can afford
      if (!canAfford) {
        showNotification(\`Not enough score! Need \${gun.cost - score} more.\`);
        return;
      }
      
      // Purchase gun
      score -= gun.cost;
      currentGun = gun;
      scoreMultiplier = gun.multiplier;
      updateScore();
      showNotification(\`Purchased \${gun.name}! ×\${gun.multiplier.toFixed(1)} Score Multiplier\`);
    });
    
    gunListEl.appendChild(div);
  });
}

// Team Shop
function renderTeamShop() {
  teamListEl.innerHTML = '';
  teammateTypes.forEach((type, index) => {
    const div = document.createElement('div');
    div.className = 'shopItem';
    
    const canAfford = score >= type.cost;
    if (!canAfford) div.classList.add('cantAfford');
    
    div.innerHTML = \`
      <div class="name">\${type.name}</div>
      <div class="stats">
        <div class="cost">Cost: \${type.cost}</div>
        <div style="color: #ecf0f1; font-size: 10px;">50% Hit Chance</div>
      </div>
    \`;
    
    div.addEventListener('click', () => {
      // Check if player can afford
      if (!canAfford) {
        showNotification(\`Not enough score! Need \${type.cost - score} more.\`);
        return;
      }
      
      // Purchase teammate
      score -= type.cost;
      
      // Spawn teammate
      const teammate = {
        x: player.x + (teammates.length % 2 === 0 ? -40 : 40),
        y: player.y + Math.random() * 20,
        shootCooldown: Math.random() * 40
      };
      
      teammates.push(teammate);
      teammatesEl.textContent = teammates.length;
      updateScore();
      showNotification(\`Hired \${type.name}! Total teammates: \${teammates.length}\`);
    });
    
    teamListEl.appendChild(div);
  });
}

// Initialize shops
renderGunShop();
renderTeamShop();

function gameLoop() {
  updatePlayer();
  updateGogs();
  updateTeammates();
  updateBullets();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
</script>
</body>
</html>
`;
