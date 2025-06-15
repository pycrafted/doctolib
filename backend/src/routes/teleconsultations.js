const express = require('express');
const router = express.Router();
const teleCtrl = require('../controllers/teleconsultationController');
const auth = require('../middleware/auth');
const isMedecin = require('../middleware/isMedecin');

router.post('/notes', auth, isMedecin, teleCtrl.ajouterNote);
router.get('/notes/:rendezVousId', auth,isMedecin,  teleCtrl.getNotesByRendezVous);

module.exports = router;
