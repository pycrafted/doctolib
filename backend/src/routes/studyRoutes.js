const express = require('express');
const router = express.Router();
const multer = require('multer');
const studyController = require('../controllers/studyController');
const { protect } = require('../middleware/auth');

// Configuration de multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  }
});

// Routes protégées par authentification
router.use(protect);

// Récupérer toutes les études d'un patient
router.get('/', studyController.getPatientStudies);

// Uploader une étude DICOM
router.post('/upload', upload.single('dicom'), studyController.uploadStudy);

// Supprimer une étude
router.delete('/:studyInstanceUID', studyController.deleteStudy);

// Récupérer les détails d'une étude
router.get('/:studyInstanceUID', studyController.getStudyDetails);

module.exports = router; 