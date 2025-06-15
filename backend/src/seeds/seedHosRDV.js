const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const Appointment = require('./models/Rendez-vous');
const User = require('./models/Users');
const connectDB = require('./config/db');
const Doctor = require('./models/Hospital');
require('dotenv').config({ path:'C:/E.S.P/Master 1 GLSI/Semestre 2/Projet professionnel et personnel/Orthanc-Viewer/.env' });


async function seedData() {
  try {
   await connectDB();

    // Création des hôpitaux
    const hospitals = [
      {
        name: 'Hôpital Principal de Dakar',
        address: 'Avenue Cheikh Anta Diop, Dakar',
        city: 'Dakar',
      },
      {
        name: 'Hôpital Fann',
        address: 'Avenue Pasteur, Dakar',
        city: 'Dakar',
      },
      {
        name: 'Hôpital Aristide Le Dantec',
        address: 'Avenue Nelson Mandela, Dakar',
        city: 'Dakar',
      },
      {
        name: 'Hôpital Régional de Thiès',
        address: 'Route de Mbour, Thiès',
        city: 'Thiès',
      },
      {
        name: 'Hôpital Régional de Saint-Louis',
        address: 'Rue de l’Île, Saint-Louis',
        city: 'Saint-Louis',
      },
    ];

    // Supprimer les hôpitaux existants pour éviter les doublons
    await Hospital.deleteMany({});
    const createdHospitals = await Hospital.insertMany(hospitals);
    console.log('Hospitals created:', createdHospitals.length);

    // Trouver 
    let patient = await User.findOne({ email: 'Bounamadieng@esp.com', role: 'Patient' });
    
    console.log('Patient Bounama Dieng:', patient.email);

    // // Créer des médecins fictifs
    // const doctors = [
    //   {
    //     name: 'Dr. Maman Nafy Ndiaye',
    //     specialty: 'Cardiologie',
    //     hospitalId: createdHospitals[0]._id, // Hôpital Principal de Dakar
    //   },
    //   {
    //     name: 'Dr. Fatou Diop',
    //     specialty: 'Pédiatrie',
    //     hospitalId: createdHospitals[1]._id, // Hôpital Fann
    //   },
    //   {
    //     name: 'Dr. Moussa Ndiaye',
    //     specialty: 'Généraliste',
    //     hospitalId: createdHospitals[2]._id, // Hôpital Aristide Le Dantec
    //   },
    // ];

    // await Doctor.deleteMany({});
    // const createdDoctors = await Doctor.insertMany(doctors);
    // console.log('Doctors created:', createdDoctors.length);

    // Créer des rendez-vous pour Bouna Madieng
    const rendezVous = [
      {
        patientId: patient._id,
        hospitalId: createdHospitals[0]._id,
        // doctorId: createdDoctors[0]._id,
        date: new Date('2025-06-10T10:00:00'),
        time: '10:00',
        reason: 'Consultation cardiologique',
        status: 'scheduled',
      },
      {
        patientId: patient._id,
        hospitalId: createdHospitals[1]._id,
        // doctorId: createdDoctors[1]._id,
        date: new Date('2025-06-12T14:30:00'),
        time: '14:30',
        reason: 'Consultation pédiatrique',
        status: 'scheduled',
      },
      {
        patientId: patient._id,
        hospitalId: createdHospitals[2]._id,
        // doctorId: createdDoctors[2]._id,
        date: new Date('2025-06-15T09:00:00'),
        time: '09:00',
        reason: 'Consultation générale',
        status: 'scheduled',
      },
      {
        patientId: patient._id,
        hospitalId: createdHospitals[0]._id,
        // doctorId: createdDoctors[0]._id,
        date: new Date('2025-06-20T11:00:00'),
        time: '11:00',
        reason: 'Suivi cardiologique',
        status: 'scheduled',
      },
    ];

    await Appointment.deleteMany({ patientId: patient._id });
    const createdAppointments = await Appointment.insertMany(rendezVous);
    console.log('Appointments created for Bounama Dieng:', createdAppointments.length);

    console.log('Data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedData();