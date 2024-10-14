const admin = require('firebase-admin');
const serviceAccount = require('./firebaseConfig.json'); // Asegúrate de que el archivo JSON esté en tu proyecto

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Esto inicializa Firestore

module.exports = db;
