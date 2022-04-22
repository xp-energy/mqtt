const axios = require('axios').default;

const { PROJECT_ID, REGION, REGISTRY_ID } = require('../constants');

async function createIotCoreDevice(meterId) {
  const data = JSON.stringify({
    cloudRegion: REGION,
    deviceId: meterId,
    projectId: PROJECT_ID,
    registryId: REGISTRY_ID,
  });

  const config = {
    method: 'post',
    url: 'https://us-central1-xperesidencial.cloudfunctions.net/createDevice2',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  const response = await axios(config);

  return response.status >= 200 && response.status < 300;
}

module.exports = { createIotCoreDevice };
