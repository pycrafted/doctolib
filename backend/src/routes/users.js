const express = require('express');
const router = express.Router();
const { createUser, updateUser, deleteUser, getUsers, getCurrentUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const User = require('../models/Users');
const { getCurrentUser: authCurrentUser } = require('../controllers/authController');

router.use(protect);

// Routes
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/list', getUsers);
router.get('/current', getCurrentUser);
router.get('/me', getMe);

// Route pour récupérer l'utilisateur courant
router.get('/me', protect, authCurrentUser);

// Route pour récupérer la liste des médecins
router.get('/medecinList', protect, async (req, res) => {
  try {
    const medecins = await User.find({ role: 'Medecin' }).select('-password');
    res.json(medecins);
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des médecins' });
  }
});

// Route pour récupérer la liste des assistants
router.get('/assistantList', protect, async (req, res) => {
  try {
    const assistants = await User.find({ role: 'Assistant' }).select('-password');
    res.json(assistants);
  } catch (error) {
    console.error('Erreur lors de la récupération des assistants:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des assistants' });
  }
});

module.exports = router;