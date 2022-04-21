const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const { TOKEN_EXPIRE_MIN } = require('../constants');

const privateKeyFile = path.resolve(__dirname, '../certs/rsa_private.pem');

const createJwt = (projectId, algorithm) => {
  // Create a JWT to authenticate this device. The device will be disconnected
  // after the token expires, and will have to reconnect with a new token. The
  // audience field should always be set to the GCP project id.
  const token = {
    iat: parseInt(Date.now() / 1000, 10),
    exp: parseInt(Date.now() / 1000, 10) + TOKEN_EXPIRE_MIN, // plus 20 minutes
    aud: projectId,
  };

  const privateKey = fs.readFileSync(privateKeyFile);

  return jwt.sign(token, privateKey, { algorithm });
};

module.exports = { createJwt };
