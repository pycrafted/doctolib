const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerPatient, verifyRegistration } = require('../controllers/patientController');

// Middleware de logging
router.use((req, res, next) => {
  console.log(`🌐 [Patients] ${req.method} ${req.originalUrl}`);
  console.log('📦 [Patients] Headers:', req.headers);
  console.log('📦 [Patients] Body:', req.body);
  next();
});

// Route d'inscription des patients
router.post('/register', registerPatient);

// Route de vérification d'inscription
router.post('/verify-registration', verifyRegistration);

// Récupérer le dossier médical d'un patient
router.get('/:id/medical-records', protect, async (req, res) => {
  try {
    // Vérifier que l'utilisateur a le droit d'accéder à ce dossier
    if (req.user.role !== 'Admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // TODO: Implémenter la logique de récupération du dossier médical
    // Pour l'instant, retourner un dossier vide
    res.json({
      personalInfo: {
        gender: '-',
        phone: '-',
        address: '-',
        email: '-',
        dateOfBirth: '-',
        emergencyContacts: [],
      },
      vitalInfo: {
        bloodGroup: '-',
        weight: '-',
        height: '-',
        bmi: '-',
        bloodPressure: '-',
        heartRate: '-',
        temperature: '-',
        oxygenSaturation: '-',
      },
      allergies: [],
      vaccinations: [],
      treatments: [],
      medicalHistory: [],
      radiologyReports: [],
    });
  } catch (error) {
    console.error('❌ [Patients] Erreur lors de la récupération du dossier médical:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du dossier médical' });
  }
});

module.exports = router; 