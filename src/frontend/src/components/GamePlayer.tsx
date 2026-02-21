import { useState, useEffect, useRef } from 'react';
import { useGameMetadata } from '../hooks/useGameCatalogue';
import { useGetHighScore, useUpdateHighScore } from '../hooks/useGameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Maximize2, Minimize2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GamePlayerProps {
  gameId: string;
  onClose: () => void;
}

// Game templates with complete HTML/CSS/JavaScript
const GAME_TEMPLATES: Record<string, string> = {
  snake: `<!DOCTYPE html>
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
</style>
</head>
<body>
<div id="score">Score: 0</div>
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
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');

const grid = 20;
let count = 0;
let score = 0;
let gameRunning = true;

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

function gameOver() {
  gameRunning = false;
  finalScoreEl.textContent = 'Final Score: ' + score;
  gameOverEl.style.display = 'block';
  window.parent.postMessage({ type: 'gameScore', score: score }, '*');
}

function loop() {
  if (!gameRunning) return;
  requestAnimationFrame(loop);

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

requestAnimationFrame(loop);
</script>
</body>
</html>`,

  tictactoe: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Tic Tac Toe</title>
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
#status {
  font-size: 24px;
  margin-bottom: 20px;
}
#board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 5px;
  background: #333;
  padding: 5px;
}
.cell {
  width: 100px;
  height: 100px;
  background: #222;
  border: none;
  font-size: 48px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.cell:hover:not(:disabled) {
  background: #444;
}
.cell:disabled {
  cursor: not-allowed;
}
button#reset {
  margin-top: 20px;
  padding: 10px 30px;
  font-size: 18px;
  background: #0af;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
</head>
<body>
<div id="status">Player X's Turn</div>
<div id="board"></div>
<button id="reset">Reset Game</button>
<script>
const board = document.getElementById('board');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let score = 0;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  
  if (gameState[index] !== '' || !gameActive) return;
  
  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.disabled = true;
  
  checkResult();
}

