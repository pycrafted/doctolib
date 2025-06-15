const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/users.js');
const authRoutes = require('./src/routes/auth.js');
const patientRoutes = require('./src/routes/patient.js');
const rendezVousRoutes = require('./src/routes/rendez-vous.js');
const hospitalRoutes = require('./src/routes/hospital.js');
const medecinRoutes = require('./src/routes/medecin.js');
const prescriptionRoutes = require('./src/routes/prescription.js');
const teleconsultationRoutes = require('./src/routes/teleconsultations.js');

// Configuration directe des variables d'environnement
const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/mediconnect';
const JWT_SECRET = 'fe86794b5e044c4d9e570e9d57e4b8a4b78015182204bb6fb23e0286e352b6051ac5432cb9635fe2c93686a4a6ad426212052e72853a1f566e8f9355bb128927';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('API Backend en cours d\'exécution');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/medecin', medecinRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/teleconsultation', teleconsultationRoutes);

// Connexion à la base de données avec l'URI direct
connectDB(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

console.log('Test de journalisation : ce message devrait s\'afficher dans le terminal');

// Exporter les variables pour les utiliser dans d'autres fichiers si nécessaire
module.exports = {
  JWT_SECRET,
  MONGODB_URI
};