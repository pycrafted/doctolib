const mongoose = require('mongoose');

const noteConsultationSchema = new mongoose.Schema({
  rendezVousId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RendezVous',
    required: true,
  },
  medecinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contenu: {
    type: String,
    required: true,
  },
  dateAjout: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('NoteConsultation', noteConsultationSchema);
