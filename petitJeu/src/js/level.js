import { randomInRange } from './agent.js';
import Cle from './cle.js';
import Porte from './porte.js';
import Agent from './agent.js';
import { genererMaison } from './maison.js';

// CONFIGURATION DES NIVEAUX
export const LEVELS = [
  { name: "Facile", keyCount: 1, guardCount: 1 },
  { name: "Moyen", keyCount: 2, guardCount: 2 },
  { name: "Dur", keyCount: 5, guardCount: 5 },
  { name: "Impossible", keyCount: 7, guardCount: 7 }
];

// CLASSE POUR GERER LES NIVEAUX
export class LevelManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.currentLevel = 0;
    this.collisionWalls = [];
    this.rooms = {};
    this.cles = [];
    this.agent = [];
    this.porte = null;
    this.doors = [];
  }

  // INITIALISATION D'UN NIVEAU
  initLevel(levelIndex) {
    this.currentLevel = levelIndex;
    console.log("Initialisation du niveau : " + LEVELS[this.currentLevel].name);

    // GENERATION DE LA MAISON
    const maison = genererMaison(this.canvas);
    this.collisionWalls = maison.collisionWalls;
    this.doors = maison.doors;
    this.rooms = maison.rooms;

    // GENERATION DES CLES
    this.cles = [];
    const levelKeyCount = LEVELS[this.currentLevel].keyCount;
    for (const roomKey in this.rooms) {
      if (roomKey !== "bottomRight") {
        let room = this.rooms[roomKey];
        for (let i = 0; i < levelKeyCount; i++) {
          let k = new Cle(
            randomInRange(room.xMin + 10, room.xMax - 30),
            randomInRange(room.yMin + 10, room.yMax - 30),
            20,
            20,
            room.name
          );
          this.cles.push(k);
        }
      }
    }

    // GENERATION DE LA PORTE DE SORTIE
    const doorRoom = this.rooms.bottomRight;
    const porteWidth = 60;
    const porteHeight = 60;
    const porteX = doorRoom.xMax - porteWidth;
    const porteY = doorRoom.yMax - porteHeight;
    this.porte = new Porte(porteX, porteY, porteWidth, porteHeight, doorRoom.name);

    // GENERATION DES AGENTS
    this.agent = [];
    const levelGuardCount = LEVELS[this.currentLevel].guardCount;
    for (const roomKey in this.rooms) {
      let room = this.rooms[roomKey];
      for (let i = 0; i < levelGuardCount; i++) {
        this.agent.push(new Agent(
          randomInRange(room.xMin + 20, room.xMax - 20),
          randomInRange(room.yMin + 20, room.yMax - 20),
          20, 100, room
        ));
      }
    }
    console.log("Niveau actuel : " + LEVELS[this.currentLevel].name);
  }

  // PASSAGE AU NIVEAU SUIVANT
  nextLevel() {
    if (this.currentLevel < LEVELS.length - 1) {
      this.initLevel(this.currentLevel + 1);
      return true;
    } else {
      alert("Vous avez terminé tous les niveaux !");
      this.initLevel(0);
      return false;
    }
  }

  // REINITIALISATION DU NIVEAU ACTUEL
  resetLevel() {
    this.initLevel(this.currentLevel);
  }

  // VERIFICATION SI TOUTES LES CLES SONT COLLECTEES
  areAllKeysCollected() {
    return this.cles.filter(cle => cle.collected).length === this.cles.length;
  }

  // RECUPERATION DU NIVEAU ACTUEL
  getCurrentLevelInfo() {
    return LEVELS[this.currentLevel];
  }
} 