import { useState, useEffect, useRef } from 'react';
import { useGetGame } from '../hooks/useGames';
import { useGetHighScore, useUpdateHighScore } from '../hooks/useGameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Maximize2, Minimize2, Trophy, User, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { flappyBirdTemplate } from '../templates/flappyBirdTemplate';

interface GamePlayerProps {
  gameId: string;
  onClose: () => void;
}

// Fully playable game templates with complete HTML/CSS/JavaScript
const GAME_TEMPLATES: Record<string, string> = {
  'flappy-bird': flappyBirdTemplate,
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
</style>
</head>
<body>
<div id="score">Player: 0 | AI: 0</div>
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
const gameOverEl = document.getElementById('gameOver');
const winnerTextEl = document.getElementById('winnerText');
const finalScoreEl = document.getElementById('finalScore');

let playerScore = 0;
let aiScore = 0;
let gameRunning = true;
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

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  paddle.y = mouseY - paddle.height / 2;
  paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
});

gameLoop();
</script>
</body>
</html>`,

  breakout: `<!DOCTYPE html>
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
</style>
</head>
<body>
<div id="info">
  <div>Score: <span id="score">0</span></div>
  <div>Lives: <span id="lives">3</span></div>
  <div>Level: <span id="level">1</span></div>
</div>
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
const gameOverEl = document.getElementById('gameOver');
const gameOverTextEl = document.getElementById('gameOverText');
const finalScoreEl = document.getElementById('finalScore');

let score = 0;
let lives = 3;
let level = 1;
let gameRunning = true;

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
        }
      }
    });
  });
  
  // Check if all bricks are destroyed
  const allBricksDestroyed = bricks.every(row => row.every(brick => brick.status === 0));
  if (allBricksDestroyed) {
    level++;
    levelEl.textContent = level;
    ball.speed += 0.5;
    ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    ball.dy = -ball.speed;
    createBricks();
    resetBall();
  }
  
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
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
  ball.dy = -ball.speed;
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
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

document.addEventListener('keydown', (e) => {
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
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = mouseX - paddle.width / 2;
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
});

createBricks();
gameLoop();
</script>
</body>
</html>`
};

export default function GamePlayer({ gameId, onClose }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { identity } = useInternetIdentity();
  
  // Check if this is a predefined game
  const isPredefinedGame = gameId in GAME_TEMPLATES;
  
  // Only fetch from backend if it's not a predefined game
  const { data: game, isLoading: isGameLoading } = useGetGame(gameId);
  const { data: highScore } = useGetHighScore(gameId);
  const updateHighScore = useUpdateHighScore();

  const gameCode = isPredefinedGame ? GAME_TEMPLATES[gameId] : game?.gameCode;
  const gameTitle = isPredefinedGame 
    ? gameId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : game?.title;
  const gameDescription = isPredefinedGame
    ? 'Built-in game'
    : game?.description;
  const isAICreated = !isPredefinedGame && game?.creator.toString() === '2vxsx-fae';

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'gameScore') {
        const newScore = event.data.score;
        
        // Update high score if this is better
        if (!highScore || newScore > highScore) {
          updateHighScore.mutate({ gameId, score: newScore });
          toast.success(`New High Score: ${newScore}!`, {
            icon: <Trophy className="h-4 w-4" />,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameId, highScore, updateHighScore]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isLoading = !isPredefinedGame && isGameLoading;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-display">{gameTitle || 'Loading...'}</DialogTitle>
              {!isPredefinedGame && game && (
                <Badge variant={isAICreated ? 'default' : 'secondary'} className="flex items-center gap-1">
                  {isAICreated ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {isAICreated ? 'AI' : 'User'}
                </Badge>
              )}
              {isPredefinedGame && (
                <Badge variant="default" className="flex items-center gap-1">
                  Built-in
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {highScore !== undefined && highScore > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>High Score: {highScore}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {gameDescription && (
            <p className="text-sm text-muted-foreground mt-2">{gameDescription}</p>
          )}
        </DialogHeader>

        <div className="flex-1 relative bg-muted/20">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : gameCode ? (
            <iframe
              ref={iframeRef}
              srcDoc={gameCode}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title={gameTitle || 'Game'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Game not found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
