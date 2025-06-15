// models/Prescription.js
const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  medications: [
    {
      nom: String,
      dosage: String,
      frequence: String,
      duree: String
    }
  ],
  remarques: String
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
