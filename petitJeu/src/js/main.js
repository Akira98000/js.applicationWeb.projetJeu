import Player from './Joueur.js';
import { getCurrentRoomName } from './maison.js';
import { LevelManager } from './level.js';
import ObjectAnimator from './ObjectAnimator.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerImage = new Image();
const keys = {}; 
const player = new Player(10, 10, 50, 50, 3); // POSITION (X, Y), TAILLE (WIDTH, HEIGHT), VITESSE
const levelManager = new LevelManager(canvas); // INITIALISATION DU GESTIONNAIRE DE NIVEAUX
const animator = new ObjectAnimator();
let solde = 0; // INITIALISATION DU SOLDE
let lastResetTime = 0; // INITIALISATION DU TEMPS DE RESET 

// IMAGE DU JOUEUR
playerImage.src = 'src/img/voleur.png';   
window.addEventListener("keydown", (e) => { keys[e.key] = true; });
window.addEventListener("keyup", (e) => { keys[e.key] = false; });

// INITIALISATION DU JOUEUR
player.draw = function(ctx) {
  ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
};

// FONCTION : MAJ DU SOLDE AVEC ANIMATION
function updateSolde(montant) {
  const oldSolde = solde;
  solde += montant;
  animator.addAnimation(
    { value: oldSolde },
    'value',
    oldSolde,
    solde,
    1000,
    'easeOut'
  );
}

// FONCTION : AFFICHAGE DU SOLDE
function updateSoldeDisplay(value) {
  document.getElementById('solde-info').textContent = `Solde : ${Math.round(value).toLocaleString()} €`;
}

// FONCTION : RESET DU JOUEUR
function resetPlayer() {
  player.x = 10;
  player.y = 10;
  for (let k in keys) {
    keys[k] = false;
  }
  lastResetTime = Date.now();
}

// FONCTION : GESTION DES ENTRÉES DU JOUEUR
function handleInput() {
  player.vx = 0;
  player.vy = 0;
  if (keys["ArrowUp"] || keys["z"]) {
    player.vy = -player.speed;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.vy = player.speed;
  }
  if (keys["ArrowLeft"] || keys["q"]) {
    player.vx = -player.speed;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.vx = player.speed;
  }
}

// FONCTION : DÉTECTION DE COLLISION (RECTANGLES)
function isColliding(a, b) {
  if (a.x >= b.x + b.width) {
    return false;
  }
  if (a.x + a.width <= b.x) {
    return false;
  }
  if (a.y >= b.y + b.height) {
    return false;
  }
  if (a.y + a.height <= b.y) {
    return false;
  }
  
  return true;
}

// FONCTION : BOUCLE DE RENDU
function gameLoop() {
  handleInput();
  
  const oldX = player.x;
  const oldY = player.y;
  player.update(canvas);
  levelManager.agent.forEach(a => a.update());
  animator.update(); // Mise à jour des animations
  
  // COLLISION AVEC LES MURS
  for (const wall of levelManager.collisionWalls) {
    if (isColliding(player, wall)) {
      player.x = oldX;
      player.y = oldY;
      break;
    }
  }
  
  levelManager.cles.forEach(cle => {
    if (!cle.collected && isColliding(player, cle)) {
      cle.collected = true;
      updateSolde(1000000); // A CHAQUE CLÉ COLLECTÉE, JE GAGNE 1.000.000 €
    }
  });
  
  // VERIFICATION DE LA PORTE DE SORTIE : SI TOUTES LES CLÉS SONT COLLECTÉES, LA PORTE EST OUVERTE
  if (levelManager.areAllKeysCollected()) {
    levelManager.porte.unlocked = true;
  }
  if (isColliding(player, levelManager.porte) && levelManager.porte.unlocked && !levelManager.porte.opened) {
    const currentLevel = levelManager.getCurrentLevelInfo();
    alert(`Félicitations, vous avez quitté la maison ! Vous avez gagné le niveau ${currentLevel.name} !`);
    levelManager.porte.opened = true;
    levelManager.nextLevel();
    resetPlayer(); 
    requestAnimationFrame(gameLoop); 
    return;
  }
  
  // DETECTION SI UN GARDE REPERE LE JOUEUR
  for (const a of levelManager.agent) {
    if (a.sees(player)) {
      levelManager.resetLevel();
      alert("Vous avez été repéré ! Le niveau redémarre.");
      updateSolde(-500000); // SI JE PERDS, JE PERDS 500.000 €
      resetPlayer();
      requestAnimationFrame(gameLoop);
      return;
    }
  }

  // RENDU
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#334";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "grey";
  levelManager.collisionWalls.forEach(wall => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });
  
  ctx.fillStyle = "transparent";
  levelManager.doors.forEach(door => {
    ctx.fillRect(door.x, door.y, door.width, door.height);
  });
  
  levelManager.cles.forEach(cle => cle.draw(ctx));
  levelManager.porte.draw(ctx);
  levelManager.agent.forEach(a => a.draw(ctx));
  player.draw(ctx);
  
  // MAJ DES INFOS 
  const currentRoomName = getCurrentRoomName(player, levelManager.rooms);
  const currentLevel = levelManager.getCurrentLevelInfo();
  document.getElementById('position-info').textContent = `Position : ${currentRoomName}`;
  document.getElementById('level-info').textContent = `Niveau : ${currentLevel.name}`;
  
  // Mise à jour de l'affichage du solde avec animation
  for (const [obj, props] of animator.animations) {
    if (obj.hasOwnProperty('value')) {
      updateSoldeDisplay(obj.value);
    }
  }
  
  requestAnimationFrame(gameLoop);
}

// INITIALISATION DU NIVEAU + BOUCLE DE RENDU +CHARGEMENT DES IMAGES
Promise.all([
  new Promise(resolve => { playerImage.onload = resolve; })
]).then(() => {
  levelManager.initLevel(0);
  gameLoop();
});