const crypto = require('crypto');

const generateSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

const JWT_SECRET = generateSecretKey();

module.exports = {
    JWT_SECRET: JWT_SECRET
};
