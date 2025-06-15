const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'fe86794b5e044c4d9e570e9d57e4b8a4b78015182204bb6fb23e0286e352b6051ac5432cb9635fe2c93686a4a6ad426212052e72853a1f566e8f9355bb128927';

// Login user
const login = async (req, res) => {
  console.log('\n=== TENTATIVE DE CONNEXION ===');
  console.log('Email:', req.body.email);

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email: req.body.email });
    console.log('Utilisateur trouvé:', !!user);

    if (!user) {
      console.log('ERREUR: Utilisateur non trouvé');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    console.log('Vérification du mot de passe...');
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log('Mot de passe correct:', isMatch);

    if (!isMatch) {
      console.log('ERREUR: Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    console.log('Génération du token...');
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token généré avec succès');

    // Envoyer la réponse
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        hospital: user.hospital
      }
    });
  } catch (error) {
    console.error('=== ERREUR DE CONNEXION ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  console.log('\n=== RÉCUPÉRATION UTILISATEUR COURANT ===');
  console.log('User ID:', req.user.userId);

  try {
    const user = await User.findById(req.user.userId).select('-password');
    console.log('Utilisateur trouvé:', !!user);

    if (!user) {
      console.log('ERREUR: Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('Données utilisateur:', {
      id: user._id,
      role: user.role,
      hospital: user.hospital
    });

    res.json(user);
  } catch (error) {
    console.error('=== ERREUR RÉCUPÉRATION UTILISATEUR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

module.exports = {
  login,
  getCurrentUser
}; 