const Prescription = require('../models/prescriptions');

// Créer une prescription
exports.creerPrescription = async (req, res) => {
  try {
    const { patientId, medications, remarques } = req.body;

    const prescription = new Prescription({
      patient: patientId,
      medecin: req.user.userId,
      medications,
      remarques
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription créée', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error });
  }
};

// Lister les prescriptions d’un patient
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('Médecin', 'firstName lastName email')
      .sort({ date: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement', error });
  }
};

// Lister toutes les prescriptions du médecin connecté
exports.getPrescriptionsForMedecin = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ medecin: req.user.userId })
      .populate('Patient', 'firstName lastName email')
      .sort({ date: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement', error });
  }
};
