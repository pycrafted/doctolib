const axios = require('axios');
const { ORTHANC_CONFIG } = require('../config/constants');
const Study = require('../models/Study');
const User = require('../models/Users');

class OrthancService {
  constructor() {
    this.client = axios.create({
      baseURL: ORTHANC_CONFIG.BASE_URL,
      timeout: ORTHANC_CONFIG.TIMEOUT,
      auth: {
        username: process.env.ORTHANC_USERNAME || 'orthanc',
        password: process.env.ORTHANC_PASSWORD || 'orthanc'
      }
    });
    console.log('🟢 [OrthancService] Service initialisé - URL:', ORTHANC_CONFIG.BASE_URL);
  }

  // Formater la date DICOM (format: YYYYMMDD)
  formatStudyDate(dateStr) {
    if (!dateStr) return null;
    try {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('❌ [OrthancService] Erreur formatage date:', error);
      return null;
    }
  }

  // Générer un ID DICOM unique pour un patient
  generateDicomPatientId(userId) {
    return `PAT${userId}`;
  }

  // Vérifier la connexion à Orthanc
  async checkConnection() {
    try {
      console.log('[OrthancService] Tentative de connexion à Orthanc');
      const response = await this.client.get('/system');
      console.log('[OrthancService] Réponse de connexion:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('Orthanc connection check failed:', error.message);
      return false;
    }
  }

  validateStudyInstanceUID(studyInstanceUID) {
    if (!studyInstanceUID || typeof studyInstanceUID !== 'string') {
      throw new Error('Invalid StudyInstanceUID format');
    }
    // Format typique d'un StudyInstanceUID: 1.2.3.4.5
    const uidPattern = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/;
    if (!uidPattern.test(studyInstanceUID)) {
      throw new Error('Invalid StudyInstanceUID format');
    }
    return true;
  }

  // Récupérer les études d'un patient
  async getPatientStudies(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Récupérer les études enregistrées pour ce patient
      const registeredStudies = await Study.find({ 
        userId,
        status: 'active'
      });

      // Récupérer les détails des études depuis Orthanc
      const studiesWithDetails = await Promise.all(
        registeredStudies.map(async (study) => {
          try {
            const response = await this.client.get(`/studies/${study.orthancId}`);
            const studyData = response.data;
            
            return {
              ...study.toObject(),
              orthancData: {
                MainDicomTags: studyData.MainDicomTags,
                PatientMainDicomTags: studyData.PatientMainDicomTags,
                Series: studyData.Series
              }
            };
          } catch (error) {
            console.error(`❌ Erreur détails étude ${study.orthancId}:`, error);
            return study.toObject();
          }
        })
      );

      return studiesWithDetails;
    } catch (error) {
      console.error('❌ [OrthancService] Erreur récupération études:', error.message);
      throw error;
    }
  }

