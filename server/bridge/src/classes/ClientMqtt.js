const mqtt = require('mqtt');

class ClientMqtt {
  constructor(name, connectionArgs) {
    console.log(`create client ${name}`);
    this.name = name;
    this.connectionArgs = connectionArgs;
  }

  connect() {
    this.client = mqtt.connect(this.connectionArgs);
  }

  onConnect() {
    this.client.on('connect', (success) => {
      if (success) console.log(`Connected with success to ${this.name}.`);
      else console.log(`Fail to connect with ${this.name}`);
    });
  }

  onMessage(callback) {
    if (callback) this.client.on('message', callback);
    else console.log('message service fail, callback is empty');
  }

  onError() {
    this.client.on('error', (err) => {
      console.log(
        `Error occurred in ${this.name} client connection. ${err || ''}`
      );
    });
  }

  onClose() {
    this.client.on('close', () => {
      console.log(`Close ${this.name} connection... good bye.`);
    });
  }

  subscribeTo(topic, qos = 0) {
    this.client.subscribe(topic, { qos }, (err) => {
      if (err) {
        console.log(`Fail to subscribe from ${topic}. Error: ${err.message}`);
      }
    });
  }

  publishTo(topic, msg, qos = 0) {
    this.client.publish(topic, msg, { qos }, (err) => {
      if (err) {
        console.log(`Fail to publish to ${topic}. Error: ${err.message}`);
      } else {
        console.log(`Success to publish to ${topic}.`);
      }
    });
  }

  endConnection() {
    console.log(`Ending ${this.name} connection... good bye.`);
    this.client.end();
  }

  start() {
    this.connect();
    this.onConnect();
    this.onMessage();
    this.onClose();
    this.onError();
  }
}

module.exports = ClientMqtt;
