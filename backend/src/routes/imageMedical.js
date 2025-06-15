const express = require('express');
const router = express.Router();
const imageMedicalController = require('../controllers/imageMedicalController');
const { protect } = require('../middleware/auth');
const StudyNote = require('../models/studyNote');

// Middleware de logging pour toutes les routes
router.use((req, res, next) => {
  console.log(`🌐 [ImageMedical] ${req.method} ${req.originalUrl}`);
  console.log('📋 [ImageMedical] Headers:', {
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    userAgent: req.headers['user-agent']
  });
  next();
});

// Récupérer toutes les études
router.get('/studies', protect, async (req, res) => {
  try {
    console.log('🔍 [ImageMedical] Demande de récupération des études');
    const studies = await imageMedicalController.getAllStudies();
    console.log(`✅ [ImageMedical] ${studies.length} études envoyées au client`);
    res.json(studies);
  } catch (error) {
    console.error('❌ [ImageMedical] Erreur lors de la récupération des études:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des études' });
  }
});

// Récupérer les instances d'une étude
router.get('/studies/:studyId/instances', protect, imageMedicalController.getStudyInstances);

// Récupérer le fichier DICOM d'une instance
router.get('/instances/:instanceId/file', protect, imageMedicalController.getInstanceFile);

// Uploader une image DICOM
router.post('/upload', protect, (req, res, next) => {
  console.log('📤 [ImageMedical] Nouvelle demande d\'upload');
  next();
}, imageMedicalController.uploadDicom);

// Route pour obtenir l'URL du viewer
router.get('/studies/:studyInstanceUID/viewer-url', protect, async (req, res) => {
  try {
    console.log('🔍 [ImageMedical] Demande d\'URL viewer pour l\'étude:', req.params.studyInstanceUID);
    
    const viewerUrl = await imageMedicalController.getViewerUrl(req.params.studyInstanceUID);
    console.log('✅ [ImageMedical] URL viewer générée:', viewerUrl);
    
    res.json({ viewerUrl });
  } catch (error) {
    console.error('❌ [ImageMedical] Erreur génération URL viewer:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la génération de l\'URL du viewer',
      error: error.message 
    });
  }
});

// Route pour la prévisualisation PNG d'une étude
router.get('/studies/:studyId/preview-png', protect, imageMedicalController.getStudyPreview);

// Route pour récupérer les notes d'une étude
router.get('/studies/:studyId/notes', protect, async (req, res) => {
  try {
    const { studyId } = req.params;
    const notes = await StudyNote.find({ studyId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notes' });
  }
});

// Route pour ajouter une note à une étude
router.post('/studies/:studyId/notes', protect, async (req, res) => {
  try {
    const { studyId } = req.params;
    const { note } = req.body;
    const newNote = await StudyNote.create({
      studyId,
      content: note,
      userId: req.user.userId
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la note' });
  }
});

module.exports = router; 