const User = require('../models/Users');
const bcrypt = require('bcryptjs');

const DEFAULT_PASSWORD = 'passer123'; // Mot de passe par défaut

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, role, hospital } = req.body;
  let { phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Ajout d'un phone par défaut si non fourni (pour tous les rôles)
    if (!phone) {
      phone = '770000000';
    }

    // Validation et association de l'hôpital pour les assistants et médecins
    let hospitalRef = undefined;
    if (role === 'Assistant' || role === 'Médecin') {
      if (!hospital) {
        return res.status(400).json({ message: `Un ${role.toLowerCase()} doit être rattaché à un hôpital.` });
      }
      const Hospital = require('../models/Hospital');
      const hospitalExists = await Hospital.findById(hospital);
      if (!hospitalExists) {
        return res.status(400).json({ message: 'Hôpital non trouvé.' });
      }
      hospitalRef = hospital;
    }

    const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const user = new User({ firstName, lastName, email, password, role, hospital: hospitalRef, phone });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    console.error('Erreur lors de la création d\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, isActive } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();
    res.status(200).json({ message: 'Utilisateur mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await User.deleteOne({ _id: id }); // Remplace remove() par deleteOne()
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
// Lister tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getMe = async (req, res) => {
  try {
    console.log('Token decoded:', req.user); // Debug log
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('User not found for ID:', req.user.userId); // Debug log
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    console.log('User found:', user); // Debug log
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getMe:', error); // Debug log
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

