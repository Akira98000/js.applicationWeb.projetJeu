const agentImage = new Image();
agentImage.src = 'src/img/agent.png';

export function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default class Agent {
  constructor(x, y, radius, visionRange, room) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.visionRange = visionRange;
    this.room = room;
    this.direction = Math.random() * Math.PI * 2;
    this.speed = 1;
  }
  
  update() {
    // MOUVEMENT DE L'AGENT
    this.direction += randomInRange(-0.1, 0.1);
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    
    // POUR EVITER QUE L'AGENT NE SORTIE DE LA PIÈCE
    if (this.x < this.room.xMin) {
      this.x = this.room.xMin;
      this.direction = 0;
    }
    if (this.x > this.room.xMax) {
      this.x = this.room.xMax;
      this.direction = Math.PI;
    }
    if (this.y < this.room.yMin) {
      this.y = this.room.yMin;
      this.direction = Math.PI / 2;
    }
    if (this.y > this.room.yMax) {
      this.y = this.room.yMax;
      this.direction = -Math.PI / 2;
    }
  }
  
  draw(ctx) {
    // AGENT
    ctx.drawImage(agentImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    
    // CHAMP DE VISION
    ctx.fillStyle = "rgba(255, 50, 100, 0.4)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.visionRange, 0, Math.PI * 2);
    ctx.fill();
  }
  
  sees(player) {
    // SI LE JOUEUR EST DANS LE CHAMP DE VISION DE L'AGENT
    const dx = (player.x + player.width/2) - this.x;
    const dy = (player.y + player.height/2) - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.visionRange;
  }
} 