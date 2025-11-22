Nkunga Jordan

## EsportEvoBackend

# Etape pour mise en place

- Pré requis :

Node.js ≥ 18
npm ≥ 9
MySQL ≥ 8
Git

- Création de la base de donnée :

CREATE DATABASE esportevo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

.env pour la configuration

- Installation :

npm install dans le dossier du projet

- Lancement :
  npm start (nodemon)

le serveur se lance sur http://localhost:3000

# Choix technologie et structure

Environnement : Nodejs NPM
Architecture : MVC => models + classe domain, Controllers, et vue (Front React)
Framework back-end: Expressjs
ORM : Sequelize
Base de donnée : SQL

Pourquoi ?
Etant donnée que je ne connaissais pas React, le framework front le plus connu/utilisé c'est la raison principale de mon choix je me devais d'essayer plutôt que me cantonner à vuejs

Le choix de l'architecture MVC semble la plus approprié surtout avec l'utilisation de la POO c'est une solution qui permet une maintenabilité sereine dans la mesure ou les rôles sont bien séparé. J'ai principalement travaillé en procédural avec le JS donc ça m'a permis de voir à quoi ça ressemble ( vu le MVC POO avec java springboot).

Express Sequelize et SQL je connaissais déjà et vu que je manquais de temps ( congé paternité ) et que j'expérimentais react je ne pouvais pas me permettre de rajouter d'autres nouveauté ( TS, Next etc ) et avoir un rendu V0 suffisant.

j'ai commencé par réaliser le projet en procédural, je me suis inspiré des travaux que j'ai déjà fait notamment pour le système d'authentification et une fois fait j'ai migré pour la POO avec injection de dépendance.

# structure du projet

npm start --> Démarre le serveur (nodemon)

/EsportEvoBackend
│
├── server.js Point d’entrée du serveur (Express + DB + cron jobs)
├── .env Variables d’environnement (JWT, BDD…)
├── README.md Documentation du projet
│
└── src/
├── app.js Configuration d’Express, middlewares globaux, injection des routes
├── di.js Centralisation de la dépendance injection
│
├── config/
│ ├── database.js Connexion + configuration Sequelize
│ └── multer-config.js Upload d’images (avatar, logo, etc.)
│
├── domain/ Entités métiers
│ ├── User.js
│ ├── Team.js
│ ├── Match.js
│ ├── Tournament.js
│ └── Bet.js
│
├── models/ Modèles Sequelize (mapping DB SQL)
│ ├── userModel.js
│ ├── teamModel.js
│ ├── matchModel.js
│ ├── tournamentModel.js
│ ├── betModel.js
│ └── index.js Centralise les modèles + associations
│
├── services/ Logique métier
│ ├── UserService.js
│ ├── TeamService.js
│ ├── MatchService.js
│ ├── TournamentService.js
│ ├── BetService.js
│ └── ContactService.js
│
├── controllers/ Reçoivent la requête, appellent les services, renvoient la réponse
│ ├── userController.js
│ ├── teamController.js
│ ├── matchController.js
│ ├── tournamentController.js
│ ├── betController.js
│ └── contactController.js
│
├── routes/ Déclaration des routes + middlewares associés
│ ├── index.js Regroupe toutes les routes /api/\*
│ ├── userRoutes.js
│ ├── teamRoutes.js
│ ├── matchRoutes.js
│ ├── tournamentRoutes.js
│ ├── betRoutes.js
│ └── contactRoutes.js
│
├── middleware/ Middlewares globaux
│ ├── authMiddleware.js Vérification du token + rôles
│ ├── Validation.js Gestion express-validator
│ └── errorHandler.js Gestion des erreurs globales
│
├── validators/ Middlewares de validation spécifiques
│ ├── userValidator.js
│ ├── teamValidator.js
│ ├── matchValidator.js
│ ├── tournamentValidator.js
│ ├── betValidator.js
│ └── contactValidator.js
│
├── jobs/ Cron jobs automatiques
│ ├── updateMatchStatus.js Mise à jour du statut des matchs (scheduled → live → completed)
│ └── updateTournamentStatus.js (Mise à jour du statut des tournois)
│
└── uploads/ Dossier des images uploadées
└── (avatars, logos, etc.)

<!-- flux complet de l'app

React → Routes → Validators → Controller → Service → Sequelize → MySQL
      ← JSON Response ←
-->

## Remarque sur certaines fonctionnalités

Les méthodes de Service Controller accompagné d'un \* sont des fonctions non finie car pas determinante pour l'énoncer/ la demande
Fonctionnalité contact non finie
Fonctionnalité de modification et suppression d'équipe non faite récupération individuelles des équipes non faites accès à la liste des équipes que par l'admin (à changer)

Mot de passe défini 8 "MonMdp123!" convient très bien pour les tests mais sinon 14 caractères selon les recommandations
