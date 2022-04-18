const mqtt = require('mqtt');

function createMQTTClient(
  connectionArgs,
  onConnectCallback,
  onMessageCallback,
  onErrorCallback,
  onCloseCallback
) {
  const client = mqtt.connect(connectionArgs);

  client.on('connect', onConnectCallback);
  client.on('message', onMessageCallback);
  client.on('error', onErrorCallback);
  client.on('close', onCloseCallback);

  return client;
}

module.exports = {
  createMQTTClient,
};
