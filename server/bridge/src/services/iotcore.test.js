jest.mock('axios');

const axios = require('axios').default;

const { REGION, PROJECT_ID, REGISTRY_ID } = require('../constants');
const { createIotCoreDevice } = require('./iotcore');

describe('Iot Core create request', () => {
  const meterId = 'xp000000000000001235';
  const data = JSON.stringify({
    cloudRegion: REGION,
    deviceId: meterId,
    projectId: PROJECT_ID,
    registryId: REGISTRY_ID,
  });

  const config = {
    method: 'post',
    url: 'https://us-central1-xperesidencial.cloudfunctions.net/createDevice2',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  };

  it('should create a device successfully', async () => {
    axios.mockResolvedValue({
      status: 201,
      message: 'Device created with success!',
    });

    const res = await createIotCoreDevice(meterId);

    expect(axios).toBeCalledTimes(1);
    expect(axios).toBeCalledWith(config);
    expect(res).toBe(true);
  });

  it('should accept request but device has already been created', async () => {
    axios.mockResolvedValue({
      status: 204,
      message: 'OK.',
    });

    const res = await createIotCoreDevice(meterId);

    expect(axios).toBeCalledTimes(1);
    expect(axios).toBeCalledWith(config);
    expect(res).toBe(true);
  });
});
