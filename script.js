const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;

let food = { x: 15, y: 15 };
let score = 0;

// Speed Control Variables
const NORMAL_SPEED = 120; // Move every 120ms
const FAST_SPEED = 45;     // Move every 45ms when holding Space or Shift
let currentSpeed = NORMAL_SPEED;

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, currentSpeed);
}

function update() {
  if (dx === 0 && dy === 0) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wall collisions
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    resetGame();
    return;
  }

  // Self collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#16213e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "#e94560";
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#4ecc2a" : "#228b22";
    ctx.fillRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2
    );
  });
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  currentSpeed = NORMAL_SPEED;
  spawnFood();
}

// Controls
window.addEventListener("keydown", (e) => {
  // Turn controls
  if ((e.code === "ArrowUp" || e.code === "KeyW") && dy === 0) {
    dx = 0; dy = -1;
  } else if ((e.code === "ArrowDown" || e.code === "KeyS") && dy === 0) {
    dx = 0; dy = 1;
  } else if ((e.code === "ArrowLeft" || e.code === "KeyA") && dx === 0) {
    dx = -1; dy = 0;
  } else if ((e.code === "ArrowRight" || e.code === "KeyD") && dx === 0) {
    dx = 1; dy = 0;
  }

  // Hold Space or Shift to speed up
  if (e.code === "Space" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
    currentSpeed = FAST_SPEED;
  }
});

window.addEventListener("keyup", (e) => {
  // Release Space or Shift to return to normal speed
  if (e.code === "Space" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
    currentSpeed = NORMAL_SPEED;
  }
});

gameLoop();