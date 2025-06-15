const Note = require('../models/NotesConsultation');
const RendezVous = require('../models/Rendez-Vous');

exports.ajouterNote = async (req, res) => {
  try {
    const { rendezVousId, contenu } = req.body;
    const medecinId = req.user._id;

    const rdv = await RendezVous.findById(rendezVousId);
    if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable." });

    if (rdv.mode !== 'en ligne') return res.status(403).json({ message: "Ce n'est pas une téléconsultation." });
    if (rdv.status !== 'en consultation') return res.status(403).json({ message: "Le rendez-vous n’est pas actif." });

    const note = new Note({
      rendezVousId,
      medecinId,
      patientId: rdv.patientId,
      contenu,
    });

    await note.save();
    res.status(201).json({ message: "Note enregistrée", note });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getNotesByRendezVous = async (req, res) => {
  try {
    const { rendezVousId } = req.params;
    const notes = await Note.find({ rendezVousId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
