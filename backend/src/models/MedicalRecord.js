const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Masculin', 'Féminin', 'Autre'], required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContacts: [{
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
    }],
  },
  vitalInfo: {
    bloodGroup: { type: String, required: true },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    bmi: { type: String, required: true },
    bloodPressure: { type: String, default: 'Non mesuré' },
    heartRate: { type: String, default: 'Non mesuré' },
    temperature: { type: String, default: 'Non mesuré' },
    oxygenSaturation: { type: String, default: 'Non mesuré' },
  },
  allergies: [String],
  vaccinations: [{
    name: { type: String, required: true },
    date: { type: Date, required: true },
  }],
  medicalHistory: [{
    date: { type: Date, required: true },
    age: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    location: { type: String, required: true },
  }],
  treatments: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    prescriber: { type: String, required: true },
    instructions: { type: String, required: true },
    sideEffects: { type: String, required: true },
  }],
  radiologyReports: [{
    date: { type: Date, required: true },
    type: { type: String, required: true },
    result: { type: String, required: true },
    details: { type: String, required: true },
  }],
}, { timestamps: true });


module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);