const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

if (!admin.apps.length) {
    console.log('Initializing Firebase Admin...');
    
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const auth = getAuth();

module.exports = {
    admin,
    auth
};
