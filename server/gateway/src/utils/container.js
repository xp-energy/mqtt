const Docker = require('dockerode');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

async function getContainerByName(name) {
  // filter by name
  const opts = {
    limit: 1,
    filters: `{"name": ["${name}"]}`,
  };

  const response = await docker.listContainers(opts);
  if (Array.isArray(response)) {
    return response?.[0];
  }

  return null;
}

function createContainerByName(name) {
  docker.createContainer(
    {
      Image: 'mqtt_bridge:latest',
      Cmd: ['node', 'src/index.js'],
      Env: [
        `METER_ID=${name}`,
        `HOST=${process.env.HOST}`,
        `PORT=${process.env.PORT}`,
        `USER=${process.env.USER}`,
        `PASSWORD=${process.env.PASSWORD}`,
      ],
      name,
      HostConfig: {
        NetworkMode: 'net',
      },
    },
    (err, container) => {
      if (!err) {
        console.log(`Create new container for ${name}...`);

        container.start((startErr) => {
          if (!startErr) {
            console.log(`Container ${name} started!`);
          } else {
            console.log(`Container ${name} failed to start! ${startErr}`);
          }
        });
      } else {
        console.log(`Container creation for ${name} failed! ${err}`);
      }
    }
  );
}

async function runContainerByName(name) {
  const containerProps = await getContainerByName(name);

  if (!containerProps) {
    createContainerByName(name);
  } else if (containerProps.State === 'exited') {
    const exitedContainer = await docker.getContainer(containerProps.Id);

    console.log(`Container for ${name} already exist, but status is exited`);
    console.log(`Restarting ${name} container...`);

    const res = await exitedContainer.restart();

    if (!res.message) {
      console.log(`Container ${name} restarted with success!`);
    } else {
      console.log(`Error to restart ${name} container. ${res.message}!`);
    }
  } else if (containerProps.State === 'running') {
    console.log(`Container for ${name} already running`);
  } else {
    console.log(`Container for ${name} couldn't run.`);
  }
}

module.exports = {
  createContainerByName,
  getContainerByName,
  runContainerByName,
};
