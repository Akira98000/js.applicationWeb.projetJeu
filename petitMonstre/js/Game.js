export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        // Initialisation des propriétés pour le mouvement
        this.x = 100;
        this.y = 100; // Ajout de la position y
        this.speed = 5; // Vitesse de déplacement
        this.keys = { // Suivi des touches pressées
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        console.log("Game initialisé");
        // Ajout des écouteurs d'événements pour les touches
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    start() {
        console.log("Game démarré");

        // on dessine un rectangle rouge (la couleur = syntaxe CSS)
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(10, 10, 100, 100);

        // on dessine un rectangle vert
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(120, 10, 150, 10);
        this.ctx.fillRect(120, 100, 10, 150);

        // utilsation de la fonction drawCircleImmediat
        this.drawCircleImmediat(500, 200, 200, "blue");

        // un rectangle en fil de fer, on remplac "fill" par "stroke"
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(10, 120, 100, 100);

        // un arc de cercle, nous ne sommes plus en mode "direct"
        // mais en mode "bufferise" ou comme le nomme l'API
        // en mode "path"

        this.ctx.beginPath();
        this.ctx.arc(200, 200, 50, 0, Math.PI * 2);
        // un autre cercle plus petit, mais de 0 à PI seulement 
        this.ctx.arc(500, 200, 40, 0, Math.PI);

        // Pour ordonner le dessin, utilise la méthode
        // ctx.fill() ou ctx.stroke() qui dessineront tout
        // ce qui est bufferise (c'est à dire "dans le path/chemin");
        this.ctx.fill();
        this.ctx.stroke();

        // Même exemple mais avec deux cercles "bien séparés", pour cela
        // il faut utiliser beginPath() pour "vider" le path entre
        // les deux dessins
        this.ctx.fillStyle = "yellow";

        this.ctx.beginPath();
        this.ctx.arc(200, 100, 50, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(500, 400, 40, 0, Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.stroke();

        // dessine le monstre (le joueur)
        this.drawMonstre(this.x, this.y);

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        this.drawMonstre(this.x, this.y);

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    update() {
        // Mise à jour de la position du monstre en fonction des touches pressées
        if (this.keys.ArrowUp) this.y -= this.speed;
        if (this.keys.ArrowDown) this.y += this.speed;
        if (this.keys.ArrowLeft) this.x -= this.speed;
        if (this.keys.ArrowRight) this.x += this.speed;

        // Limiter le monstre à l'intérieur des limites du canvas
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - 100));
        this.y = Math.max(0, Math.min(this.y, this.canvas.height - 200));
    }

    handleKeyDown(e) {
        if (e.key in this.keys) {
            this.keys[e.key] = true;
        }
    }

    handleKeyUp(e) {
        if (e.key in this.keys) {
            this.keys[e.key] = false;
        }
    }

    drawCircleImmediat(x, y, r, color) {
        // BONNE PRATIQUE : on sauvegarde le contexte
        // des qu'une fonction ou un bout de code le modifie
        // couleur, épaisseur du trait, systeme de coordonnées etc.
        this.ctx.save();

        // AUTRE BONNE PRATIQUE : on dessine toujours
        // en 0, 0 !!!! et on utilise les transformations
        // géométriques pour placer le dessin, le tourner, le rescaler
        // etc.
        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        // on translate le systeme de coordonnées pour placer le cercle
        // en x, y
        this.ctx.translate(x, y);     
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();

        // on restore le contexte à la fin
        this.ctx.restore();
    }

    drawGrid(nbLignes, nbColonnes, couleur, largeurLignes) {
        // dessine une grille de lignes verticales et horizontales
        // de couleur couleur
        this.ctx.save();

        this.ctx.strokeStyle = couleur;
        this.ctx.lineWidth = largeurLignes;

        let largeurColonnes = this.canvas.width / nbColonnes;
        let hauteurLignes = this.canvas.height / nbLignes;

        this.ctx.beginPath();

        for (let i = 1; i < nbColonnes; i++) {
            this.ctx.moveTo(i * largeurColonnes, 0);
            this.ctx.lineTo(i * largeurColonnes, this.canvas.height);
        }

        for (let i = 1; i < nbLignes; i++) {
            this.ctx.moveTo(0, i * hauteurLignes);
            this.ctx.lineTo(this.canvas.width, i * hauteurLignes);
        }

        this.ctx.stroke();

        this.ctx.restore();
    }

    drawMonstre(x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);

        // TETE
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 0, 100, 100);

        // CORPS
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(0, 100, 100, 100);

        // YEUX (SANS PUPILLES)
        this.drawCircleImmediat(30, 30, 10, "white"); 
        this.drawCircleImmediat(70, 30, 10, "white");
        
        // PUPILLES
        this.drawCircleImmediat(30, 30, 5, "black");  
        this.drawCircleImmediat(70, 30, 5, "black"); 

        // RECTANGLE BLANC YEUX
        this.ctx.fillStyle = "white";
        this.drawCircleImmediat(50, 15, 5,10,"white");
        //this.ctx.fillRect(40, 5, 20, 10); 

        // OREILLES
        this.drawOreilleGauche(); 
        this.drawOreilleDroite(); 

        // CHAPEAU
        this.drawChapeau();

        // BOUCHE
        this.drawBouche(); 

        // MOUSTACHE
        this.drawMoustache(); 

        // BRAS MONSTRE
        this.drawBrasGauche();
        this.drawBrasDroit();

        // PIED MONSTRE
        this.drawPiedGauche();
        this.drawPiedDroit();  

        // PIED DRAPEAU
        this.drawPiedDrapeau();

        // DRAPEAU
        this.drawDrapeau();

        // restore
        this.ctx.restore();
    }

    /* OREILLE GAUCHE */
    drawOreilleGauche() {
        this.ctx.save();
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(-5, 5, 5, 30); 

        this.ctx.restore();
    }

    /* OREILLE DROITE */
    drawOreilleDroite() {
        this.ctx.save();
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(100, 5, 5, 30); 

        this.ctx.restore();
    }

    /* MOUSTACHE */
    drawMoustache() {
        this.ctx.save();
        this.ctx.translate(50, 50); 
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-15, 0, 30, 10); 
        this.ctx.restore();
    }

    /* BOUCHE */
    drawBouche() {
        this.ctx.save();
        this.ctx.translate(50, 60); 
        this.ctx.fillStyle = "red"; 
        this.ctx.fillRect(-25, 0, 50, 15); 
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.restore();
    }

    /* PIED GAUCHE */
    drawPiedGauche() {
        this.ctx.save();
        this.ctx.translate(0, 100); 
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(-25, 100, 50, 10);
        this.ctx.restore();
    }

    /* DRAPEAU */
    drawPiedDrapeau() {
        this.ctx.save();
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(150,110, 10, -150);
        this.ctx.restore();
    }

    drawDrapeau() {
        this.drawDrapeauBleu();
        this.drawDrapeauBlanc();
        this.drawDrapeauRouge();

    }

    drawDrapeauBleu() {
        this.ctx.save();
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(160, 70, 50, -100);
        this.ctx.restore();
    }

    drawDrapeauBlanc() {
        this.ctx.save();
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(210, 70, 50, -100);
        this.ctx.restore();
    }

    drawDrapeauRouge() {
        this.ctx.save();
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(260, 70, 50, -100);
        this.ctx.restore();
    }

    /* PIED DROIT */
    drawPiedDroit() {
        this.ctx.save();
        this.ctx.translate(100, 100); 
        this.ctx.fillStyle = "black"; 
        this.ctx.fillRect(-25, 100, 50, 10); 
        this.ctx.restore();
    }

    /* BRAS GAUCHE */
    drawBrasGauche() {
        this.ctx.save();
        this.ctx.translate(0, 50);
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(-50, 50, 50, 10);
        this.ctx.restore();
    }


    /* BRAS DROIT */
    drawBrasDroit() {
        this.ctx.save();
        this.ctx.translate(100, 50);
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(0, 50, 50, 10);
        this.ctx.restore();
    }

    /* CHAPEAU */
    drawChapeau() {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(30, -10, 40, 10);
        this.ctx.fillRect(40, -30, 20, 20);
        this.ctx.restore();
    }

}