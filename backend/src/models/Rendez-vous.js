const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID du patient est requis']
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'L\'ID de l\'hôpital est requis']
  },
  date: {
    type: Date,
    required: [true, 'La date est requise'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'La date du rendez-vous doit être dans le futur'
    }
  },
  time: {
    type: String,
    required: [true, 'L\'heure est requise'],
    validate: {
      validator: function(value) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      },
      message: 'Format d\'heure invalide (HH:mm)'
    }
  },
  reason: {
    type: String,
    required: [true, 'Le motif est requis'],
    trim: true,
    minlength: [10, 'Le motif doit contenir au moins 10 caractères']
  },
  status: {
    type: String,
    enum: {
      values: ['en attente', 'confirmé', 'en consultation', 'terminé', 'annulé'],
      message: 'Statut invalide'
    },
    default: 'en attente'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(value) {
        if (!value) return true;
        const User = mongoose.model('User');
        const user = await User.findById(value);
        return user && user.role === 'Medecin';
      },
      message: 'Le médecin assigné doit être un utilisateur avec le rôle Medecin'
    }
  },
  mode: {
    type: String,
    enum: ['présentiel', 'en ligne'],
    default: 'présentiel',
  },
  notesConsultation: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

// Index pour améliorer les performances
rendezVousSchema.index({ patientId: 1, date: 1 });
rendezVousSchema.index({ hospitalId: 1, date: 1 });
rendezVousSchema.index({ status: 1 });

// Méthode pour vérifier les conflits d'horaire
rendezVousSchema.statics.checkTimeConflict = async function(hospitalId, date, time) {
  const existingAppointment = await this.findOne({
    hospitalId,
    date,
    time,
    status: { $nin: ['annulé', 'terminé'] }
  });
  return !!existingAppointment;
};

module.exports = mongoose.model('RendezVous', rendezVousSchema);