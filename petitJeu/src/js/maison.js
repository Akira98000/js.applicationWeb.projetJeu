export const config_mur = {
  epaisseurMur: 10,
  largeurPorte: 100,
  hauteurPorte: 100
};

// FONCTION POUR CREER UNE PORTE
function creerPorte(x, y, horizontal = true) {
  return {
    x: x,
    y: y,
    width: horizontal ? config_mur.largeurPorte : config_mur.epaisseurMur,
    height: horizontal ? config_mur.epaisseurMur : config_mur.hauteurPorte
  };
}

// FONCTION POUR CREER UN MUR
function creerMur(x, y, longueur, horizontal = true) {
  return {
    x: x,
    y: y,
    width: horizontal ? longueur : config_mur.epaisseurMur,
    height: horizontal ? config_mur.epaisseurMur : longueur
  };
}

export function genererMaison(canvas) {
  const largeur = canvas.width;
  const hauteur = canvas.height;
  const milieuX = largeur / 2;
  const milieuY = hauteur / 2;

  // MUR EXTERIEUR : HAUT, BAS, GAUCHE, DROITE
  const mursExterieurs = [
    creerMur(0, 0, largeur), 
    creerMur(0, hauteur - config_mur.epaisseurMur, largeur), 
    creerMur(0, 0, hauteur, false),
    creerMur(largeur - config_mur.epaisseurMur, 0, hauteur, false) 
  ];

  // FONCTION POUR RECUPERER LA POSITION D'UNE PORTE ALEATOIRE
  function getPositionPorteAleatoire(debut, fin, horizontal) {
    let espace;
    if (horizontal) {
        espace = config_mur.largeurPorte;
    } else {
        espace = config_mur.hauteurPorte;
    }
    return Math.random() * (fin - debut - espace) + debut;
  }

  // POSITION DES PORTES QUI SERONT ALEATOIRE DANS LES MURS INTERIEURS UNIQUEMENT 
  const porteHautY = getPositionPorteAleatoire(config_mur.epaisseurMur, milieuY - config_mur.hauteurPorte, false);
  const porteBasY = getPositionPorteAleatoire(milieuY, hauteur - config_mur.epaisseurMur - config_mur.hauteurPorte, false);
  const porteGaucheX = getPositionPorteAleatoire(config_mur.epaisseurMur, milieuX - config_mur.largeurPorte, true);
  const porteDroiteX = getPositionPorteAleatoire(milieuX, largeur - config_mur.epaisseurMur - config_mur.largeurPorte, true);

  const mursInterieurs = [
    // MUR VERTICAL - PARTIE HAUTE
    creerMur(milieuX, 0, porteHautY, false),
    
    // MUR VERTICAL - PARTIE ENTRE LES PORTE
    creerMur(milieuX, porteHautY + config_mur.hauteurPorte, milieuY - (porteHautY + config_mur.hauteurPorte), false),
    
    // MUR VERTICAL - PARTIE BASSE
    creerMur(milieuX, milieuY, porteBasY - milieuY, false),
    creerMur(milieuX, porteBasY + config_mur.hauteurPorte, hauteur - (porteBasY + config_mur.hauteurPorte), false),

    // MUR HORIZONTAL - PARTIE GAUCHE
    creerMur(0, milieuY, porteGaucheX),
    creerMur(porteGaucheX + config_mur.largeurPorte, milieuY, milieuX - (porteGaucheX + config_mur.largeurPorte)),

    // MUR HORIZONTAL - PARTIE DROITE
    creerMur(milieuX, milieuY, porteDroiteX - milieuX),
    creerMur(porteDroiteX + config_mur.largeurPorte, milieuY, largeur - (porteDroiteX + config_mur.largeurPorte))
  ];


  // CREATION DES PORTE
  const portes = [
    creerPorte(milieuX, porteHautY, false),     
    creerPorte(milieuX, porteBasY, false),      
    creerPorte(porteGaucheX, milieuY),           
    creerPorte(porteDroiteX, milieuY)           
  ];


  const pieces = {
    topLeft: {
      name: "Salon",
      xMin: config_mur.epaisseurMur,
      xMax: milieuX,
      yMin: config_mur.epaisseurMur,
      yMax: milieuY
    },
    topRight: {
      name: "Chambre",
      xMin: milieuX,
      xMax: largeur - config_mur.epaisseurMur,
      yMin: config_mur.epaisseurMur,
      yMax: milieuY
    },
    bottomLeft: {
      name: "Cuisine",
      xMin: config_mur.epaisseurMur,
      xMax: milieuX,
      yMin: milieuY,
      yMax: hauteur - config_mur.epaisseurMur
    },
    bottomRight: {
      name: "Salle de bain",
      xMin: milieuX,
      xMax: largeur - config_mur.epaisseurMur,
      yMin: milieuY,
      yMax: hauteur - config_mur.epaisseurMur
    }
  };

  return {
    collisionWalls: [...mursExterieurs, ...mursInterieurs],
    doors: portes,
    rooms: pieces
  };
}

// FONCTION POUR RECUPERER LA PIÈCE ACTUELLE
export function getCurrentRoomName(player, rooms) {
  const x = player.x + player.width / 2;
  const y = player.y + player.height / 2;
  
  for (const key in rooms) {
    const piece = rooms[key];
    if (x >= piece.xMin && x <= piece.xMax && 
        y >= piece.yMin && y <= piece.yMax) {
      return piece.name;
    }
  }
  return "Je ne sais pas où je suis :)";
} 