const orthancService = require('../services/orthancService');
const Study = require('../models/Study');

// Récupérer toutes les études d'un patient
exports.getPatientStudies = async (req, res) => {
  try {
    const userId = req.user.id;
    const studies = await orthancService.getPatientStudies(userId);
    res.json(studies);
  } catch (error) {
    console.error('❌ [StudyController] Erreur récupération études:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des études',
      details: error.message 
    });
  }
};

// Uploader une étude DICOM
exports.uploadStudy = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const userId = req.user.id;
    const instanceId = await orthancService.uploadDicom(req.file.buffer, userId);
    
    res.json({ 
      message: 'Étude uploadée avec succès',
      instanceId 
    });
  } catch (error) {
    console.error('❌ [StudyController] Erreur upload étude:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'upload de l\'étude',
      details: error.message 
    });
  }
};

// Supprimer une étude
exports.deleteStudy = async (req, res) => {
  try {
    const { studyInstanceUID } = req.params;
    const userId = req.user.id;

    await orthancService.deleteStudy(studyInstanceUID, userId);
    
    res.json({ message: 'Étude supprimée avec succès' });
  } catch (error) {
    console.error('❌ [StudyController] Erreur suppression étude:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de l\'étude',
      details: error.message 
    });
  }
};

// Récupérer les détails d'une étude
exports.getStudyDetails = async (req, res) => {
  try {
    const { studyInstanceUID } = req.params;
    const userId = req.user.id;

    const study = await Study.findOne({ 
      studyInstanceUID,
      userId,
      status: 'active'
    });

    if (!study) {
      return res.status(404).json({ error: 'Étude non trouvée' });
    }

    res.json(study);
  } catch (error) {
    console.error('❌ [StudyController] Erreur récupération détails étude:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des détails de l\'étude',
      details: error.message 
    });
  }
}; 