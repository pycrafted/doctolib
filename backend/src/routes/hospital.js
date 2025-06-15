const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    console.error('Erreur lors de la récupération des hôpitaux:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ message: 'Accès refusé : seuls les Super Admins peuvent créer un hôpital.' });
    }
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Nom et adresse requis.' });
    }
    const hospital = new Hospital({ name, address });
    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    console.error('Erreur lors de la création de l\'hôpital:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;