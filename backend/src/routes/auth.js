const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const JWT_SECRET = 'fe86794b5e044c4d9e570e9d57e4b8a4b78015182204bb6fb23e0286e352b6051ac5432cb9635fe2c93686a4a6ad426212052e72853a1f566e8f9355bb128927';

// Inscription
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    await user.save();

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentative de connexion pour:', email);

  try {
    const user = await User.findOne({ email });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      console.log('Email non trouvé:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    console.log('Vérification du mot de passe...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Mot de passe correct:', isMatch ? 'Oui' : 'Non');

    if (!isMatch) {
      console.log('Mot de passe incorrect pour:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    console.log('Génération du token pour:', email);
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    console.log('Token généré avec succès');

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;