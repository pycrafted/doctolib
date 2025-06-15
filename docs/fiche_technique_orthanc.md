# 📋 Fiche technique des serveurs Orthanc

## Serveurs Orthanc locaux
- **Rôle** : Stockage des images DICOM des patients de l'hôpital
- **Technologie** : Orthanc (open-source, conforme DICOM)
- **Fonctionnalités** :
  - Upload et stockage des images DICOM
  - Gestion des métadonnées
  - API REST pour l'accès et la manipulation
  - Synchronisation avec le serveur central

## Serveur Orthanc central
- **Rôle** : Agrégation des images DICOM de tous les serveurs locaux
- **Technologie** : Orthanc
- **Fonctionnalités** :
  - Synchronisation automatique avec les serveurs locaux
  - API REST pour l'accès global
  - Gestion des permissions et de la sécurité
  - Interface web pour l'administration 