  // Uploader une image DICOM
  async uploadDicom(fileBuffer, userId) {
    try {
      if (!fileBuffer || fileBuffer.length === 0) {
        console.error('❌ [OrthancService] Upload échoué: Buffer vide');
        throw new Error('Fichier vide');
      }

      // Vérification de la taille du fichier (max 100MB)
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
      if (fileBuffer.length > MAX_FILE_SIZE) {
        console.error('❌ [OrthancService] Upload échoué: Fichier trop volumineux');
        throw new Error('Le fichier est trop volumineux (max 100MB)');
      }

      // Récupérer les informations du patient
      console.log('🔍 [OrthancService] Recherche de l\'utilisateur:', userId);
      const user = await User.findById(userId);
      if (!user) {
        console.error('❌ [OrthancService] Utilisateur non trouvé:', userId);
        throw new Error('Utilisateur non trouvé');
      }
      console.log('✅ [OrthancService] Utilisateur trouvé:', user.email);

      // Générer ou récupérer l'ID DICOM du patient
      const dicomPatientId = user.dicomPatientId || this.generateDicomPatientId(userId);
      if (!user.dicomPatientId) {
        console.log('📝 [OrthancService] Génération d\'un nouvel ID DICOM:', dicomPatientId);
        user.dicomPatientId = dicomPatientId;
        await user.save();
      }

      console.log('📤 [OrthancService] Début de l\'upload DICOM...');
      console.log('📊 [OrthancService] Taille du fichier:', fileBuffer.length, 'bytes');

      // Upload vers Orthanc
      const response = await this.client.post('/instances', fileBuffer, {
        headers: {
          'Content-Type': 'application/dicom'
        },
        timeout: 30000 // 30 secondes timeout
      });

      if (!response.data || !response.data.ID) {
        throw new Error('Réponse invalide de l\'upload');
      }

      // Mettre à jour les tags DICOM
      const instanceId = response.data.ID;
      console.log('📝 [OrthancService] Mise à jour des tags DICOM pour l\'instance:', instanceId);
      await this.updateDicomTags(instanceId, {
        PatientID: dicomPatientId,
        PatientName: `${user.firstName} ${user.lastName}`
      });

      // Récupérer les détails de l'étude
      console.log('🔍 [OrthancService] Récupération des détails de l\'étude...');
      const studyDetails = await this.client.get(`/instances/${instanceId}/study`);
      const studyId = studyDetails.data.ID;
      const studyInstanceUID = studyDetails.data.MainDicomTags.StudyInstanceUID;

      // Enregistrer l'étude dans la base de données
      console.log('💾 [OrthancService] Enregistrement de l\'étude dans la base de données...');
      await Study.create({
        userId,
        studyInstanceUID,
        orthancId: studyId,
        metadata: {
          patientName: `${user.firstName} ${user.lastName}`,
          studyDate: studyDetails.data.MainDicomTags.StudyDate,
          modalities: studyDetails.data.MainDicomTags.ModalitiesInStudy?.split('\\') || [],
          studyDescription: studyDetails.data.MainDicomTags.StudyDescription
        }
      });

      console.log('✅ [OrthancService] Upload réussi - ID:', instanceId);
      return instanceId;
    } catch (error) {
      console.error('❌ [OrthancService] Erreur upload:', error.message);
      if (error.response) {
        console.error('🔍 [OrthancService] Détails de l\'erreur:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  }

  // Mettre à jour les tags DICOM
  async updateDicomTags(instanceId, patientData) {
    try {
      if (!instanceId || !patientData) {
        console.error('[OrthancService] ERREUR: instanceId ou patientData manquant');
        throw new Error('Paramètres manquants pour la mise à jour des tags');
      }

      const modifyPayload = {
        Replace: {
          PatientID: patientData.PatientID,
          PatientName: patientData.PatientName
        },
        Force: true
      };

      const response = await this.client.post(`/instances/${instanceId}/modify`, modifyPayload);

      const newInstanceId = response.data.ID;
      console.log('[OrthancService] Tags mis à jour. Nouvelle instance:', newInstanceId);
      return newInstanceId;
    } catch (error) {
      console.error('[OrthancService] ERREUR mise à jour tags:', error.message);
      throw error;
    }
  }

  // Supprimer une étude
  async deleteStudy(studyInstanceUID, userId) {
    try {
      // Vérifier que l'étude appartient bien au patient
      const study = await Study.findOne({ 
        studyInstanceUID,
        userId,
        status: 'active'
      });

      if (!study) {
        throw new Error('Étude non trouvée ou non autorisée');
      }

      // Marquer l'étude comme supprimée dans notre base
      study.status = 'deleted';
      await study.save();

      // Supprimer de Orthanc
      await this.client.delete(`/studies/${study.orthancId}`);
      
      return true;
    } catch (error) {
      console.error('❌ [OrthancService] Erreur suppression étude:', error.message);
      throw error;
    }
  }

  // Récupérer toutes les études
  async getAllStudies() {
    try {
      await this.checkConnection();
      console.log('🔍 [OrthancService] Récupération des études...');
      
      // Récupérer les IDs des études
      const response = await this.client.get('/studies');
      const studyIds = response.data;
      
      // Pour chaque ID, récupérer les détails complets
      const studiesWithDetails = await Promise.all(
        studyIds.map(async (studyId) => {
          try {
            const detailResponse = await this.client.get(`/studies/${studyId}`);
            const studyData = detailResponse.data;
            
            // Extraire les informations importantes des tags DICOM
            const mainDicomTags = studyData.MainDicomTags || {};
            const patientMainDicomTags = studyData.PatientMainDicomTags || {};
            
            return {
              // ID interne Orthanc (pour les appels API internes)
              orthancId: studyId,
              // StudyInstanceUID DICOM (pour l'identification unique)
              StudyInstanceUID: mainDicomTags.StudyInstanceUID || studyId,
              // Informations du patient
              PatientName: patientMainDicomTags.PatientName || 'Patient inconnu',
              PatientID: patientMainDicomTags.PatientID || '',
              // Informations de l'étude
              StudyDate: this.formatStudyDate(mainDicomTags.StudyDate) || 'Date inconnue',
              StudyTime: mainDicomTags.StudyTime || '',
              StudyDescription: mainDicomTags.StudyDescription || 'Description non disponible',
              AccessionNumber: mainDicomTags.AccessionNumber || '',
              ModalitiesInStudy: mainDicomTags.ModalitiesInStudy || '',
              NumberOfSeriesRelatedInstances: studyData.Series ? studyData.Series.length : 0
            };
          } catch (error) {
            console.error(`❌ Erreur détails étude ${studyId}:`, error);
            return {
              orthancId: studyId,
              StudyInstanceUID: studyId,
              PatientName: 'Patient inconnu',
              StudyDate: 'Date inconnue',
              StudyDescription: 'Description non disponible'
            };
          }
        })
      );
      
      console.log('✅ [OrthancService]', studiesWithDetails.length, 'études récupérées avec détails');
      return studiesWithDetails;
    } catch (error) {
      console.error('❌ [OrthancService] Erreur récupération études:', error.message);
      throw error;
    }
  }

  // Récupérer les instances d'une étude
  async getStudyInstances(studyId) {
    try {
      console.log('[OrthancService] Récupération des instances pour l\'étude:', studyId);
      const response = await this.client.get(`/studies/${studyId}/instances`);
      return response.data;
    } catch (error) {
      console.error('[OrthancService] Erreur lors de la récupération des instances:', error.message);
      throw error;
    }
  }

  // Récupérer le fichier d'une instance
  async getInstanceFile(instanceId) {
    try {
      console.log('[OrthancService] Récupération du fichier pour l\'instance:', instanceId);
      const response = await this.client.get(`/instances/${instanceId}/file`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      console.error('[OrthancService] Erreur lors de la récupération du fichier:', error.message);
      throw error;
    }
  }

  // Récupérer une étude spécifique
  async getStudy(studyInstanceUID) {
    try {
      console.log('[OrthancService] Récupération de l\'étude:', studyInstanceUID);
      const response = await this.client.get(`/studies/${studyInstanceUID}`);
      return response.data;
    } catch (error) {
      console.error('[OrthancService] Erreur lors de la récupération de l\'étude:', error.message);
      throw error;
    }
  }

  // Récupérer une prévisualisation PNG d'une étude
  async getStudyPreview(studyId) {
    try {
      console.log(`🔍 [OrthancService] Début getStudyPreview pour studyId: ${studyId}`);
      
      // Vérifier la connexion à Orthanc
      const isConnected = await this.checkConnection();
      console.log(`🔌 [OrthancService] Connexion Orthanc: ${isConnected ? 'OK' : 'ERREUR'}`);
      
      if (!isConnected) {
        throw new Error('Impossible de se connecter à Orthanc');
      }

      // Récupérer toutes les études pour trouver l'orthancId
      console.log(`🔍 [OrthancService] Recherche de l'étude dans la liste des études...`);
      const studies = await this.getAllStudies();
      const study = studies.find(s => s.StudyInstanceUID === studyId);
      
      if (!study) {
        console.error(`❌ [OrthancService] Étude non trouvée dans la liste: ${studyId}`);
        throw new Error(`L'étude ${studyId} n'existe pas dans Orthanc`);
      }

      console.log(`✅ [OrthancService] Étude trouvée avec orthancId: ${study.orthancId}`);

      // Récupérer les instances de l'étude en utilisant l'orthancId
      console.log(`📥 [OrthancService] Récupération des instances pour l'étude: ${study.orthancId}`);
      const instances = await this.getStudyInstances(study.orthancId);
      
      if (!instances || instances.length === 0) {
        console.error(`❌ [OrthancService] Aucune instance trouvée pour l'étude: ${study.orthancId}`);
        throw new Error(`Aucune instance trouvée pour l'étude ${studyId}`);
      }

      // Utiliser la première instance pour la prévisualisation
      const firstInstance = instances[0];
      console.log(`📸 [OrthancService] Utilisation de l'instance: ${firstInstance.ID} pour la prévisualisation`);

      // Récupérer la prévisualisation PNG
      const previewResponse = await axios.get(
        `${this.client.defaults.baseURL}/instances/${firstInstance.ID}/preview`,
        { responseType: 'arraybuffer' }
      );

      console.log(`✅ [OrthancService] Prévisualisation récupérée - Taille: ${previewResponse.data.length} bytes`);
      return previewResponse.data;
    } catch (error) {
      console.error(`❌ [OrthancService] Erreur détaillée lors de la prévisualisation:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        studyId
      });
      throw error;
    }
  }
}

module.exports = new OrthancService(); 