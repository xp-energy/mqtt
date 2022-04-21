const mqtt = require('mqtt');
// const fs = require("fs");

const { runContainerByName } = require('./utils/container');
const { fromRemotaToXPEId } = require('./utils/idConversion');

const client = mqtt.connect({
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USER,
  password: process.env.PASSWORD,
  protocol: 'mqtt',
  rejectUnauthorized: false,
  // ca: fs.readFileSync(__dirname + "/../certs/ca/ca.crt"),
  // cert: fs.readFileSync(__dirname + "/../certs/client/client.crt"),
  // key: fs.readFileSync(__dirname + "/../certs/client/client.key"),
});

client.on('connect', (success) => {
  if (success) {
    console.log('Gateway connected!');
  } else {
    console.log('Error to connect gateway!');
  }

  client.subscribe('remota/+/login');
});

client.on('message', (topic, message) => {
  const msg = JSON.parse(message.toString());

  if (topic.startsWith('remota/')) {
    runContainerByName(fromRemotaToXPEId(msg.esn));
  }

  console.log(message.toString());
});
