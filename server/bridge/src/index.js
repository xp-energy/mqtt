const Bridge = require('./classes/Bridge');
const { createIotCoreDevice } = require('./services/iotcore');

async function start() {
  const METER_ID = process.env?.METER_ID;

  const isDeviceCreated = await createIotCoreDevice(METER_ID);

  if (isDeviceCreated) {
    const bridgeConn = new Bridge(METER_ID);

    bridgeConn.link();
  }
}

start();
