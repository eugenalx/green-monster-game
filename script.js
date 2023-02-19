window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    ctx.fillStyle = '#fff234';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    class Player {
        constructor(game){
                this.game = game;
                this.collisionX = this.game.width / 2;
                this.collisionY = this.game.height / 2;
                this.collisionRadius = 30;
                this.speedX = 0;
                this.speedY = 0;
        }
        draw(context){
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX, this. collisionY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }
        update(){
            this.speedX = this.game.mouse.x - this.collisionX;
            this.speedY = this.game.mouse.y - this.collisionY;

            this.collisionX += this.speedX;
            this.collisionY += this.speedY;
        }
    }

    class Game {
        constructor(canvas){
            this.canvas  = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player= new Player(this); 
            this.mouse = {
                x: this.width / 2,
                y: this.height / 2,
                pressed: false,
            }
            //event listeners
            window.addEventListener('mousedown', (event) => {
                this.mouse.x = event.offsetX;
                this.mouse.y = event.offsetY;
                this.mouse.pressed = true;
            })
            window.addEventListener('mouseup', (event) => {
                this.mouse.x = event.offsetX;
                this.mouse.y = event.offsetY;
                this.mouse.pressed = false;
            })
            window.addEventListener('mousemove', (event) => {
                this.mouse.x = event.offsetX;
                this.mouse.y = event.offsetY;
                console.log(this.mouse.x)
            })
        }
        render(context){
            this.player.draw(context);
            this.player.update();
        }
    }
    const game = new Game(canvas);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }

    animate();
});