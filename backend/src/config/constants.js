module.exports = {
  OHIF_VIEWER_CONFIG: {
    BASE_URL: 'https://viewer.ohif.org/viewer',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  ORTHANC_CONFIG: {
    BASE_URL: process.env.ORTHANC_URL || 'http://localhost:8042',
    TIMEOUT: 5000,
    USERNAME: process.env.ORTHANC_USERNAME || 'orthanc',
    PASSWORD: process.env.ORTHANC_PASSWORD || 'orthanc'
  },
  FRONTEND_CONFIG: {
    BASE_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    TIMEOUT: 5000
  }
}; 