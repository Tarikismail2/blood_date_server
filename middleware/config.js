const crypto = require('crypto');

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Générer la clé secrète une seule fois au démarrage de l'application
const JWT_SECRET = generateSecretKey();

module.exports = {
    JWT_SECRET: JWT_SECRET
};
