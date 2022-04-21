const axios = require('axios').default;

const { PROJECT_ID, REGION, REGISTRY_ID } = require('./constants');

const ClientMqttMosquitto = require('./classes/ClientMqttMosquitto');
const ClientMqttIotCore = require('./classes/ClientMqttIotCore');

const createIotCoreDevice = async (meterId) => {
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
};

async function start() {
  const METER_ID = process.env?.METER_ID;

  const clientMosquitto = new ClientMqttMosquitto(METER_ID);

  clientMosquitto.start();
  clientMosquitto.subscribeTo(`remota/${METER_ID}/#`);

  const isDeviceCreated = await createIotCoreDevice(METER_ID);

  if (isDeviceCreated) {
    const clientIotCore = new ClientMqttIotCore(METER_ID);

    clientIotCore.start();
    clientIotCore.subscribeTo(`/devices/${METER_ID}/config`, 1);
    clientIotCore.subscribeTo(`/devices/${METER_ID}/commands`, 0);
  }
}

start();
