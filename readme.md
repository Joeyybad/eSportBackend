Nkunga Jordan

## EsportEvoBackend

# structure du projet

npm start --> Démarre le serveur (nodemon)
.env --> Variables d'environnement / secrets
server.js
src/
├─ app.js --> Configure express, middlewares, routes
├─ config/
│ └─ database.js --> Connexion Sequelize / MySQL
| |_ multer-config.js --> gestion des images
├─ routes/
│ └─ index.js --> Déclaration des routes API
├─ controllers/ --> Logique métier
|_ jobs/
| |_ UpdateMatchStatus.js --> job mise à jour des statuts des matchs
├─ models/ --> Définition des tables Sequelize
└─ middleware/ --> Auth, validation, etc.
|_ uploads/
|\_ fichiers image

<!-- flux complet:

Front React -> requête CRUD -> middleware express-validator -> Controller methods -> Sequelize methods -> DB ->
