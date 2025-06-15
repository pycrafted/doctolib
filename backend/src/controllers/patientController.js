const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Récupérer le dossier médical d'un patient
exports.getMedicalRecord = async (req, res) => {
  const { userId } = req.params;
  try {
    console.log('\n=== RÉCUPÉRATION DU DOSSIER MÉDICAL ===');
    console.log('Paramètres reçus:', { userId });
    console.log('Utilisateur connecté:', req.user);

    let medicalRecord = await MedicalRecord.findOne({ userId });
    console.log('Dossier médical trouvé:', !!medicalRecord);
    
    // Si le dossier n'existe pas, on le crée avec des valeurs par défaut
    if (!medicalRecord) {
      console.log('Création d\'un nouveau dossier médical pour userId:', userId);
      medicalRecord = new MedicalRecord({
        userId,
        personalInfo: {
          dateOfBirth: new Date(),
          gender: 'Non spécifié',
          address: 'Non spécifié',
          phone: 'Non spécifié',
          email: 'Non spécifié',
          emergencyContacts: [],
        },
        vitalInfo: {
          bloodGroup: 'Non spécifié',
          weight: 'Non spécifié',
          height: 'Non spécifié',
          bmi: 'Non spécifié',
          bloodPressure: 'Non mesuré',
          heartRate: 'Non mesuré',
          temperature: 'Non mesuré',
          oxygenSaturation: 'Non mesuré',
        },
        allergies: [],
        vaccinations: [],
        medicalHistory: [],
        treatments: [],
        radiologyReports: [],
      });
      await medicalRecord.save();
      console.log('Nouveau dossier médical créé');
    }

    // Vérification des permissions
    const isPatient = req.user.userId === userId;
    const isMedecin = req.user.role === 'Médecin';
    const isAssistant = req.user.role === 'Assistant' && req.user.assignedTo === medicalRecord.assignedTo;

    console.log('Vérification des permissions:');
    console.log('- Est le patient:', isPatient);
    console.log('- Est médecin:', isMedecin);
    console.log('- Est assistant:', isAssistant);

    if (isPatient || isMedecin || isAssistant) {
      console.log('Accès autorisé');
      res.status(200).json(medicalRecord);
    } else {
      console.log('Accès refusé');
      return res.status(403).json({ 
        message: 'Accès non autorisé. Seuls les médecins, les patients concernés et leurs assistants peuvent accéder à ce dossier.' 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du dossier médical:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createMedicalRecord = async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const existingRecord = await MedicalRecord.findOne({ userId });
    if (existingRecord) {
      return res.status(400).json({ message: 'Ce patient a déjà un dossier médical.' });
    }

    const record = new MedicalRecord({ userId, ...data });
    await record.save();
    res.status(201).json({ message: 'Dossier médical créé', record });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getAllPatientsWithInfo = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' });

    const patientData = await Promise.all(
      patients.map(async (patient) => {
        const record = await MedicalRecord.findOne({ userId: patient._id });
        const dob = record?.personalInfo?.dateOfBirth;
        const age = dob ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A';
        const gender = record?.personalInfo?.gender || 'N/A';

        return {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          age,
          gender,
        };
      })
    );

    res.status(200).json(patientData);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération des patients." });
  }
};

exports.registerPatient = async (req, res) => {
  console.log('📝 [Register] Début de l\'inscription');
  console.log('📦 [Register] Données reçues:', req.body);
  
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifie que tous les champs sont là
    if (!firstName || !lastName || !email || !password || !phone) {
      console.log('❌ [Register] Champs manquants');
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifie si l'utilisateur existe déjà
    console.log('🔍 [Register] Vérification de l\'existence de l\'utilisateur:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ [Register] Email déjà utilisé:', email);
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hash du mot de passe
    console.log('🔐 [Register] Hashage du mot de passe');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du patient
    console.log('👤 [Register] Création du nouvel utilisateur');
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'Patient',
    });

    console.log('💾 [Register] Sauvegarde de l\'utilisateur');
    await newUser.save();
    console.log('✅ [Register] Utilisateur sauvegardé avec succès');

    // Création automatique d'un dossier médical vide
    console.log('📋 [Register] Création du dossier médical');
    const medicalRecord = new MedicalRecord({
      userId: newUser._id,
      personalInfo: {
        dateOfBirth: new Date(),
        gender: 'Autre', // Changé de 'Non spécifié' à 'Autre'
        address: 'Non spécifié',
        phone: phone,
        email: email,
        emergencyContacts: [],
      },
      vitalInfo: {
        bloodGroup: 'Non spécifié',
        weight: 'Non spécifié',
        height: 'Non spécifié',
        bmi: 'Non spécifié',
        bloodPressure: 'Non mesuré',
        heartRate: 'Non mesuré',
        temperature: 'Non mesuré',
        oxygenSaturation: 'Non mesuré',
      },
      allergies: [],
      vaccinations: [],
      medicalHistory: [],
      treatments: [],
      radiologyReports: [],
    });

    console.log('💾 [Register] Sauvegarde du dossier médical');
    await medicalRecord.save();
    console.log('✅ [Register] Dossier médical sauvegardé avec succès');

    return res.status(201).json({ message: 'Inscription réussie. Veuillez vous connecter.' });
  } catch (error) {
    console.error('❌ [Register] Erreur détaillée:', error);
    console.error('❌ [Register] Stack trace:', error.stack);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.verifyRegistration = async (req, res) => {
  console.log('🔐 [Verify] Début de la vérification');
  console.log('📦 [Verify] Données reçues:', req.body);

  try {
    const { email, verificationCode } = req.body;

    // Vérifier que le code est correct
    if (verificationCode !== 'A9Y3N5') {
      console.log('❌ [Verify] Code incorrect');
      return res.status(400).json({ message: 'Code de vérification incorrect' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ [Verify] Utilisateur non trouvé:', email);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true;
    await user.save();
    console.log('✅ [Verify] Utilisateur vérifié avec succès');

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fe86794b5e044c4d9e570e9d57e4b8a4b78015182204bb6fb23e0286e352b6051ac5432cb9635fe2c93686a4a6ad426212052e72853a1f566e8f9355bb128927',
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      message: 'Inscription vérifiée avec succès',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ [Verify] Erreur:', error);
    return res.status(500).json({ message: 'Erreur lors de la vérification', error: error.message });
  }
};