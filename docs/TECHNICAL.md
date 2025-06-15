# 🚀 Documentation Technique – MediConnect

---

## 🏗️ Architecture Système

### Vue d'ensemble
MediConnect repose sur une architecture microservices moderne, scalable et sécurisée, combinant :
- Serveurs Orthanc locaux (hôpitaux)
- Serveur central (synchronisation, web, IA)
- Cloud sécurisé (archivage, partage)

### Stack Technologique
- **Frontend** : React, Redux Toolkit, Material-UI, React Router, Axios, Jest
- **Backend** : Node.js, Express, MongoDB, Mongoose, JWT, OAuth2, Redis, Swagger
- **IA** : TensorFlow/PyTorch (prédiction, diagnostic)
- **Sécurité** : HTTPS, OAuth2, AES-256, 2FA

---

## ✨ Fonctionnalités principales

### 👥 Gestion des patients
- 🔐 Inscription (assistants ou auto-inscription, validation 2FA)
- 📁 Accès dossiers médicaux selon droits
- 📊 Suivi en temps réel (consultations, examens, traitements)
- 💊 Prescriptions électroniques
- 📅 Prise de rendez-vous synchronisée

### 🏥 Intégration Orthanc
- 📦 Stockage, récupération, partage DICOM
- 🌐 Connexion serveurs locaux/central

### 🏨 Télé-radiologie & services hospitaliers
- 🏢 Centralisation multi-hôpitaux
- 🔗 Partage sécurisé, visualisation à distance

### 🤖 Module IA
- 🩺 Assistance : Discussion avec le patient pour le guider
- 📈 Prédiction, diagnostic assisté, visualisation avancée (rendu 3D)

### 🔒 Sécurité & accessibilité
- 🛡️ Authentification multi-facteurs (2FA), chiffrement
- 👥 Gestion fine des rôles (super admin, admin hôpital, médecin, assistant, patient, chercheur)
- ☁️ Archivage cloud sécurisé, conformité RGPD/HIPAA

---

## 🖥️ Interface utilisateur
- 🏠 Tableau de bord patient : dossier, rendez-vous, prescriptions
- 👨‍⚕️ Espace médecin : gestion patients, prescriptions, visualisation 3D
- 🏥 Télé-radiologie : partage, annotation d'images
- 🤖 Outils IA : prédiction/diagnostic, explications visuelles
- 🛠️ Administration : gestion utilisateurs et accès

---

## 👤 Acteurs & rôles
- 🛡️ **Super Administrateurs** : gestion comptes hôpitaux, supervision Orthanc central
- 🛡️ **Administrateurs hospitaliers** : gestion comptes locaux, supervision Orthanc local
- 👨‍⚕️ **Médecins** : gestion dossiers, prescriptions, accès restreint à leurs patients
- 🧑‍💼 **Assistants médicaux** : création dossiers patients, gestion rendez-vous/agenda
- 🧑‍🔬 **Chercheurs** : accès données anonymisées, outils IA
- 🧑 **Patients** : consultation dossier, rendez-vous, discussion avec assistant IA

---

## 🔒 Sécurité avancée
- **Double authentification (2FA)** : SMS, email, app mobile, clé physique
- **Chiffrement** : bout en bout, stockage sécurisé
- **Audit** : traçabilité, alertes, conformité RGPD
- **RBAC** : contrôle d'accès par rôle

---

## ⚡ Installation & déploiement

### Prérequis
- Node.js ≥ 14.x
- npm ≥ 6.x
- MongoDB ≥ 4.x
- Git

### Installation automatique
```bash
chmod +x setup.sh
./setup.sh
```
Ce script :
- Vérifie les prérequis
- Installe les dépendances frontend/backend
- Configure les fichiers d'environnement
- Démarre MongoDB
- Initialise la base de données
- Démarre les serveurs

### Comptes par défaut (dev)
- 👨‍⚕️ Médecin : medecin@doctolib.com / Medecin123!
- 🧑‍💼 Assistant : assistant@doctolib.com / Assistant123!
- 🧑 Patient : patient@doctolib.com / Patient123!

> ⚠️ Changez les mots de passe après la première connexion et désactivez ces comptes en production.

### Installation manuelle
1. Cloner le repo, installer les dépendances dans frontend/ et backend/
2. Configurer les .env
3. Initialiser la base (npm run init-db)
4. Lancer backend (npm run dev) et frontend (npm start)

---

## 🩻 Gestion des images médicales (DICOM)
- **Upload** : réservé aux médecins, contrôle des droits
- **Consultation** : patients accèdent uniquement à leurs images
- **Viewer intégré** : OHIF viewer, outils d'analyse (médecins/chercheurs), version simplifiée pour patients
- **Stockage** : distribué, chiffré, sauvegarde automatique
- **Export** : multi-format (médecins)

---

## 🤖 Intelligence Artificielle
- **Assistance IA** : chatbot médical pour guider le patient
- **Prédiction** : créneaux optimaux, détection d'urgences, recommandation de spécialistes
- **Diagnostic assisté** : suggestions sur images DICOM et données cliniques
- **Détection d'anomalies** : fraudes, tendances, alertes automatiques

---

## 🛡️ Bonnes pratiques & conformité
- **Sécurité** : 2FA, chiffrement, audit, RBAC
- **Conformité** : RGPD, normes médicales, traçabilité

- **Mises à jour** : sécurité auto, versioning, changelog, rollback

---

## 👨‍💻 Développeurs
- **Abdoulaye Lah** — Master Génie Logiciel & SI, ESP
- **Oumar Yoro Diouf** — Master Génie Logiciel & SI, ESP
- **Maman Nafy Ndiaye** — Master Génie Logiciel & SI, ESP
- **Ndeye Bounama Dieng** — Master Service Réseau & Télécom, ESP

---

**MediConnect : la santé connectée, intelligente et sécurisée !**

