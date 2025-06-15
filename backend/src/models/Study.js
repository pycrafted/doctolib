const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studyInstanceUID: {
    type: String,
    required: true,
    unique: true
  },
  orthancId: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  metadata: {
    patientName: String,
    studyDate: Date,
    modalities: [String],
    studyDescription: String
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
studySchema.index({ userId: 1, studyInstanceUID: 1 });
studySchema.index({ status: 1 });

const Study = mongoose.model('Study', studySchema);

module.exports = Study; 