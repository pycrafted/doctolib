const orthancService = require('../services/orthancService');
const multer = require('multer');
const path = require('path');
const { FRONTEND_CONFIG } = require('../config/constants');

// Configuration de multer pour l'upload de fichiers
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('[ImageMedical] Vérification du type de fichier:', file.mimetype, file.originalname);
    // Vérifier si le fichier est un fichier DICOM
    if (file.mimetype === 'application/dicom' || path.extname(file.originalname).toLowerCase() === '.dcm') {
      cb(null, true);
    } else {
      console.log('[ImageMedical] Type de fichier non autorisé');
      cb(new Error('Seuls les fichiers DICOM sont acceptés'));
    }
  }
}).single('dicomFile');

// Vérifier la connexion à Orthanc
exports.checkOrthancConnection = async (req, res) => {
  try {
    console.log('[ImageMedical] Tentative de connexion à Orthanc');
    const isConnected = await orthancService.checkConnection();
    console.log('[ImageMedical] Résultat de la connexion à Orthanc:', isConnected);
    res.json({ connected: isConnected });
  } catch (error) {
    console.error('[ImageMedical] Erreur lors de la vérification de la connexion Orthanc:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification de la connexion' });
  }
};

// Récupérer les études d'un patient
exports.getPatientStudies = async (req, res) => {
  try {
    const patientId = req.user.userId;
    
    if (!patientId) {
      console.error('[ImageMedical] ERREUR: ID du patient manquant dans le token');
      return res.status(400).json({ 
        message: 'ID du patient manquant',
        error: 'MISSING_PATIENT_ID'
      });
    }

    console.log('[ImageMedical] Récupération des études pour le patient:', patientId);
    const studies = await orthancService.getPatientStudies(patientId);
    
    // Si aucune étude n'est trouvée, retourner un tableau vide au lieu d'une erreur
    res.json(studies || []);
  } catch (error) {
    console.error('[ImageMedical] ERREUR récupération études:', error.message);
    
    // Gérer spécifiquement les erreurs 404
    if (error.response && error.response.status === 404) {
      return res.status(200).json([]);
    }
    
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des études',
      error: error.message
    });
  }
};

// Récupérer toutes les études
exports.getAllStudies = async () => {
  try {
    console.log('[ImageMedical] Récupération de toutes les études');
    const studies = await orthancService.getAllStudies();
    console.log('[ImageMedical] Études récupérées:', studies.length);

    // Transformer les données pour le frontend
    const formattedStudies = studies.map(study => ({
      StudyInstanceUID: study.StudyInstanceUID || study.orthancId,
      PatientName: study.PatientName || 'Patient inconnu',
      StudyDate: study.StudyDate || 'Date inconnue',
      StudyDescription: study.StudyDescription || 'Description non disponible',
      // Ajouter d'autres champs si nécessaire
      orthancId: study.orthancId || study.StudyInstanceUID
    }));

    console.log('[ImageMedical] Études formatées:', formattedStudies.length);
    return formattedStudies;
  } catch (error) {
    console.error('[ImageMedical] ERREUR récupération études:', error.message);
    throw error;
  }
};

// Uploader une image DICOM
exports.uploadDicom = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('[ImageMedical] ERREUR upload:', err.message);
      return res.status(400).json({ 
        message: err.message,
        error: 'UPLOAD_ERROR'
      });
    }

    if (!req.file) {
      console.error('[ImageMedical] ERREUR: Aucun fichier reçu');
      return res.status(400).json({ 
        message: 'Aucun fichier n\'a été uploadé',
        error: 'NO_FILE'
      });
    }

    try {
      // Vérification du type de fichier
      if (!req.file.mimetype.includes('dicom') && !req.file.originalname.toLowerCase().endsWith('.dcm')) {
        console.error('[ImageMedical] ERREUR: Type de fichier invalide');
        return res.status(400).json({
          message: 'Le fichier doit être au format DICOM (.dcm)',
          error: 'INVALID_FILE_TYPE'
        });
      }

      // Vérification de la taille du fichier
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (req.file.size > MAX_FILE_SIZE) {
        console.error('[ImageMedical] ERREUR: Fichier trop volumineux');
        return res.status(400).json({
          message: 'Le fichier est trop volumineux (max 100MB)',
          error: 'FILE_TOO_LARGE'
        });
      }

      // Vérification de l'utilisateur
      if (!req.user || !req.user.userId) {
        console.error('[ImageMedical] ERREUR: Utilisateur non authentifié');
        return res.status(401).json({
          message: 'Utilisateur non authentifié',
          error: 'UNAUTHORIZED'
        });
      }

      console.log('[ImageMedical] Upload du fichier:', {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        userId: req.user.userId
      });

      const result = await orthancService.uploadDicom(req.file.buffer, req.user.userId);
      console.log('[ImageMedical] Upload réussi - ID:', result);
      
      res.json({ 
        success: true,
        instanceId: result,
        message: 'Fichier DICOM uploadé avec succès'
      });
    } catch (error) {
      console.error('[ImageMedical] ERREUR upload:', error.message);
      
      // Gestion des erreurs spécifiques
      if (error.message.includes('connexion')) {
        return res.status(503).json({ 
          message: 'Impossible de se connecter au serveur DICOM',
          error: 'CONNECTION_ERROR'
        });
      }
      
      if (error.message.includes('temps')) {
        return res.status(504).json({ 
          message: 'Le serveur DICOM met trop de temps à répondre',
          error: 'TIMEOUT_ERROR'
        });
      }

      if (error.message.includes('Utilisateur non trouvé')) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé',
          error: 'USER_NOT_FOUND'
        });
      }

      res.status(500).json({ 
        message: 'Erreur lors de l\'upload du fichier',
        error: error.message
      });
    }
  });
};

