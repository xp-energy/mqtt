const ClientMqtt = require('./ClientMqtt');
const ClientMqttIotCore = require('./ClientMqttIotCore');

const { frameToXPEInput } = require('../utils/remota');

const connectionMosquittoArgs = {
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USER,
  password: process.env.PASSWORD,
  protocol: 'mqtt',
  rejectUnauthorized: false,
  // #region certificates
  // ca: fs.readFileSync(__dirname + "/../certs/ca/ca.crt"),
  // cert: fs.readFileSync(__dirname + "/../certs/client/client.crt"),
  // key: fs.readFileSync(__dirname + "/../certs/client/client.key"),
  // #endregion certificates
};

class ClientMqttMosquitto extends ClientMqtt {
  constructor(meterId) {
    super('Mosquitto', connectionMosquittoArgs);
    this.meterId = meterId;
  }

  // @Override
  onMessage() {
    const iotCoreClientRef = new ClientMqttIotCore(this.meterId);

    this.client.on('message', (topic, message) => {
      const iotCoreTopic = `/devices/${this.meterId}/events`;
      const msg = message.toString();

      if (topic === `remota/${this.meterId}/frames`) {
        const data = JSON.parse(msg);
        const xpInput = frameToXPEInput(this.meterId, data);

        iotCoreClientRef.publishTo(iotCoreTopic, xpInput, 1);
      }
    });
  }
}

module.exports = ClientMqttMosquitto;
