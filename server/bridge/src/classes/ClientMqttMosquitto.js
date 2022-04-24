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

const ClientMqtt = require('./ClientMqtt');

class ClientMqttMosquitto extends ClientMqtt {
  constructor(meterId) {
    super('Mosquitto', connectionMosquittoArgs);
    this.meterId = meterId;

    this.#initialSubscription();
  }

  #initialSubscription() {
    this.subscribeTo(`remota/${this.meterId}/#`, 1);
  }
}

module.exports = ClientMqttMosquitto;
