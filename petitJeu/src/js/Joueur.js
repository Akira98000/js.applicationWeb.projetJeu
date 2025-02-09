import ObjetGraphique from './ObjetGraphique.js';

export default class Player extends ObjetGraphique {
  constructor(x, y, width, height, speed) { 
    super(x, y, width, height);
    this.speed = speed;
    this.vx = 0;
    this.vy = 0;
  }
  
  update(canvas) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
  }
  
  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
