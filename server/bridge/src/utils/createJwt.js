const jwt = require('jsonwebtoken');
const fs = require('fs');

const { TOKEN_EXPIRE_MIN } = require('../constants');

const createJwt = (projectId, privateKeyFile, algorithm) => {
  // Create a JWT to authenticate this device. The device will be disconnected
  // after the token expires, and will have to reconnect with a new token. The
  // audience field should always be set to the GCP project id.
  const token = {
    iat: parseInt(Date.now() / 1000, 10),
    exp: parseInt(Date.now() / 1000, 10) + TOKEN_EXPIRE_MIN, // plus 5 minutes
    aud: projectId,
  };

  const privateKey = fs.readFileSync(privateKeyFile);

  return jwt.sign(token, privateKey, { algorithm });
};

module.exports = { createJwt };
