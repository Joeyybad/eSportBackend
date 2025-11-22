Nkunga Jordan

## EsportEvoBackend

# Choix technologie et structure

Environnement : Nodejs NPM
Architecture : MVC => models + classe domain, Controllers, et vue (Front React)
Framework back-end: Expressjs
ORM : Sequelize
Base de donnée : SQL

Pourquoi ?
Etant donnée que je ne connaissais pas React, le framework front le plus connu/utilisé c'est la raison principale de mon choix je me devais d'essayer plutôt que me cantonner à vuejs

Le choix de l'architecture MVC semble la plus approprié surtout avec l'utilisation de la POO c'est une solution qui permet une maintenabilité sereine dans la mesure ou les rôles sont bien séparé. J'ai principalement travaillé en procédural avec le JS donc ça m'a permis de voir à quoi ça ressemble ( vu le MVC POO avec java springboot).

Express Sequelize et SQL je connaissais déjà et vu que je manquais de temps ( congé paternité ) et que j'expérimentais react je ne pouvais pas me permettre de rajouter d'autres nouveauté ( TS, Next etc )

j'ai réalisé le projet en procédural je me suis inspiré des travaux que j'ai déjà fait notamment pour le système d'authentification et une fois fait j'ai migré pour la POO avec injection de dépendance.

# structure du projet

npm start --> Démarre le serveur (nodemon)

.env --> Variables d'environnement / secrets
readme.md
server.js
src/
├─ app.js --> Configure express, middlewares, routes
|_ di.js --> dépendance injection
├─ config/
│ └─ database.js --> Connexion Sequelize / MySQL
| |_ multer-config.js --> gestion des images
|_domain
├─ routes/
│ └─ index.js --> Déclaration des routes API
├─ controllers/ --> récupèrent le service
|_ jobs/
| |_ UpdateMatchStatus.js --> job mise à jour des statuts des matchs
├─ models/ --> Définition des tables Sequelize
└─ middleware/ --> Auth, validation, errorHandler.
|\_Services --> Logique métier
|\_Validators --> Middlewares de validations spécifiques
|_ uploads/
|\_ fichiers image

<!-- flux complet:

Front React -> requête CRUD -> middleware express-validator -> Controller methods -> Sequelize methods -> DB ->

-->

## Remarque sur certaines fonctionnalités

Les méthodes de Service Controller accompagné d'un \* sont des fonctions non finie car pas determinante pour l'énoncer/ la demande
Fonctionnalité contact non finie
Fonctionnalité de modification et suppression d'équipe non faite récupération individuelles des équipes non faites accès à la liste des équipes que par l'admin (à changer)

Mot de passe défini 8 "MonMdp123!" convient très bien pour les tests mais sinon 14 caractères selon les recommandations
