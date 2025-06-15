const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const MedicalRecord = require('./models/MedicalRecord');
const User = require('./models/Users');

require('dotenv').config({ path:'C:/E.S.P/Master 1 GLSI/Semestre 2/Projet professionnel et personnel/Orthanc-Viewer/.env' });

const seedMedicalRecord = async () => {
  try {
    await connectDB();

    // Trouver le patient que tu as créé
    const patient = await User.findOne({ email: 'Bounamadieng@esp.com' });
    if (!patient) {
      console.log('Patient non trouvé');
      process.exit(1);
    }

    // Supprimer les anciens dossiers médicaux pour ce patient
    await MedicalRecord.deleteMany({ userId: patient._id });

    // Créer un dossier médical pour ce patient
    const medicalRecord = new MedicalRecord({
      userId: patient._id,
      personalInfo: {
        dateOfBirth: new Date('1978-03-15'),
        gender: 'Masculin',
        address: '123 rue de la Santé, 75001 Paris',
        phone: '01 23 45 67 89',
        email: 'patient@example.com',
        emergencyContacts: [
          { name: 'Marie Dupont', relation: 'Épouse', phone: '01 23 45 67 90' },
          { name: 'Dr. Sophie Martin', relation: 'Médecin traitant', phone: '01 23 45 67 91' },
        ],
      },
      vitalInfo: {
        bloodGroup: 'A+',
        weight: '75 kg',
        height: '175 cm',
        bmi: '24.5',
        bloodPressure: '120/80 mmHg',
        heartRate: '72 bpm',
        temperature: '37.2°C',
        oxygenSaturation: '98%',
      },
      allergies: ['Pénicilline', 'Arachides'],
      vaccinations: [
        { name: 'COVID-19', date: new Date('2023-01-01') },
        { name: 'Grippe', date: new Date('2022-10-15') },
      ],
      medicalHistory: [
        {
          date: new Date('1978-03-15'),
          age: 0,
          type: 'Naissance',
          description: 'Naissance à terme, poids 3.5kg',
          details: 'Accouchement normal sans complications',
          location: 'Maternité Saint-Joseph, Paris',
        },
        {
          date: new Date('1980-06-01'),
          age: 2,
          type: 'Maladie infantile',
          description: 'Varicelle',
          details: 'Évolution normale, sans complications',
          location: 'Traitement à domicile',
        },
        {
          date: new Date('1985-09-10'),
          age: 7,
          type: 'Chirurgie',
          description: 'Amygdalectomie',
          details: 'Ablation des amygdales suite à des angines récurrentes',
          location: 'Clinique des Enfants, Lyon',
        },
        {
          date: new Date('1995-04-20'),
          age: 17,
          type: 'Fracture',
          description: 'Fracture du bras gauche',
          details: 'Suite à une chute en vélo, plâtre pendant 6 semaines',
          location: 'Hôpital Central, Paris',
        },
        {
          date: new Date('2010-11-15'),
          age: 32,
          type: 'Diagnostic',
          description: 'Diagnostic d\'hypertension',
          details: 'Découverte lors d\'un contrôle de routine, mise sous traitement',
          location: 'Cabinet Dr. Martin',
        },
        {
          date: new Date('2015-03-01'),
          age: 37,
          type: 'Diagnostic',
          description: 'Diabète type 2',
          details: 'Découvert suite à des analyses de routine, mise en place d\'un régime et traitement',
          location: 'Centre Médical de Diabétologie',
        },
        {
          date: new Date('2020-07-10'),
          age: 42,
          type: 'Chirurgie',
          description: 'Arthroscopie du genou droit',
          details: 'Suite à une déchirure méniscale, rééducation 3 mois',
          location: 'Clinique du Sport, Paris',
        },
        {
          date: new Date('2023-02-05'),
          age: 45,
          type: 'Hospitalisation',
          description: 'COVID-19',
          details: 'Hospitalisation 5 jours pour détresse respiratoire, rétablissement complet',
          location: 'Hôpital Saint-Antoine',
        },
      ],
      treatments: [
        {
          name: 'Metformine',
          dosage: '1000mg',
          frequency: '2 fois par jour',
          duration: '6 mois',
          startDate: new Date('2024-01-01'),
          prescriber: 'Dr. Martin',
          instructions: 'À prendre pendant les repas',
          sideEffects: 'Possibles troubles digestifs',
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: '1 fois par jour',
          duration: 'Continue',
          startDate: new Date('2023-12-15'),
          prescriber: 'Dr. Dubois',
          instructions: 'À prendre le matin',
          sideEffects: 'Surveillance tension artérielle',
        },
        {
          name: 'Aspirine',
          dosage: '75mg',
          frequency: '1 fois par jour',
          duration: 'Continue',
          startDate: new Date('2024-02-01'),
          prescriber: 'Dr. Martin',
          instructions: 'À prendre pendant le repas du soir',
          sideEffects: 'Risque de saignements',
        },
      ],
      radiologyReports: [
        {
          date: new Date('2025-05-01'),
          type: 'IRM cérébrale',
          result: 'Aucune anomalie détectée',
          details: 'Examen de contrôle annuel. Images de bonne qualité. Pas de lésion visible.',
        },
        {
          date: new Date('2025-04-15'),
          type: 'Scanner thoracique',
          result: 'Nodule pulmonaire à surveiller',
          details: 'Nodule de 4mm dans le lobe supérieur droit. Contrôle recommandé dans 6 mois.',
        },
        {
          date: new Date('2025-03-01'),
          type: 'Échographie abdominale',
          result: 'Normal',
          details: 'Examen complet de l\'abdomen. Pas d\'anomalie détectée. Tous les organes sont de taille et d\'aspect normaux.',
        },
        {
          date: new Date('2025-02-15'),
          type: 'Radiographie thoracique',
          result: 'Normal',
          details: 'Clichés de face et de profil. Pas d\'anomalie pulmonaire. Silhouette cardiaque normale.',
        },
        {
          date: new Date('2025-01-01'),
          type: 'Scanner abdominal',
          result: 'Anomalie bénigne',
          details: 'Petit kyste hépatique de 2cm. Pas de signe de malignité. Suivi recommandé dans 6 mois.',
        },
        {
          date: new Date('2024-12-15'),
          type: 'IRM lombaire',
          result: 'Hernie discale',
          details: 'Hernie discale L4-L5 avec compression modérée de la racine nerveuse. Traitement conservateur recommandé.',
        },
        {
          date: new Date('2024-11-01'),
          type: 'Échographie cardiaque',
          result: 'Normal',
          details: 'Fonction cardiaque normale. Pas de valvulopathie. Fraction d\'éjection à 65%.',
        },
      ],
    });

    await medicalRecord.save();
    console.log('Dossier médical créé avec succès pour le patient:', patient.email);
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création du dossier médical:', error.message);
    process.exit(1);
  }
};

seedMedicalRecord();