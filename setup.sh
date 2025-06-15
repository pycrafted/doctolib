#!/bin/bash

echo "🚀 Installation de DoctoLib..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."; exit 1; }
command -v mongod >/dev/null 2>&1 || { echo "❌ MongoDB n'est pas installé. Veuillez l'installer d'abord."; exit 1; }

# Installation des dépendances
echo "📦 Installation des dépendances..."
cd frontend && npm install
cd ../backend && npm install

# Configuration de l'environnement
echo "⚙️ Configuration de l'environnement..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Démarrage de MongoDB
echo "🗄️ Démarrage de MongoDB..."
mongod --dbpath ./data/db &

# Initialisation de la base de données
echo "💾 Initialisation de la base de données..."
cd backend && npm run init-db

# Démarrage des serveurs
echo "🌐 Démarrage des serveurs..."
cd ../backend && npm run dev &
cd ../frontend && npm start &

echo "✅ Installation terminée!"
echo "
📝 Comptes par défaut créés:

👨‍⚕️ Médecin:
- Email: medecin@doctolib.com
- Mot de passe: Medecin123!

👨‍💼 Assistant:
- Email: assistant@doctolib.com
- Mot de passe: Assistant123!

👤 Patient:
- Email: patient@doctolib.com
- Mot de passe: Patient123!

⚠️ IMPORTANT: Changez ces mots de passe après la première connexion!
" 