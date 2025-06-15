const express = require('express');
const router = express.Router();
const { getDossiersForMedecin } = require('../controllers/medecinController');
const authMiddleware = require('../middleware/auth');

// route protégée
router.get('/dossiers', authMiddleware, getDossiersForMedecin);

module.exports = router;