// Supprimer une étude
exports.deleteStudy = async (req, res) => {
  try {
    const { studyInstanceUID } = req.params;
    console.log('[ImageMedical] Tentative de suppression de l\'étude:', studyInstanceUID);
    await orthancService.deleteStudy(studyInstanceUID);
    console.log('[ImageMedical] Étude supprimée avec succès');
    res.json({ message: 'Étude supprimée avec succès' });
  } catch (error) {
    console.error('[ImageMedical] Erreur lors de la suppression:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'étude' });
  }
};

// Récupérer les instances d'une étude
exports.getStudyInstances = async (req, res) => {
  try {
    const { studyId } = req.params;
    console.log('[ImageMedical] Récupération des instances pour l\'étude:', studyId);
    const instances = await orthancService.getStudyInstances(studyId);
    res.json(instances);
  } catch (error) {
    console.error('[ImageMedical] ERREUR récupération instances:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des instances' });
  }
};

// Récupérer le fichier DICOM d'une instance
exports.getInstanceFile = async (req, res) => {
  try {
    const { instanceId } = req.params;
    console.log('[ImageMedical] Récupération du fichier pour l\'instance:', instanceId);
    const fileBuffer = await orthancService.getInstanceFile(instanceId);
    res.set('Content-Type', 'application/dicom');
    res.send(fileBuffer);
  } catch (error) {
    console.error('[ImageMedical] ERREUR récupération fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
  }
};

// Générer l'URL du viewer pour une étude
exports.getViewerUrl = async (studyInstanceUID) => {
  try {
    console.log('[ImageMedical] Génération de l\'URL viewer pour l\'étude:', studyInstanceUID);
    
    // Vérifier que l'étude existe
    const study = await orthancService.getStudy(studyInstanceUID);
    if (!study) {
      throw new Error('Étude non trouvée');
    }

    // Construire l'URL du viewer
    const viewerUrl = `${FRONTEND_CONFIG.BASE_URL}/viewer/${studyInstanceUID}`;
    
    console.log('[ImageMedical] URL viewer générée:', viewerUrl);
    return viewerUrl;
  } catch (error) {
    console.error('[ImageMedical] Erreur génération URL viewer:', error.message);
    throw error;
  }
};

// Récupérer la prévisualisation PNG d'une étude
exports.getStudyPreview = async (req, res) => {
  try {
    const { studyId } = req.params;
    console.log('🔍 [ImageMedical] Début getStudyPreview pour studyId:', studyId);
    console.log('📋 [ImageMedical] Headers de la requête:', {
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length'],
      userAgent: req.headers['user-agent']
    });
    
    console.log('🔄 [ImageMedical] Appel du service pour la prévisualisation');
    const previewBuffer = await orthancService.getStudyPreview(studyId);
    console.log('✅ [ImageMedical] Prévisualisation reçue du service, taille:', previewBuffer.length, 'bytes');
    
    // Définir les headers pour une image PNG
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    });
    
    console.log('📤 [ImageMedical] Envoi de la prévisualisation au client');
    res.send(previewBuffer);
  } catch (error) {
    console.error('❌ [ImageMedical] ERREUR détaillée prévisualisation:', {
      message: error.message,
      studyId: req.params.studyId,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la prévisualisation',
      details: error.message
    });
  }
}; 