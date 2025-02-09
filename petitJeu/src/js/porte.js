const DoorImage = new Image();
DoorImage.src = 'src/img/door.png';

export default class Porte { // SORTIE DE LA PIÈCE  
  constructor(x, y, width, height, roomName) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.roomName = roomName; 
    this.unlocked = false;
    this.opened = false;
  }
  
  draw(ctx) {
    ctx.drawImage(DoorImage, this.x, this.y, this.width, this.height);
  }
} 