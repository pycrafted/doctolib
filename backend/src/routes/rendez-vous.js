const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const RendezVous = require('../models/RendezVous');

// Route pour créer un nouveau rendez-vous
router.post('/', protect, async (req, res) => {
  console.log('\n=== DÉBUT CRÉATION RENDEZ-VOUS ===');
  console.log('Données reçues:', req.body);
  console.log('Token décodé:', req.user);

  try {
    // Vérifier que l'utilisateur est un patient
    if (req.user.role !== 'Patient') {
      return res.status(403).json({
        message: 'Accès non autorisé',
        details: ['Seuls les patients peuvent créer des rendez-vous']
      });
    }

    // Créer le rendez-vous
    const rendezVous = new RendezVous({
      patient: req.user.userId,
      hospital: req.body.hospitalId,
      date: new Date(req.body.date),
      time: req.body.time,
      reason: req.body.reason,
      status: 'pending'
    });

    // Sauvegarder le rendez-vous
    const savedRendezVous = await rendezVous.save();
    console.log('Nouveau rendez-vous créé:', savedRendezVous);

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      rendezVous: savedRendezVous
    });

  } catch (error) {
    console.error('=== ERREUR CRÉATION RENDEZ-VOUS ===');
    console.error('Erreur complète:', error);
    console.error('Message d\'erreur:', error.message);
    console.error('Stack trace:', error.stack);

    res.status(400).json({
      message: 'Données de rendez-vous invalides',
      details: Object.values(error.errors || {}).map(err => err.message)
    });
  }
});

// Route pour obtenir les rendez-vous d'un patient
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const rendezVous = await RendezVous.find({ patient: req.params.patientId })
      .populate('hospital', 'name')
      .populate('doctor', 'firstName lastName')
      .sort({ date: 1, time: 1 });
    res.json(rendezVous);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des rendez-vous',
      details: error.message
    });
  }
});

// Route pour récupérer les rendez-vous en attente pour l'assistant
router.get('/assistant/pending', protect, async (req, res) => {
  console.log('\n=== RÉCUPÉRATION DES RENDEZ-VOUS EN ATTENTE POUR L\'ASSISTANT ===');
  console.log('1. Informations de la requête:');
  console.log('- User ID:', req.user._id);
  console.log('- User Role:', req.user.role);
  console.log('- User Hospital:', req.user.hospital);

  try {
    if (req.user.role !== 'Assistant') {
      console.log('2. ERREUR: Utilisateur non autorisé');
      console.log('- Role actuel:', req.user.role);
      console.log('- Role attendu: Assistant');
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    if (!req.user.hospital) {
      console.log('2. ERREUR: Aucun hôpital associé à l\'assistant');
      return res.status(400).json({ message: 'Aucun hôpital associé à cet assistant' });
    }

    console.log('2. Recherche des rendez-vous en attente');
    console.log('Critères de recherche:', {
      status: 'pending',
      hospital: req.user.hospital.toString()
    });

    const appointments = await RendezVous.find({
      status: 'pending',
      hospital: req.user.hospital
    })
    .populate('patient', 'firstName lastName email')
    .populate('hospital', 'name')
    .populate('doctor', 'firstName lastName');

    console.log('3. Résultats de la recherche:');
    console.log('- Nombre de rendez-vous trouvés:', appointments.length);
    console.log('- Premier rendez-vous (si existe):', appointments[0] ? {
      id: appointments[0]._id,
      patient: appointments[0].patient,
      hospital: appointments[0].hospital,
      date: appointments[0].date,
      time: appointments[0].time,
      status: appointments[0].status
    } : 'Aucun rendez-vous');

    res.json(appointments);
  } catch (error) {
    console.error('=== ERREUR LORS DE LA RÉCUPÉRATION DES RENDEZ-VOUS ===');
    console.error('Message d\'erreur:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
});

module.exports = router; 