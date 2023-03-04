window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;
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
      this.spriteWidth = 255;
      this.spriteHeight = 255;
      this.width = this.spriteWidth * 0.8;
      this.height = this.spriteHeight * 0.8;
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = 5;
      this.image = document.getElementById("bull");
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
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
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < -2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;

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
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 60;
      //horizontal bounderies
      if (this.collisionX < this.collisionRadius)
        this.collisionX = this.collisionRadius;
      else if (this.collisionX > this.game.width - this.collisionRadius)
        this.collisionX = this.game.width - this.collisionRadius;
      //vertical bounderies
      if (this.collisionY < this.game.topMargin + this.collisionRadius)
        this.collisionY = this.game.topMargin + this.collisionRadius;
      else if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;
      // collision with obstacles
      this.game.obstacles.forEach((obstacle) => {
        // [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
        let [collision, distance, sumOfRadii, dx, dy] =
          this.game.checkCollision(this, obstacle);
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      });
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 40;
      this.image = document.getElementById("obstacles");
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth * 0.8;
      this.height = this.spriteHeight * 0.8;
      this.spriteX = this.collisionX - this.width * 0.4 - 13;
      this.spriteY = this.collisionY - this.height * 0.4 -  65;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
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
    update(){};
  }

  class Egg {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.margin = this.collisionRadius * 2;
      this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
      this.collisionY = this.game.topMargin +(Math.random() * (this.game.height-this.game.topMargin - this.margin));
      this.image = document.getElementById("egg");
      this.spriteWidth = 110;
      this.spriteHeight = 135;
      this.width = this.spriteWidth * 0.8;
      this.height = this.spriteHeight * 0.8;
      this.spriteX;
      this.spriteY;
    }
    draw(context) {
      context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);
      if (this.game.debug) {
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
    update(){
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 25;
        let collisionObjects =  [this.game.player, ...this.game.obstacles]; 
        collisionObjects.forEach(object => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
            if (collision){
                const unit_x = dx / distance;
                const unit_y = dy / distance;
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;

            }
        });
    }
  }
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.debug = true;
      this.player = new Player(this);
      this.fps = 20;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.eggTimer = 0;
      this.eggInterval = 500;
      this.numberOfObstacles = 10;
      this.maxEggs = 10;
      this.gameObjects = [];
      this.obstacles = [];
      this.eggs = [];
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
      window.addEventListener("keydown", (event) => {
        if (event.key == "d") this.debug = !this.debug;
      });
    }
    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height);
        this.gameObjects = [ this.player, ...this.eggs, ...this.obstacles,];
        // sort by vertical position
        this.gameObjects.sort((a, b) => {
            return a.collisionY - b.collisionY;
        });
        this.gameObjects.forEach(object => {
            object.draw(context);
            object.update();
        });
        // sort by vertical position
        this.gameObjects.sort((a, b) => {
            return a.collisionY - b.collisionY;
        });
        // sort by vertical position
        this.gameObjects.sort((a, b) => {
            return a.collisionY - b.collisionY;
        });
        
        this.timer = 0;
      }
      this.timer += deltaTime;
      //add eggs periodically
      if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs){
        this.addEgg();
        this.eggTimer = 0;
      } else {
        this.eggTimer += deltaTime;
      }
    }
    checkCollision(objA, objB) {
      const dx = objA.collisionX - objB.collisionX;
      const dy = objA.collisionY - objB.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = objA.collisionRadius + objB.collisionRadius;
      return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    }
    addEgg(){
        this.eggs.push(new Egg(this))
    }
    init() {
      let atempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && atempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach((obstacle) => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumOfRadii =
            testObstacle.collisionRadius +
            obstacle.collisionRadius +
            distanceBuffer;
          if (distance < sumOfRadii) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 3;
        if (
          !overlap &&
          testObstacle.spriteX > 0 &&
          testObstacle.spriteX < this.width - testObstacle.width &&
          testObstacle.collisionY > this.topMargin + margin &&
          testObstacle.collisionY < this.height - margin
        ) {
          this.obstacles.push(testObstacle);
        }
        atempts++;
      }
    }
  }
  const game = new Game(canvas);
  game.init();
  console.log(game);
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0);
});
