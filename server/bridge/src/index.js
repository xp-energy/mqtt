const ClientMqttMosquitto = require('./classes/ClientMqttMosquitto');
const ClientMqttIotCore = require('./classes/ClientMqttIotCore');

const { createIotCoreDevice } = require('./services/iotcore');

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
