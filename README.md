# Projet Jeu - Application Web L3 MIAGE

##  Description
Projet de jeu développé dans le cadre du cours Application Web en L3 MIAGE. Le projet comprend deux jeux :
- **Le Petit Jeu** : Un jeu d'infiltration où le joueur doit collecter des clés tout en évitant les agents de sécurité
- **Le Petit Monstre** : Un monstre crée pendant le cours de CM pour comprendre le fonctionnement du canvas



##  Structure du Projet

- `index.html` : Page d'accueil permettant la sélection entre les deux jeux
- `asset/style.css` : Style CSS de la page d'accueil

### Le Petit Jeu (`petitJeu/`)
- `index.html` : Interface principale du jeu 
- `src/js/` : Dossier contenant la logique du jeu
  - `main.js` : Point d'entrée et initialisation du jeu
  - `Joueur.js` : Gestion du personnage jouable (déplacement, interaction avec les objets)
  - `ObjetGraphique.js` : Classe de base pour tous les objets du jeu
  - `agent.js` : Logique des agents de sécurité (champ de vision, déplacement)
  - `cle.js` : Gestion des clés à collecter 
  - `level.js` : Configuration et gestion des niveaux (facile, moyen, difficile,impossible)
  - `maison.js` : Gestion des éléments de décor (mur et porte invisible pour traverser)
  - `porte.js` : Gestion de la porte de sortie
- `src/css/style.css` : Style responsive du jeu d'infiltration

### Le Petit Monstre (`petitMonstre/`)
- `index.html` : Interface du monstre (canva)
- `css/style.css` : Style du monstre (css mise en place)
- `js/` : creation du monstre en lui meme 

##  Technologies Utilisées
- HTML5
- CSS
- JavaScript 

## Fonctionnalités
- Déplacement du personnage avec ZQSD ou les flèches directionnelles
- Collecte de clés
- Système de niveaux
- Détection des collisions
- Champ de vision des agents

## Liens
- Lien du site web pour jeter un coup d'oeil: https://akira98000.github.io/js.ApplicationWeb.projetJeu_num1/

## Auteur
**Akira Santhakumaran**
- GitHub: [@akira98000](https://github.com/akira98000)
- Projet réalisé dans le cadre du cours Application Web L3 MIAGE
 
