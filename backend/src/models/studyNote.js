const mongoose = require('mongoose');

const studyNoteSchema = new mongoose.Schema({
  studyId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyNote', studyNoteSchema); 