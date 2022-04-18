require('dotenv').config({ path: '../../../.env' });

const mqtt = require('mqtt');

console.log(
  process.env.HOST,
  process.env.PORT,
  process.env.USER,
  process.env.PASSWORD
);

const client = mqtt.connect({
  host: process.env.LOCAL_IPV4_ADDRESS,
  port: process.env.PORT,
  username: process.env.USER,
  password: process.env.PASSWORD,
  protocol: 'mqtt',
  rejectUnauthorized: false,
  // ca: fs.readFileSync(__dirname + "/../certs/ca/ca.crt"),
  // cert: fs.readFileSync(__dirname + "/../certs/client/client.crt"),
  // key: fs.readFileSync(__dirname + "/../certs/client/client.key"),
});

function treatTimestamp(date) {
  return date.toISOString().replace(/\..*/g, '');
}

client.on('connect', (success) => {
  if (success) {
    console.log('connected to mosquitto server.');
    client.publish('remota/1235/login', '{"esn": 1235}');

    const framesFormat = {
      cmd: '',
      esn: '',
      frames: [],
      fc: 0,
      pt: 0,
      frame: '009082b80b1400F9',
      ts: '',
      timestamp: '',
    };

    const now = new Date();

    setInterval(() => {
      framesFormat.ts = treatTimestamp(now);
      now.setSeconds(now.getSeconds() + 10);

      console.log('sending publication...');

      client.publish(
        'remota/xp000000000000001235/frames',
        JSON.stringify(framesFormat)
      );
    }, 10000);
  } else {
    console.log('Not connected to mosquitto server...');
  }

  // client.end();
});
