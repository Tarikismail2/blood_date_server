const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token.' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
