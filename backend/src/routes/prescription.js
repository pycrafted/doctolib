const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prescriptionCtrl = require('../controllers/prescriptionController');


router.post('/', auth, prescriptionCtrl.creerPrescription);
router.get('/patient/:patientId', auth, prescriptionCtrl.getPrescriptionsByPatient);
router.get('/medecin', auth, prescriptionCtrl.getPrescriptionsForMedecin);

module.exports = router;