function checkResult() {
  let roundWon = false;
  
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      break;
    }
  }
  
  if (roundWon) {
    status.textContent = \`Player \${currentPlayer} Wins!\`;
    gameActive = false;
    score += 10;
    window.parent.postMessage({ type: 'gameScore', score: score }, '*');
    return;
  }
  
  if (!gameState.includes('')) {
    status.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = \`Player \${currentPlayer}'s Turn\`;
}

function resetGame() {
  currentPlayer = 'X';
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  status.textContent = "Player X's Turn";
  createBoard();
}

resetBtn.addEventListener('click', resetGame);
createBoard();
</script>
</body>
</html>`,

  memory: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Memory Match</title>
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
  margin-bottom: 20px;
  font-size: 20px;
}
#board {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  grid-gap: 10px;
}
.card {
  width: 80px;
  height: 80px;
  background: #333;
  border: 2px solid #555;
  border-radius: 8px;
  font-size: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.card:hover:not(.flipped):not(.matched) {
  background: #444;
}
.card.flipped, .card.matched {
  background: #0af;
  border-color: #0af;
}
.card.matched {
  background: #0a0;
  border-color: #0a0;
}
button {
  margin-top: 20px;
  padding: 10px 30px;
  font-size: 18px;
  background: #0af;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
</head>
<body>
<div id="info">
  <div>Moves: <span id="moves">0</span></div>
  <div>Matches: <span id="matches">0</span></div>
</div>
<div id="board"></div>
<button id="reset">New Game</button>
<script>
const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  cards = shuffle([...symbols, ...symbols]);
  
  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard(e) {
  if (!canFlip) return;
  
  const card = e.target;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    canFlip = false;
    moves++;
    document.getElementById('moves').textContent = moves;
    
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    document.getElementById('matches').textContent = matchedPairs;
    
    if (matchedPairs === symbols.length) {
      setTimeout(() => {
        alert(\`You won in \${moves} moves!\`);
        const score = Math.max(100 - moves * 2, 10);
        window.parent.postMessage({ type: 'gameScore', score: score }, '*');
      }, 500);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }
  
  flippedCards = [];
  canFlip = true;
}

function resetGame() {
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  canFlip = true;
  document.getElementById('moves').textContent = '0';
  document.getElementById('matches').textContent = '0';
  createBoard();
}

document.getElementById('reset').addEventListener('click', resetGame);
createBoard();
</script>
</body>
</html>`,

  pong: `<!DOCTYPE html>
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
}
#instructions {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
}
</style>
</head>
<body>
<div id="score">Score: 0</div>
<canvas id="game" width="600" height="400"></canvas>
<div id="instructions">Use Arrow Keys to move paddle</div>
<script>
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let score = 0;
let gameRunning = true;

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
  dy: 4
};

const aiPaddle = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  speed: 3
};

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
  
  // AI paddle follows ball
  const aiCenter = aiPaddle.y + aiPaddle.height / 2;
  if (ball.y < aiCenter - 10) {
    aiPaddle.y -= aiPaddle.speed;
  } else if (ball.y > aiCenter + 10) {
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
      ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
    ball.dx = Math.abs(ball.dx);
    score += 10;
    scoreEl.textContent = 'Score: ' + score;
  }
  
  // Ball collision with AI paddle
  if (ball.x + ball.radius > aiPaddle.x &&
      ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
    ball.dx = -Math.abs(ball.dx);
  }
  
  // Ball out of bounds (player missed)
  if (ball.x < 0) {
    gameRunning = false;
    alert('Game Over! Final Score: ' + score);
    window.parent.postMessage({ type: 'gameScore', score: score }, '*');
    return;
  }
  
  // Ball out of bounds (AI missed)
  if (ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -4;
    score += 20;
    scoreEl.textContent = 'Score: ' + score;
  }
}

function gameLoop() {
  update();
  draw();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

document.addEventListener('keydown', (e) => {
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

gameLoop();
</script>
</body>
</html>`,

  whackamole: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Whack-a-Mole</title>
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
  margin-bottom: 20px;
  font-size: 20px;
}
#board {
  display: grid;
  grid-template-columns: repeat(3, 120px);
  grid-gap: 15px;
}
.hole {
  width: 120px;
  height: 120px;
  background: #333;
  border: 3px solid #555;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.mole {
  width: 80px;
  height: 80px;
  background: #8b4513;
  border-radius: 50%;
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  transition: bottom 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}
.hole.active .mole {
  bottom: 10px;
}
button {
  margin-top: 20px;
  padding: 10px 30px;
  font-size: 18px;
  background: #0af;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
</head>
<body>
<div id="info">
  <div>Score: <span id="score">0</span></div>
  <div>Time: <span id="time">30</span>s</div>
</div>
<div id="board"></div>
<button id="start">Start Game</button>
<script>
let score = 0;
let timeLeft = 30;
let gameActive = false;
let moleInterval;
let timerInterval;

function createBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.dataset.index = i;
    
    const mole = document.createElement('div');
    mole.className = 'mole';
    mole.textContent = '🐹';
    
    hole.appendChild(mole);
    hole.addEventListener('click', whackMole);
    board.appendChild(hole);
  }
}

function showMole() {
  if (!gameActive) return;
  
  const holes = document.querySelectorAll('.hole');
  holes.forEach(h => h.classList.remove('active'));
  
  const randomHole = holes[Math.floor(Math.random() * holes.length)];
  randomHole.classList.add('active');
  
  setTimeout(() => {
    randomHole.classList.remove('active');
  }, 800);
}

function whackMole(e) {
  if (!gameActive) return;
  
  const hole = e.currentTarget;
  if (hole.classList.contains('active')) {
    score += 10;
    document.getElementById('score').textContent = score;
    hole.classList.remove('active');
  }
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  
  document.getElementById('score').textContent = '0';
  document.getElementById('time').textContent = '30';
  document.getElementById('start').disabled = true;
  
  moleInterval = setInterval(showMole, 1000);
  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(moleInterval);
  clearInterval(timerInterval);
  
  document.getElementById('start').disabled = false;
  
  setTimeout(() => {
    alert(\`Game Over! Final Score: \${score}\`);
    window.parent.postMessage({ type: 'gameScore', score: score }, '*');
  }, 100);
}

document.getElementById('start').addEventListener('click', startGame);
createBoard();
</script>
</body>
</html>`,

  colormatch: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Color Match</title>
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
  margin-bottom: 20px;
  font-size: 20px;
}
#colorDisplay {
  width: 200px;
  height: 200px;
  border: 3px solid #fff;
  border-radius: 10px;
  margin-bottom: 20px;
}
#colorName {
  font-size: 32px;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
#choices {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  grid-gap: 15px;
  margin-bottom: 20px;
}
.choice {
  width: 150px;
  height: 150px;
  border: 3px solid #555;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.choice:hover {
  transform: scale(1.05);
  border-color: #fff;
}
button {
  padding: 10px 30px;
  font-size: 18px;
  background: #0af;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
</head>
<body>
<div id="info">
  <div>Score: <span id="score">0</span></div>
  <div>Round: <span id="round">1</span></div>
</div>
<div id="colorDisplay"></div>
<div id="colorName"></div>
<div id="choices"></div>
<button id="next" style="display:none;">Next Round</button>
<script>
const colors = [
  { name: 'Red', value: '#ff0000' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Yellow', value: '#ffff00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Orange', value: '#ffa500' },
  { name: 'Pink', value: '#ffc0cb' },
  { name: 'Cyan', value: '#00ffff' }
];

let score = 0;
let round = 1;
let correctColor;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newRound() {
  const shuffled = shuffle(colors);
  correctColor = shuffled[0];
  const choices = shuffled.slice(0, 4);
  
  document.getElementById('colorDisplay').style.background = correctColor.value;
  document.getElementById('colorName').textContent = correctColor.name;
  
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  
  shuffle(choices).forEach(color => {
    const choice = document.createElement('div');
    choice.className = 'choice';
    choice.style.background = color.value;
    choice.dataset.color = color.name;
    choice.addEventListener('click', checkAnswer);
    choicesDiv.appendChild(choice);
  });
  
  document.getElementById('next').style.display = 'none';
}

function checkAnswer(e) {
  const selected = e.target.dataset.color;
  const choices = document.querySelectorAll('.choice');
  
  choices.forEach(c => {
    c.style.pointerEvents = 'none';
    if (c.dataset.color === correctColor.name) {
      c.style.border = '3px solid #0f0';
    }
  });
  
  if (selected === correctColor.name) {
    score += 10;
    document.getElementById('score').textContent = score;
    e.target.style.border = '3px solid #0f0';
  } else {
    e.target.style.border = '3px solid #f00';
  }
  
  round++;
  document.getElementById('round').textContent = round;
  
  if (round > 10) {
    setTimeout(() => {
      alert(\`Game Complete! Final Score: \${score}/100\`);
      window.parent.postMessage({ type: 'gameScore', score: score }, '*');
      score = 0;
      round = 1;
      document.getElementById('score').textContent = '0';
      document.getElementById('round').textContent = '1';
      newRound();
    }, 1500);
  } else {
    document.getElementById('next').style.display = 'block';
  }
}

document.getElementById('next').addEventListener('click', newRound);
newRound();
</script>
</body>
</html>`
};

export function GamePlayer({ gameId, onClose }: GamePlayerProps) {
  const { data: game, isLoading, error } = useGameMetadata(gameId);
  const { data: highScore } = useGetHighScore(gameId);
  const updateHighScore = useUpdateHighScore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'gameScore') {
        const newScore = event.data.score;
        const currentHigh = Number(highScore || 0);
        
        if (newScore > currentHigh) {
          updateHighScore.mutate({ gameId, score: newScore });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameId, highScore, updateHighScore]);

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !game) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error Loading Game</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Failed to load game data. Please try again later.</p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Get the game template - use title as template name (lowercase)
  const templateName = game.title.toLowerCase().replace(/\s+/g, '');
  const gameHTML = GAME_TEMPLATES[templateName] || GAME_TEMPLATES.snake;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-screen' : 'max-w-4xl h-[80vh]'} p-0 gap-0`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl truncate">{game.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{game.category}</Badge>
              {highScore !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="h-3 w-3" />
                  <span>High Score: {Number(highScore)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="shrink-0"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30">
          <iframe
            ref={iframeRef}
            srcDoc={gameHTML}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0"
            title={game.title}
          />
        </div>

        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground text-center">
            {game.description} • Use arrow keys to play • Press ESC to exit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
