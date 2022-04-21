/* eslint-disable no-constructor-return */
const fs = require('fs');
const path = require('path');

const { createJwt } = require('../utils/createJwt');
const {
  PROJECT_ID,
  ALGORITHM,
  TOKEN_EXPIRE_MIN,
  TO_MS,
  REGION,
  REGISTRY_ID,
} = require('../constants');

const ClientMqtt = require('./ClientMqtt');

const serverCertFile = path.resolve(__dirname, '../certs/roots.pem');

const MQTT_BRIDGE_HOSTNAME = `mqtt.googleapis.com`;
const MQTT_BRIDGE_PORT = 8883;

const connectionIotCoreArgs = {
  host: MQTT_BRIDGE_HOSTNAME,
  port: MQTT_BRIDGE_PORT,
  username: 'unused',
  password: createJwt(PROJECT_ID, ALGORITHM),
  protocol: 'mqtts',
  secureProtocol: 'TLSv1_2_method',
  ca: [fs.readFileSync(serverCertFile)],
};

class ClientMqttIotCore extends ClientMqtt {
  constructor(meterId) {
    const deviceClientId = `projects/${PROJECT_ID}/locations/${REGION}/registries/${REGISTRY_ID}/devices/${meterId}`;
    connectionIotCoreArgs.clientId = deviceClientId;

    super('Iot Core', connectionIotCoreArgs);
    this.meterId = meterId;

    if (this.constructor.instance) return this.constructor.instance;
    this.constructor.instance = this;

    setInterval(() => this.renewConnection(), (TOKEN_EXPIRE_MIN - 10) * TO_MS);
  }

  // @Override
  // onMessage() {
  //   this.client.on('message', (topic, message) => {
  //     if (topic === `/devices/${this.meterId}/config`) {

  //     } else if (topic.startsWith(`/devices/${this.meterId}/commands`)) {
  //     }
  //     const msg = Buffer.from(message, 'base64').toString('ascii');
  //     if (mosquittoClientRef) {
  //       // TODO convert xpe configuration, to task_frequency format
  //     }
  //   });
  // }

  renewConnection() {
    console.log('Renew Iot Core connection token.');

    this.client.removeAllListeners();
    this.endConnection();

    this.connectionArgs.clean = true;
    this.connectionArgs.password = createJwt(PROJECT_ID, ALGORITHM);

    this.start();

    this.subscribeTo(`/devices/${this.meterId}/config`, 1);
    this.subscribeTo(`/devices/${this.meterId}/commands`, 0);
  }
}

module.exports = ClientMqttIotCore;
