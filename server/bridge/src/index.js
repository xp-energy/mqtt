const fs = require('fs');
const axios = require('axios').default;

const { createJwt } = require('./utils/createJwt');
const {
  createMosquittoConnection,
  createIotCoreConnection,
} = require('./utils/connections');

const { TOKEN_EXPIRE_MIN } = require('./constants');

async function start() {
  const METER_ID = process.env?.METER_ID;

  const projectId = `xperesidencial`;
  const region = `us-central1`;
  const registryId = `measurementsNode`;
  const algorithm = `RS256`;
  const privateKeyFile = `${__dirname}/certs/rsa_private.pem`;
  const serverCertFile = `${__dirname}/certs/roots.pem`;
  const mqttBridgeHostname = `mqtt.googleapis.com`;
  const mqttBridgePort = 8883;

  const deviceClientId = `projects/${projectId}/locations/${region}/registries/${registryId}/devices/${METER_ID}`;

  const connectionIotCoreArgs = {
    host: mqttBridgeHostname,
    port: mqttBridgePort,
    clientId: deviceClientId,
    username: 'unused',
    password: createJwt(projectId, privateKeyFile, algorithm),
    protocol: 'mqtts',
    secureProtocol: 'TLSv1_2_method',
    ca: [fs.readFileSync(serverCertFile)],
  };

  const connectionMosquittoArgs = {
    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USER,
    password: process.env.PASSWORD,
    protocol: 'mqtt',
    rejectUnauthorized: false,
    // ca: fs.readFileSync(__dirname + "/../certs/ca/ca.crt"),
    // cert: fs.readFileSync(__dirname + "/../certs/client/client.crt"),
    // key: fs.readFileSync(__dirname + "/../certs/client/client.key"),
  };

  // * Mosquitto connection
  const clientMosquitto = createMosquittoConnection(connectionMosquittoArgs);
  clientMosquitto.subscribe(`remota/${METER_ID}/#`);

  const createIotCoreDevice = async () => {
    const data = JSON.stringify({
      cloudRegion: region,
      deviceId: METER_ID,
      projectId,
      registryId,
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

  let clientIotCore = null;

  const refreshConnection = () => {
    if (clientIotCore) {
      console.log('reset connection with new token');
      clientIotCore.removeAllListeners();
      clientIotCore.end();

      connectionIotCoreArgs.clean = true;
      connectionIotCoreArgs.password = createJwt(
        projectId,
        privateKeyFile,
        algorithm
      );
    }

    clientIotCore = createIotCoreConnection(connectionIotCoreArgs);
    // Subscribe to the /devices/{device-id}/config topic to receive config updates.
    clientIotCore.subscribe(`/devices/${METER_ID}/config`, { qos: 1 });
    // Subscribe to the /devices/{device-id}/commands/# topic to receive all
    clientIotCore.subscribe(`/devices/${METER_ID}/commands/#`, { qos: 0 });
  };

  const isDeviceCreated = await createIotCoreDevice();

  if (isDeviceCreated) {
    refreshConnection();
    setInterval(refreshConnection, (TOKEN_EXPIRE_MIN - 10) * 1000);
  }
}

start();
