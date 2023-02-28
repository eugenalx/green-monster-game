window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 960;
  canvas.height = 570;
  ctx.fillStyle = "#fff234";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width / 2;
      this.collisionY = this.game.height / 2;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 5;
    }
    draw(context) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
      // collision with obstacles
      this.game.obstacles.forEach(obstacle => {
        // [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
        let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
        if (collision) {
            const unit_x = dx / distance;
            const unit_y = dy / distance;
            this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
            this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        };

      })
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 30;
      this.image = document.getElementById('obstacles');
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 30;
        this.frameX = Math.floor(Math.random()*4);
        this.frameY = Math.floor(Math.random()*3);
    }
    draw(context) {
      context.drawImage(this.image,  this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height );
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.player = new Player(this);
      this.numberOfObstacles = 10;
      this.obstacles = [];
      this.mouse = {
        x: this.width / 2,
        y: this.height / 2,
        pressed: false,
      };
      //event listeners
      canvas.addEventListener("mousedown", (event) => {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener("mouseup", (event) => {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
        this.mouse.pressed = false;
      });
      canvas.addEventListener("mousemove", (event) => {
        if (this.mouse.pressed) {
          this.mouse.x = event.offsetX;
          this.mouse.y = event.offsetY;
        }
      });
    }
    render(context) {
      this.obstacles.forEach(obstacle => obstacle.draw(context));
      this.player.draw(context);
      this.player.update();
    }
    checkCollision(objA, objB) {
        const dx = objA.collisionX - objB.collisionX;
        const dy = objA.collisionY - objB.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = objA.collisionRadius + objB.collisionRadius;
        return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
    }
    init() {
      let atempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && atempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumOfRadii =
            testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
          if (distance < sumOfRadii) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 2;
        if (!overlap 
            && testObstacle.spriteX > 0 
            && testObstacle.spriteX < this.width - testObstacle.width
            && testObstacle.collisionY > this.topMargin + margin
            && testObstacle.collisionY < this.height - margin) {
          this.obstacles.push(testObstacle);
        }
        atempts++;
      }
    }
  }
  const game = new Game(canvas);
  game.init();
  console.log(game);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
});
