FROM node:20-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (ignore les devDependencies)
RUN npm install --omit=dev

# Copier le reste des fichiers du bot
COPY . .

# Port à exposer (Doit matcher celui de l'app)
EXPOSE 8999

# Commande de démarrage
CMD ["npm", "start"]
