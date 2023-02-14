(function () {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  // check if user has resolution to play the game
  if (window.innerHeight < 800 || window.innerWidth < 800) {
    canvas.style.border = "none";
    alert(
      "Sorry this game is meant for devices with at least 800x800 screen resolution."
    );
    return;
  }

  const gameOver = () => {
    global.inPlay = false;
    global.canShoot = false;
    const gameOverContainer = document.createElement("div");
    gameOverContainer.classList.add("game-over-container");
    const wrapper = document.querySelector(".wrapper");
    wrapper.appendChild(gameOverContainer);
    const gameOverScoreText = document.createElement("span");
    gameOverScoreText.classList.add("game-over-score-text");
    gameOverScoreText.innerText = `Score: ${global.gameScore}`;
    gameOverContainer.appendChild(gameOverScoreText);
    const gameOverButton = document.createElement("button");
    gameOverButton.classList.add("game-over-button");
    gameOverButton.innerText = `Replay`;
    gameOverContainer.appendChild(gameOverButton);
    gameOverButton.addEventListener("click", handleGameOverButtonClick);
  };

  const handleGameOverButtonClick = () => {
    const gameOverContainer = document.querySelector(".game-over-container");
    global.inPlay = true;
    const gameOverButton = document.querySelector(".game-over-button");
    gameOverButton.removeEventListener("click", handleGameOverButtonClick);
    gameOverContainer.remove();
    restartGame();
  };

  const incrementScore = () => {
    const scoreBoard = document.querySelector(".score-board");
    global.gameScore++;
    scoreBoard.innerHTML = `Score: ${global.gameScore}`;
  };

  const findEnemyIndex = (obj) => {
    let index;
    for (let i = 0; i < global.enemies.length; i++) {
      let current = global.enemies[i];
      if (current.x === obj.x && current.y === obj.y) {
        index = i;
      }
    }
    return index;
  };

  const findEnemyCoordinatesByIndex = (index) => {
    const x = global.enemies[index].x;
    const y = global.enemies[index].y;
    return [x, y];
  };

  const randomSplitDistance = () => {
    const distances = [-40, -20, 30, 50];
    const randomNum = Math.floor(Math.random() * distances.length);
    return distances[randomNum];
  };

  const restartGame = () => {
    const scoreBoard = document.querySelector(".score-board");
    global.gameScore = 0;
    global.enemyCounter = 0;
    global.projectiles = [];
    global.enemies = [];
    (global.enemySpeedMultiplier = 0.5),
      (scoreBoard.innerHTML = `Score: ${global.gameScore}`);
    setTimeout(() => {
      global.canShoot = true;
    }, 0);
  };

  const global = {
    projectiles: [],
    enemies: [],
    enemyCounter: 0,
    enemySpeedMultiplier: 0.5,
    enemyHitCounter: 0,
    gameScore: 0,
    inPlay: true,
    canShoot: true,
  };

  const isCollide = (circle1, circle2) => {
    let dx, dy, distance;

    if (circle1.x > circle2.x) {
      dx = circle1.x - circle2.x;
    } else {
      dx = circle2.x - circle1.x;
    }

    if (circle1.y > circle2.y) {
      dy = circle1.y - circle2.y;
    } else {
      dy = circle2.y - circle1.y;
    }

    distance = Math.sqrt(dx * dx + dy * dy);

    const sumOfRadii = circle1.radius + circle2.radius;

    if (distance <= sumOfRadii) {
      return true;
    } else {
      return false;
    }
  };

  const generateScoreboard = () => {
    const scoreBoard = document.querySelector(".score-board");
    scoreBoard.classList.add("score-board");
    scoreBoard.innerText = `Score: ${global.gameScore}`;
  };

  const randomEnemySize = () => {
    const sizes = [20, 30, 50];
    const randomNum = Math.floor(Math.random() * sizes.length);
    return sizes[randomNum];
  };

  const randomEnemyStart = () => {
    const x = [0, canvas.width / 2, canvas.width];
    const y = [0, canvas.height / 2, canvas.height];
    let randomNumX = Math.floor(Math.random() * x.length);
    let randomNumY = Math.floor(Math.random() * y.length);
    while (randomNumX === 1 && randomNumY === 1) {
      randomNumX = Math.floor(Math.random() * x.length);
      randomNumY = Math.floor(Math.random() * y.length);
    }
    return [x[randomNumX], y[randomNumY]];
  };

  const getMouseCoordinates = (e) => {
    const root = document.documentElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - root.scrollLeft - rect.left;
    const y = e.clientY - root.scrollTop - rect.top;
    return [x, y];
  };

  const handleMouseClick = (e) => {
    if (global.canShoot) {
      const x = getMouseCoordinates(e)[0] - canvas.width / 2;
      const y = getMouseCoordinates(e)[1] - canvas.height / 2;
      const angle = Math.atan2(y, x);
      global.projectiles.push(new Projectile(angle));
    }
  };

  window.addEventListener("click", handleMouseClick);

  class Player {
    constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.radius = 50;
    }

    draw() {
      // player stroke
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = "#bae4fd";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Projectile {
    constructor(angle) {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.radius = 10;
      this.angle = angle;
      this.alive = true;
    }

    draw() {
      // projectile stroke
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

      if (this.alive) {
        ctx.fillStyle = "#bae4fd";
        ctx.stroke();
      } else {
        ctx.fillStyle = "transparent";
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    move() {
      this.x += Math.cos(this.angle) * 10;
      this.y += Math.sin(this.angle) * 10;
    }

    update() {
      if (global.inPlay) {
        this.draw();
        this.move();
      }
    }
  }

  class Enemy {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.angle = Math.atan2(
        this.y - canvas.height / 2,
        this.x - canvas.width / 2
      );
      this.color = "orangered";
      this.alive = true;
    }

    draw() {
      // create stroke for enemies
      ctx.lineWidth = 5;
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

      if (this.alive === false) {
        ctx.lineWidth = 0;
        this.color = "transparent";
      } else {
        ctx.stroke();
      }

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    move() {
      this.x -= Math.cos(this.angle) * global.enemySpeedMultiplier;
      this.y -= Math.sin(this.angle) * global.enemySpeedMultiplier;
    }

    collidesWithPlayer() {
      const result = isCollide(this, player);
      if (result && this.alive) {
        gameOver();
      }
    }

    collidesWithProjectile() {
      let result;
      global.projectiles.forEach((projectile) => {
        result = isCollide(this, projectile);
        if (result && this.alive && projectile.alive) {
          projectile.alive = false;
          global.enemyHitCounter++;
          incrementScore();
          this.splitEnemy(this);
          this.alive = false; // enemy dies when hiht by projectile
        }
      });
    }

    splitEnemy(obj) {
      const index = findEnemyIndex(obj);
      const x = findEnemyCoordinatesByIndex(index)[0];
      const y = findEnemyCoordinatesByIndex(index)[1];
      if (this.radius === 20) {
      } else if (this.radius === 30) {
        for (let i = 0; i < 2; i++) {
          global.enemies.push(
            new Enemy(x + randomSplitDistance(), y + randomSplitDistance(), 20)
          );
        }
      } else if (this.radius === 50) {
        for (let i = 0; i < 2; i++) {
          global.enemies.push(
            new Enemy(x + randomSplitDistance(), y + randomSplitDistance(), 30)
          );
        }
      }
    }

    update() {
      if (global.inPlay) {
        this.draw();
        this.move();
        this.collidesWithPlayer();
        this.collidesWithProjectile();
      }
    }
  }

  const generateEnemies = () => {
    global.enemyCounter++;
    if (global.enemyCounter === 100) {
      const start = randomEnemyStart();
      global.enemies.push(new Enemy(start[0], start[1], randomEnemySize()));
      global.enemyCounter = 0;
    }
  };

  const incrementEnemySpeedMultiplier = () => {
    if (global.enemyHitCounter === 5) {
      global.enemySpeedMultiplier += 0.1;
      global.enemyHitCounter = 0;
    }
  };

  const player = new Player();

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateEnemies();
    global.projectiles.forEach((projectile) => {
      projectile.update();
    });
    global.enemies.forEach((enemy) => {
      enemy.update();
    });
    player.draw();
    window.requestAnimationFrame(animate);
    incrementEnemySpeedMultiplier();
  };

  window.onload = () => {
    generateScoreboard();
    animate();
  };
})();
