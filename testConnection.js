const db = require('./dbconfig');

async function testConnection() {
    try {
        const devicesSnapshot = await db.collection('dispositivos').get();
        const devices = devicesSnapshot.docs.map(doc => doc.data());
        console.log('Dispositivos:', devices);
    } catch (error) {
        console.error('Error conectando a Firebase:', error);
    }
}

testConnection();
