const RendezVous = require('../models/RendezVous');
const Hospital = require('../models/Hospital');

// Créer un nouveau rendez-vous
exports.createRendezVous = async (req, res) => {
  console.log('\n=== DÉBUT DU PROCESSUS DE CRÉATION DE RENDEZ-VOUS ===');
  console.log('1. Données reçues:', req.body);
  console.log('Token décodé:', req.user);

  try {
    const { hospitalId, date, time, reason } = req.body;
    const patientId = req.user.userId;

    console.log('\n2. VALIDATION DES DONNÉES');
    if (!hospitalId || !date || !time || !reason) {
      console.error('2.2 Erreur: Données manquantes');
      return res.status(400).json({
        message: 'Données de rendez-vous invalides',
        details: ['Tous les champs sont requis']
      });
    }

    console.log('\n3. VALIDATION DE LA DATE');
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      console.error('3.2 Erreur: Date invalide');
      return res.status(400).json({
        message: 'Données de rendez-vous invalides',
        details: ['Date invalide']
      });
    }

    console.log('\n4. VÉRIFICATION DE L\'HÔPITAL');
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      console.error('4.3 Erreur: Hôpital non trouvé');
      return res.status(400).json({
        message: 'Données de rendez-vous invalides',
        details: ['Hôpital non trouvé']
      });
    }

    console.log('\n5. VÉRIFICATION DES DISPONIBILITÉS');
    const hasConflict = await RendezVous.checkTimeConflict(hospitalId, appointmentDate, time);
    if (hasConflict) {
      console.error('5.2 Erreur: Créneau déjà réservé');
      return res.status(400).json({
        message: 'Données de rendez-vous invalides',
        details: ['Ce créneau horaire est déjà réservé']
      });
    }

    console.log('\n6. CRÉATION DU RENDEZ-VOUS');
    const rendezVousData = {
      patient: patientId,
      hospital: hospitalId,
      date: appointmentDate,
      time: time,
      reason: reason,
      status: 'pending'
    };

    console.log('6.1 Données du rendez-vous à créer:', rendezVousData);
    const rendezVous = new RendezVous(rendezVousData);
    const savedRendezVous = await rendezVous.save();
    console.log('6.2 Rendez-vous sauvegardé avec succès:', savedRendezVous);

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      rendezVous: savedRendezVous
    });

  } catch (error) {
    console.error('\n=== ERREUR LORS DE LA CRÉATION DU RENDEZ-VOUS ===', error);
    res.status(500).json({
      message: 'Erreur lors de la création du rendez-vous',
      details: error.message
    });
  }
};

// Récupérer les rendez-vous du patient
exports.getRendezVousForPatient = async (req, res) => {
  console.log('\n=== RÉCUPÉRATION DES RENDEZ-VOUS DU PATIENT ===');
  console.log('1. ID du patient:', req.params.patientId);

  try {
    const rendezvous = await RendezVous.find({ patient: req.params.patientId })
      .populate('hospital', 'name')
      .populate('doctor', 'firstName lastName')
      .sort({ date: 1 });

    console.log('2. Rendez-vous trouvés:', {
      nombre: rendezvous.length,
      données: rendezvous.map(rdv => ({
        id: rdv._id,
        date: rdv.date,
        status: rdv.status
      }))
    });

    res.json(rendezvous);
  } catch (err) {
    console.error('3. Erreur lors de la récupération:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ message: 'Erreur lors du chargement des rendez-vous.' });
  }
};

// Récupérer les rendez-vous du médecin connecté
exports.getRendezVousForMedecin = async (req, res) => {
  try {
    const userId = req.user.userId;

    const rendezvous = await RendezVous.find({ assignedTo: userId }).sort({ date: 1 });
    res.json(rendezvous);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement des rendez-vous.' });
  }
};

// Changer le statut d'un rendez-vous (confirmé, annulé, etc.)
exports.updateRendezVousStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const rendezvous = await RendezVous.findById(id);

    if (!rendezvous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
    }

    if (rendezvous.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce rendez-vous.' });
    }

    rendezvous.status = status;
    await rendezvous.save();

    res.json({ message: 'Statut mis à jour.', rendezvous });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
  }
};

// Notifications : derniers rendez-vous assignés
exports.getNotificationsForMedecin = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await RendezVous.find({
      assignedTo: userId,
      status: 'proposé'
    }).sort({ createdAt: -1 }).limit(5);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement des notifications.' });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  const doctorId = req.user.userId; 

  try {
    const unread = await RendezVous.find({
      assignedTo: doctorId,
      isReadByDoctor: false
    }).sort({ date: -1 });

    res.status(200).json(unread);
  } catch (error) {
    console.error("Erreur récupération notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  const doctorId = req.user.userId;
  const { ids } = req.body; 

  try {
    await RendezVous.updateMany(
      { _id: { $in: ids }, assignedTo: doctorId },
      { $set: { isReadByDoctor: true } }
    );

    res.status(200).json({ message: "Notifications marquées comme lues" });
  } catch (error) {
    console.error("Erreur mise à jour notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.commencerConsultation = async (req, res) => {
  const { id } = req.params;

  try {
    const rdv = await RendezVous.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    rdv.status = 'en consultation';
    await rdv.save();

    res.status(200).json({ message: "Consultation commencée", rdv });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getActiveConsultation = async (req, res) => {
  try {
    const rdv = await RendezVous.findOne({
      assignedTo: req.user._id,
      statut: 'en consultation',
    }).populate('patientId', 'firstName lastName email');

    if (!rdv) return res.status(404).json({ message: "Aucune consultation active." });

    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.startConsultation = async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable" });

    rdv.status = 'en consultation';
    await rdv.save();

    res.status(200).json({ message: 'Consultation commencée', rdv });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.finishConsultation = async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable" });

    rdv.status = 'terminé';
    await rdv.save();

    res.status(200).json({ message: 'Consultation terminée', rdv });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
