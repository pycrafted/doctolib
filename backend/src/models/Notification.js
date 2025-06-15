const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
    validate: {
        validator: async function (value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Médecin' || 'Assistant'; 
    },
          message: 'DoctorId must reference a user with role "Médecin"',
        }, 
    required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);