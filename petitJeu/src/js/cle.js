const keyImage = new Image();
keyImage.src = 'src/img/cle.png';

export default class Cle {
  constructor(x, y, width, height, roomName) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.roomName = roomName;
    this.collected = false;
  }
  
  draw(ctx) {
    if (!this.collected) {
      ctx.drawImage(keyImage, this.x, this.y, this.width, this.height);
    }
  }
} 