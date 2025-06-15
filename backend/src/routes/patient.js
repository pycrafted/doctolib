const express = require('express');
const router = express.Router();
const { getMedicalRecord, createMedicalRecord } = require('../controllers/patientController');
const authMiddleware = require('../middleware/auth');
const MedicalRecord = require('../models/MedicalRecord');
const { getAllPatientsWithInfo, registerPatient } = require('../controllers/patientController');

router.post('/register', registerPatient); 

// Protéger les routes avec authentification
router.use(authMiddleware);

// Récupérer le dossier médical
router.get('/:userId/medical-records', getMedicalRecord);
router.post('/:userId/medical-records', createMedicalRecord);
router.get('/infos', getAllPatientsWithInfo);

router.get('/exists/:userId', authMiddleware, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ userId: req.params.userId });
    if (record) {
      return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification du dossier médical" });
  }
});


module.exports = router;