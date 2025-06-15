const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  availability: { type: String, required: true },
});

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  doctors: [doctorSchema],
});

module.exports = mongoose.model('Hospital', hospitalSchema);