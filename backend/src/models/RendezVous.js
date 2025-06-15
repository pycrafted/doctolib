const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode statique pour vérifier les conflits d'horaires
rendezVousSchema.statics.checkTimeConflict = async function(hospitalId, date, time) {
  console.log('Vérification des conflits d\'horaires:', { hospitalId, date, time });
  
  const existingAppointment = await this.findOne({
    hospital: hospitalId,
    date: date,
    time: time,
    status: { $in: ['pending', 'confirmed'] }
  });

  console.log('Rendez-vous existant trouvé:', existingAppointment ? 'Oui' : 'Non');
  return !!existingAppointment;
};

// Méthode pour formater la date
rendezVousSchema.methods.formatDate = function() {
  return this.date.toLocaleDateString();
};

// Méthode pour vérifier si le rendez-vous est dans le futur
rendezVousSchema.methods.isInFuture = function() {
  const now = new Date();
  return this.date > now;
};

// Middleware pre-save pour valider la date
rendezVousSchema.pre('save', async function(next) {
  // Vérifier que la date est dans le futur
  if (this.date < new Date()) {
    next(new Error('La date du rendez-vous doit être dans le futur'));
  }

  // Vérifier les conflits d'horaires
  const hasConflict = await this.constructor.checkTimeConflict(
    this.hospital,
    this.date,
    this.time
  );

  if (hasConflict) {
    next(new Error('Un rendez-vous existe déjà à cette date et heure'));
  }

  next();
});

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous; 