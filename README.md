# Bonjour Julien! 👋

Voici notre rendu de projet YamMaster. Nous sommes Maxime BAUDOIN et Antonin SIMON, et nous avons développé ce projet à deux.
Nous avons réalisé la majeure partie du projet chacun de notre côté, et nous avons finalement rassemblé notre travail sur ce repo ! 🌟

## 📁 Contenu du Repo

### 1. `APPLICATION MOBILE` 🛠️

L'application mobile est développée en React Native, tout son contenu se trouve dans ce repository.
Pour la tester, tu peux suivre les étapes suivantes :

1. Posséder une version stable et à jour de [Node.js](https://nodejs.org/)
2. Cloner le projet avec la commande `git clone https://github.com/maximebaudoin/YamMaster.git`
3. Se placer dans le dossier du projet `cd YamMaster`
4. Installer les paquets avec la commande `npm install`
5. Lancer le serveur Expo avec `npx expo start`
6. (Optionnel) Pour une meilleure expérience mobile, il peut être intéressant de passer par l'application mobile [Expo](https://expo.io/), parfaite pour tester cette application ! ✨
7. ⚠️ Modifier le fichier `app/contexts/socket.context.js` en modifiant l'adresse IP par votre IP locale, cela permet à l'application de se connecter avec le backend sur un autre appareil dans le même réseau local

### 2. `SERVEUR WEB SOCKET` 🚀

Le serveur web socket se trouve dans le dossier `backend` 📁

Voici les étapes à suivre pour le mettre en route :

1. Se rendre dans le dossier du serveur `cd backend/`
2. Installer les paquets avec la commande `npm install`
3. Lancer le serveur avec la commande `npm start`


### 3. `API` 🌐

Pour accompagner cela, nous avons décidé de monter un serveur Next.js et d'y héberger une API. 👀
L'API est utilisée pour gérer l'authentification des utilisateurs et sauvegarder les parties jouées. 🙌
Cette partie ne faisant pas l'objet de ce module, nous n'avons pas mis en place de politiques de sécurité. Notre base de données ne contient pas de données sensibles, il s'agit d'un serveur et d'une base de données de développement uniquement.

Nous avons utilisé une base de données en NoSQL avec [MongoDB](https://www.mongodb.com/fr-fr) et développé une API en Next.JS (https://nextjs.org).

Tu peux retrouver notre travail [🔗 ici](https://github.com/antonin187/YamMasterAPI.git)

Pour lancer le projet, il est important de suivre ces étapes :

1. Cloner le projet avec la commande `git clone https://github.com/antonin187/YamMasterAPI.git`
2. Se rendre dans le dossier du projet `cd YamMasterAPI/`
3. Installer les packages NodeJS via la commande `npm install`
4. Lancer le serveur avec la commande `npm run dev`

Pour une meilleure utilisation, nous avons hébergé notre API grâce à Vercel !

La documentation est disponible à l'URL : [🔗 https://yam-master-api.vercel.app/swagger](https://yam-master-api.vercel.app/swagger)

## Remerciements 🙏

Merci, Julien, pour avoir pris le temps de te plonger dans notre travail. Le module était super intéressant, d'autant plus que le JS est un langage que nous affectionnons tout particulièrement.

Merci encore! 🤝
