const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); 
const connectDB = require('../config/db');

const MONGODB_URI = 'mongodb://localhost:27017/mediconnect';

const patients = [
  { firstName: 'Yacine', lastName: 'Diagne', email: 'yacinediagne@esp.sn', phone: '770000001' },
  { firstName: 'Aissata', lastName: 'Sy', email: 'aissatasy@esp.sn', phone: '770000002' },
  { firstName: 'Moustapha', lastName: 'Diagne', email: 'moustaphadiagne@esp.sn', phone: '770000003' },
  { firstName: 'Idrissa', lastName: 'Ba', email: 'idrissaba@esp.sn', phone: '770000004' },
  { firstName: 'Souleymane', lastName: 'Diop', email: 'souleymanediop@esp.sn', phone: '770000005' },
  { firstName: 'Abdallah', lastName: 'Sakho', email: 'abdallahsakho@esp.sn', phone: '770000006' },
  { firstName: 'Lauriane', lastName: 'Faye', email: 'laurianefaye@esp.sn', phone: '770000007' },
];

const password = 'passer123';

const seed = async () => {
  try {
    await connectDB(MONGODB_URI);

    for (const patient of patients) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existing = await User.findOne({ email: patient.email });
      if (!existing) {
        await User.create({
          ...patient,
          password: hashedPassword,
          role: 'Patient',
        });
        console.log(`Compte créé pour ${patient.firstName} ${patient.lastName}`);
      } else {
        console.log(`Compte déjà existant : ${patient.email}`);
      }
    }

    console.log('Tous les comptes ont été traités');
    process.exit();
  } catch (error) {
    console.error('Erreur lors de l\'insertion :', error);
    process.exit(1);
  }
};

seed();
