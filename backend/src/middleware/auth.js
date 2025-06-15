const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const JWT_SECRET = 'fe86794b5e044c4d9e570e9d57e4b8a4b78015182204bb6fb23e0286e352b6051ac5432cb9635fe2c93686a4a6ad426212052e72853a1f566e8f9355bb128927';

const protect = async (req, res, next) => {
  console.log('\n=== MIDDLEWARE AUTHENTIFICATION ===');
  console.log('Headers:', req.headers);
  
  try {
    // 1. Vérifier si le token existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('1. Token extrait:', token);
    }

    if (!token) {
      console.log('ERREUR: Token non fourni');
      return res.status(401).json({ message: 'Non autorisé - Token manquant' });
    }

    // 2. Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('2. Token décodé:', decoded);

    // 3. Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    console.log('3. Recherche utilisateur avec ID:', decoded.userId);
    console.log('4. Utilisateur trouvé:', user ? {
      id: user._id,
      role: user.role,
      email: user.email
    } : 'Non trouvé');

    if (!user) {
      console.log('5. ERREUR: Utilisateur non trouvé');
      return res.status(401).json({ message: 'Non autorisé - Utilisateur non trouvé' });
    }

    // 4. Ajouter l'utilisateur à la requête
    req.user = {
      userId: user._id.toString(), // Convertir en string pour la comparaison
      role: user.role,
      hospital: user.hospital
    };
    console.log('5. Utilisateur ajouté à la requête:', req.user);

    next();
  } catch (error) {
    console.error('=== ERREUR AUTHENTIFICATION ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Non autorisé - Token expiré' });
    }
    res.status(401).json({ message: 'Non autorisé - Token invalide' });
  }
};

module.exports = { protect };