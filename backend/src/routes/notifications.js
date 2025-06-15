const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');


router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, doctorId, message } = req.body;
    if (!appointmentId || !doctorId || !message) {
      throw new Error('Tous les champs sont requis');
    }

    const notification = new Notification({ appointmentId, doctorId, message });
    await notification.save();

    res.status(200).json({ message: 'Notification enregistrée' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;