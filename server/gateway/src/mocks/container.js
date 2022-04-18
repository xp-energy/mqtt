const meterId = 'xp000000000000001235';

const mockedContainerListResponse = [
  {
    Id: '1d90b67c28aad686cd52a5b32de00fcea4e70a4d446b039ed1a78e5826e01a70',
    Names: [`/${meterId}}`],
    Image: 'mqtt_bridge:latest',
    ImageID:
      'sha256:48162883bbc719e7e25a66ad11bc59e4ebf0e2e64307bd576ce9445f6d24f2c1',
    Command: 'docker-entrypoint.sh node src/index.js',
    Created: 1650209521,
    Ports: [],
    Labels: {},
    State: 'running',
    Status: 'Up 14 seconds',
    HostConfig: { NetworkMode: 'net' },
    NetworkSettings: { Networks: [Object] },
    Mounts: [],
  },
];

const mockedFirstArgsToCreateContainer = {
  Image: 'mqtt_bridge:latest',
  Cmd: ['node', 'src/index.js'],
  Env: [
    `METER_ID=${meterId}`,
    `HOST=${process.env.HOST}`,
    `PORT=${process.env.PORT}`,
    `USER=${process.env.USER}`,
    `PASSWORD=${process.env.PASSWORD}`,
  ],
  name: meterId,
  HostConfig: {
    NetworkMode: 'net',
  },
};

const mockedGetContainerNoErrorResponse = {
  restart: () => ({
    message: '',
  }),
};

const mockedGetContainerErrorResponse = {
  restart: () => ({
    message: 'any error',
  }),
};

module.exports = {
  mockedContainerListResponse,
  mockedFirstArgsToCreateContainer,
  mockedGetContainerNoErrorResponse,
  mockedGetContainerErrorResponse,
};
