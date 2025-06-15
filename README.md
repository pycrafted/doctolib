# 🚀 MediConnect – Plateforme Web Médicale Sécurisée et Intelligente

---

## 🎯 Objectif

**MediConnect** est une plateforme web médicale moderne, intuitive et interopérable, conçue pour :
- Gérer les patients et centraliser toutes les données médicales (DICOM et non DICOM)
- Intégrer la télé-radiologie et l'intelligence artificielle (IA)
- S'appuyer sur une infrastructure hybride (serveurs Orthanc locaux + serveur central)
- Garantir la sécurité, la confidentialité et la conformité réglementaire

![Capture d'écran 2025-06-15 135839](https://github.com/user-attachments/assets/e88b0120-5b89-4878-a599-5f10ad5f2bed)

---

## ✨ Fonctionnalités principales

### 👥 Gestion des patients
- 🔐 **Inscription** : Création de comptes patients par assistants médicaux ou auto-inscription sécurisée (validation 2FA)
- 📁 **Consultation** : Accès aux dossiers médicaux selon les droits (médecins, patients)
- 📊 **Suivi** : Historique des consultations, examens et traitements en temps réel
- 💊 **Prescription médicale** : Génération et consultation de prescriptions électroniques
- 📅 **Prise de rendez-vous** : Planification en ligne, synchronisation des agendas

### 🏥 Intégration avec Orthanc
- 📦 Stockage, récupération et partage de fichiers DICOM
- 🌐 Connexion entre serveurs Orthanc locaux (hôpitaux) et serveur central

### 🏨 Services hospitaliers & télé-radiologie
- 🏢 Centralisation des données multi-hôpitaux
- 🔗 Plateforme de télé-radiologie : partage sécurisé et visualisation à distance

### 🤖 Module IA
- 🩺 **Assistance** : Discussion avec le patient pour le guider

![ia](https://github.com/user-attachments/assets/42769377-c522-4863-a8fa-51a82f7e5f5a)

### 🔒 Sécurité & accessibilité
- 🛡️ Authentification multi-facteurs (2FA), chiffrement des données
- 👥 Gestion fine des rôles et permissions (admin, médecins, assistants, patients, chercheurs)
- ☁️ Archivage cloud sécurisé, conforme RGPD/HIPAA

![double-authentification](https://github.com/user-attachments/assets/750796b1-4cf8-48b0-93ba-21ae04c4bfd4)

---

## 🏗️ Infrastructure technique

- **Serveurs Orthanc locaux** : Stockage et gestion locale des images DICOM
- **Serveur central** : Agrégation des données, hébergement de l'app web, synchronisation
- **Backend** : Node.js/Express (API RESTful)
- **Frontend** : React (expérience fluide et interactive)
- **Base de données** : MongoDB (métadonnées) + Orthanc (DICOM)
- **IA** : Modèles TensorFlow/PyTorch intégrés
- **Sécurité** : HTTPS, OAuth2, chiffrement AES-256

---

## 🖥️ Interface utilisateur

- 🏠 **Tableau de bord patient** : Dossier médical, rendez-vous, prescriptions
- 👨‍⚕️ **Espace médecin** : Gestion des patients, prescriptions, visualisation 3D
- 🏥 **Section télé-radiologie** : Partage et annotation d'images entre hôpitaux
- 🤖 **Outils IA** : Prédiction/diagnostic avec explications visuelles
- 🛠️ **Administration** : Gestion des utilisateurs et des accès

---

## 👤 Acteurs & rôles

### 🛡️ Super Administrateurs
- Création/gestion des comptes (administrateurs d'hopitaux,comptes d'hopitaux)
- Supervision des accès et serveurs Orthanc central
- Monitoring et résolution des incidents

### 🛡️ Administrateurs hospitaliers
- Création/gestion des comptes (médecins, assistants)
- Supervision des accès et serveurs Orthanc locaux
- Monitoring et résolution des incidents

### 👨‍⚕️ Médecins
- Consultation/mise à jour des dossiers patients
- Prescription et recommandations
- Accès restreint à leurs patients actuels

### 🧑‍💼 Assistants médicaux
- Création des dossiers médicaux des patients
- Gestion des rendez-vous et agendas
- Mise à jour des infos administratives (pas d'accès aux données médicales)

### 🧑‍🔬 Chercheurs
- Accès à des données anonymisées pour la recherche
- Utilisation des outils IA pour analyse DICOM/non DICOM

### 🧑 Patients
- Consultation de leur dossier, prescriptions, comptes rendus
- Prise de rendez-vous en ligne via un portail sécurisé
- Discussion avec un Assistant médicale IA

---

## ⚡ Installation rapide

Pour lancer automatiquement l'application en local (backend, frontend, base de données, configuration) :

```bash
./setup.sh
```

Ce script :
- Installe toutes les dépendances
- Configure les fichiers d'environnement
- Initialise la base de données
- Démarre les serveurs backend et frontend

> ⚠️ Prérequis : Node.js, npm et MongoDB installés sur votre machine

---

## 👨‍💻 Développeurs

- **Abdoulaye Lah** — Étudiant en master Génie Logiciel et Systèmes d'Information à l'ESP
- **Oumar Yoro Diouf** — Étudiant en master Génie Logiciel et Systèmes d'Information à l'ESP
- **Maman Nafy Ndiaye** — Étudiante en master Génie Logiciel et Systèmes d'Information à l'ESP
- **Ndeye Bounama Dieng** — Étudiante en master Service Réseau et Télécommunication à l'ESP

---

## 📚 Documentation

Toute la documentation technique, les guides d'installation avancée, l'architecture détaillée, les API et les cas d'usage sont disponibles dans le dossier [`docs/`](./docs/) à la racine du projet.

- Consultez notamment [`docs/TECHNICAL.md`](./docs/TECHNICAL.md) pour une documentation technique complète et structurée.

Vous y trouverez :
- L'architecture de l'application (schémas, explications)
- Les instructions de déploiement avancées
- Les spécifications des API
- Les guides d'utilisation pour chaque rôle (médecin, patient, assistant, chercheur, administrateur)
- Les bonnes pratiques de sécurité et de conformité

---

**MediConnect : la santé connectée, intelligente et sécurisée !**


