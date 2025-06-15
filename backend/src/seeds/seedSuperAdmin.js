const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const connectDB = require('../config/db');

const MONGODB_URI = 'mongodb://localhost:27017/mediconnect';

const seedSuperAdmin = async () => {
  try {
    // Connexion à la base de données
    await connectDB(MONGODB_URI);

    // Vérifier si un Super Admin existe déjà
    const existingSuperAdmin = await User.findOne({ role: 'Super Admin' });
    if (existingSuperAdmin) {
      console.log('Un Super Admin existe déjà :', existingSuperAdmin.email);
      process.exit(0);
    }

    // Créer un Super Admin
    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('password123', 10), // Mot de passe par défaut
      role: 'Super Admin',
      isActive: true,
    });

    await superAdmin.save();
    console.log('Super Admin créé avec succès :', superAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création du Super Admin :', error);
    process.exit(1);
  }
};

seedSuperAdmin();