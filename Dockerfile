# server/Dockerfile

# version légère de Node
FROM node:18-alpine

# Création du dossier de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances en premier 
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY . .

# Exposition du port 
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]