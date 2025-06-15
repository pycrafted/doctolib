const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/Users');

// Récupérer tous les dossiers médicaux assignés à un médecin
exports.getDossiersForMedecin = async (req, res) => {
  try {
    const medecinId = req.user.userId;

    // Vérification du rôle
    if (req.user.role !== 'Médecin') {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Trouver tous les dossiers assignés à ce médecin
    const dossiers = await MedicalRecord.find({ assignedTo: medecinId })
      .populate('patient', 'firstName lastName gender email dateOfBirth') // infos du patient
      .select('-__v'); // optionnel : ne pas renvoyer le champ __v

    res.status(200).json(dossiers);
  } catch (err) {
    console.error("Erreur lors du chargement des dossiers médecin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

