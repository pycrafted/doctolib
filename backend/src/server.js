const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios');

// Initialisation d'Express
const app = express();

// Configuration CORS détaillée
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Proxy pour Orthanc
app.use('/orthanc', async (req, res) => {
  try {
    const orthancUrl = process.env.ORTHANC_URL || 'http://localhost:8042';
    const response = await axios({
      method: req.method,
      url: `${orthancUrl}${req.path}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erreur proxy Orthanc:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Erreur lors de la communication avec Orthanc',
      error: error.message
    });
  }
});

// Connexion à la base de données
connectDB();

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const imageMedicalRoutes = require('./routes/imageMedical');
const studyRoutes = require('./routes/studyRoutes');
const patientRoutes = require('./routes/patients');
const rendezVousRoutes = require('./routes/rendez-vous');
const hospitalRoutes = require('./routes/hospital');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/orthanc', imageMedicalRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/hospitals', hospitalRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  
  res.status(500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS configuré pour: http://localhost:3000`);
}); 