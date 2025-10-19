Nkunga Jordan

## EsportEvoBackend

# structure du projet

server.js --> Démarre le serveur
.env --> Variables d'environnement / secrets
src/
├─ app.js --> Configure express, middlewares, routes
├─ config/
│ └─ database.js --> Connexion Sequelize / MySQL
├─ routes/
│ └─ index.js --> Déclaration des routes API
├─ controllers/ --> Logique métier
├─ models/ --> Définition des tables Sequelize
└─ middleware/ --> Auth, validation, etc.
