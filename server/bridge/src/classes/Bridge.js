const { TOKEN_EXPIRE_MIN, TO_MS } = require('../constants');
const {
  convertXPEConfigToTaskFrequency,
  convertXPEIdToRemotaFormat,
  frameToXPEInput,
} = require('../utils/remota');

const ClientMqttIotCore = require('./ClientMqttIotCore');
const ClientMqttMosquitto = require('./ClientMqttMosquitto');

class Bridge {
  constructor(meterId) {
    this.meterId = meterId;

    this.mosquittoConn = new ClientMqttMosquitto(meterId);
    this.iotCoreConn = new ClientMqttIotCore(meterId);

    setInterval(() => {
      this.iotCoreConn.renewConnection();
      this.#linkIotCore();
    }, (TOKEN_EXPIRE_MIN - 10) * TO_MS);
  }

  #linkMosquitto() {
    const onMessageMosquitto = (topic, message) => {
      const iotCoreTopic = `/devices/${this.meterId}/events`;
      const msg = message.toString();

      if (topic === `remota/${this.meterId}/frames`) {
        const data = JSON.parse(msg);
        const xpInput = frameToXPEInput(this.meterId, data);

        this.iotCoreConn.publishTo(iotCoreTopic, xpInput, 1);
      }
    };
    this.mosquittoConn.onMessage(onMessageMosquitto);
  }

  #linkIotCore() {
    const onMessageIotCore = (topic, message) => {
      const msg = Buffer.from(message, 'base64').toString('ascii');
      console.log('Config received', msg);

      if (topic === `/devices/${this.meterId}/config`) {
        const msgConverted = convertXPEConfigToTaskFrequency(msg, new Date());

        if (msgConverted) {
          const remotaId = convertXPEIdToRemotaFormat(this.meterId);
          const mosquittoTopic = `remota/${remotaId}/commands`;

          this.mosquittoConn.publishTo(mosquittoTopic, msgConverted, 1);
        }
      } else if (topic.startsWith(`/devices/${this.meterId}/commands`)) {
        console.log('Command received.');
      }
    };

    this.iotCoreConn.onMessage(onMessageIotCore);
  }

  link() {
    this.#linkMosquitto();
    this.#linkIotCore();
  }
}

module.exports = Bridge;
