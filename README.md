# 1 jour à la fois

## Statut : work in progress, not functional yet

🧠 Outil de planification quotidien conçu pour les personnes autistes, TDAH ou les deux.

## 🚀 Fonctionnalités principales

- Gestion des tâches avec niveau d'énergie
- Importation de to-do lists (Google Tasks, todo.txt, etc.)
- Suivi des tâches accomplies
- Export CSV
- Authentification sécurisée avec mot de passe hashé et JWT
- Réinitialisation de mot de passe par e-mail (Resend)
- Accessibilité conforme WCAG 2.1 AA
- Design sobre et fonctionnel inspiré du Bauhaus

## 🔧 Technologies utilisées

- Frontend : React + Vite
- Backend : Node.js + Express
- Auth : JWT + cookies sécurisés
- Base de données : (à intégrer)
- Emails : Resend
- CSS : Vanilla + responsive

## 🛠️ Démarrage du projet

### 🖥 Backend

```bash
cd backend/
npm install
npm start
```

### 🌐 Frontend

```bash
cd mon-planning-neuro/
npm install
npm run dev
```

## 🧪 Test des routes principales

- `/connexion` : page de connexion
- `/oubli-mdp` : demander un lien de réinitialisation
- `/reset/:token` : formulaire nouveau mot de passe
- `/dashboard` : route protégée (nécessite un cookie JWT)

## 📜 Licence

Projet personnel, librement utilisable pour usage non commercial. Contacte-moi si tu veux contribuer ou adapter !
