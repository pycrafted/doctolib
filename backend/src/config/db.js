const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/mediconnect';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à MongoDB établie');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;