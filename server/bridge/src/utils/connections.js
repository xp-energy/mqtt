const { createMQTTClient } = require('./createMQTTClient');

const { frameToXPEInput } = require('./remota');

const METER_ID = process.env?.METER_ID;

let iotCoreClientRef = null;
let mosquittoClientRef = null;

function createIotCoreConnection(connectionArgsIotCore) {
  const onConnect = (success) => {
    if (success) {
      console.log('Bridge connected to Iot Core server.');
    }
  };

  const onClose = () => {
    console.log('close iot core connection');
  };

  const onError = () => {
    console.log(`error: iot core`);
  };

  const onMessage = (topic, message) => {
    let messageStr = 'Message received: ';

    if (topic === `/devices/${METER_ID}/config`) {
      messageStr = 'Config message received: ';
    } else if (topic.startsWith(`/devices/${METER_ID}/commands`)) {
      messageStr = 'Command message received: ';
    }

    messageStr += Buffer.from(message, 'base64').toString('ascii');

    if (mosquittoClientRef) {
      // TODO convert xpe configuration, to task_frequency format
    }

    console.log(messageStr);
  };

  iotCoreClientRef = createMQTTClient(
    connectionArgsIotCore,
    onConnect,
    onMessage,
    onError,
    onClose
  );

  return iotCoreClientRef;
}

function createMosquittoConnection(connectionArgsMosquitto) {
  const onConnect = (success) => {
    if (success) {
      console.log('Bridge connected to Mosquitto server.');
    }
  };

  const onClose = () => {
    console.log('close Mosquitto connection');
  };

  const onError = () => {
    console.log(`error: mosquitto client error.`);
  };

  const onMessage = (topic, message) => {
    const iotCoreTopic = `/devices/${METER_ID}/events`;
    const msg = message.toString();

    if (topic === `remota/${METER_ID}/frames`) {
      const data = JSON.parse(msg);
      const xpInput = frameToXPEInput(METER_ID, data);

      if (iotCoreClientRef) {
        iotCoreClientRef.publish(iotCoreTopic, xpInput, { qos: 1 }, (err) => {
          if (!err) {
            console.log('Success to send telemetry');
          } else {
            console.log('Erro ao publicar...');
          }
        });
      }
    }
  };

  mosquittoClientRef = createMQTTClient(
    connectionArgsMosquitto,
    onConnect,
    onMessage,
    onError,
    onClose
  );

  return mosquittoClientRef;
}

module.exports = {
  createIotCoreConnection,
  createMosquittoConnection,
};
