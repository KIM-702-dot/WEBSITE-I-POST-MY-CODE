window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const playButton = document.getElementById("playButton");
  const quitButton = document.getElementById("quitButton");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Game state
  let ball = { x: 300, y: 0, radius: 15, dy: 4 };
  let player = { x: 250, y: 0, width: 100, height: 10, dx: 6 };
  let leftPressed = false, rightPressed = false;
  let score = 0;
  let bestScore = localStorage.getItem("bestScore") || 0;
  let gameRunning = false;

  ctx.font = "20px Arial";
  ctx.fillStyle = "#000";

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height - 40;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
  });

  function update() {
    if (!gameRunning) return;

    if (leftPressed && player.x > 0) player.x -= player.dx;
    if (rightPressed && player.x + player.width < canvas.width) player.x += player.dx;

    ball.y += ball.dy;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw scores
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Best: ${bestScore}`, 20, 60);

    // Check catch
    if (
      ball.y + ball.radius >= player.y &&
      ball.x >= player.x &&
      ball.x <= player.x + player.width
    ) {
      score += 1;
      resetBall();
    }

    // Missed
    if (ball.y - ball.radius > canvas.height) {
      gameOver();
      return;
    }

    requestAnimationFrame(update);
  }

  function resetBall() {
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = -ball.radius;
  }

  function gameOver() {
    gameRunning = false;

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }

    alert(`Game Over!\nYour Score: ${score}\nBest Score: ${bestScore}`);
    quitGame();
  }

  function startGame() {
    intro.style.display = "none";
    canvas.style.display = "block";
    quitButton.style.display = "inline-block";
    mobileControls.style.display = "block";
    score = 0;
    gameRunning = true;
    resetBall();
    update();
  }

  function quitGame() {
    gameRunning = false;
    canvas.style.display = "none";
    quitButton.style.display = "none";
    mobileControls.style.display = "none";
    intro.style.display = "block";
  }

  playButton.addEventListener("click", startGame);
  quitButton.addEventListener("click", quitGame);

  // === Mobile controls ===
  const mobileControls = document.createElement("div");
  mobileControls.id = "mobileControls";
  mobileControls.style.display = "none";
  mobileControls.innerHTML = `
    <button id="leftButton">◀</button>
    <button id="rightButton">▶</button>
  `;
  document.body.appendChild(mobileControls);

  const style = document.createElement("style");
  style.textContent = `
    #mobileControls {
      position: absolute;
      bottom: 20px;
      width: 100%;
      text-align: center;
      z-index: 3;
    }

    #mobileControls button {
      width: 80px;
      height: 80px;
      font-size: 2rem;
      margin: 0 20px;
      background-color: #555;
      color: white;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const leftButton = mobileControls.querySelector("#leftButton");
  const rightButton = mobileControls.querySelector("#rightButton");

  leftButton.addEventListener("touchstart", () => leftPressed = true);
  leftButton.addEventListener("touchend", () => leftPressed = false);
  rightButton.addEventListener("touchstart", () => rightPressed = true);
  rightButton.addEventListener("touchend", () => rightPressed = false);
});
