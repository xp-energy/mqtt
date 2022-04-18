jest.mock('dockerode');

const Docker = require('dockerode');
const {
  mockedContainerListResponse,
  mockedFirstArgsToCreateContainer,
  mockedGetContainerErrorResponse,
  mockedGetContainerNoErrorResponse,
} = require('../mocks/container');

const {
  createContainerByName,
  getContainerByName,
  runContainerByName,
} = require('./container');

describe('Gateway', () => {
  const docker = Docker.mock.instances[0];
  const meterIdCreated = 'xp000000000000001235';
  const meterIdNotCreated = 'xp000000000000001236';

  beforeEach(() => {
    // * remove all console.logs to test purposes
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should filter container by name', async () => {
    await docker.listContainers.mockResolvedValue(mockedContainerListResponse);
    const res1 = await getContainerByName(meterIdCreated);

    expect(res1).toEqual(mockedContainerListResponse[0]);
    expect(docker.listContainers).toBeCalledWith({
      limit: 1,
      filters: `{"name": ["${meterIdCreated}"]}`,
    });

    await docker.listContainers.mockResolvedValue({
      message: 'Error message from docker API',
    });

    const res2 = await getContainerByName(meterIdNotCreated);

    expect(res2).toBe(null);
  });

  it('should create a Docker container', () => {
    createContainerByName(meterIdCreated);

    expect(docker.createContainer).toBeCalledTimes(1);
    expect(docker.createContainer.mock.calls[0][0]).toEqual(
      mockedFirstArgsToCreateContainer
    );
  });

  it('should run a brand new Docker container', async () => {
    await docker.listContainers.mockResolvedValue(null);
    await runContainerByName(meterIdNotCreated);

    expect(docker.createContainer).toBeCalledTimes(1);
  });

  describe('Container State', () => {
    describe('State === running', () => {
      it('should keep running', async () => {
        await docker.listContainers.mockResolvedValue(
          mockedContainerListResponse
        );

        runContainerByName(meterIdCreated);

        expect(docker.getContainer).toBeCalledTimes(0);
      });
    });

    describe('State === exited', () => {
      beforeEach(async () => {
        const cpMockedContainerListResponse = JSON.parse(
          JSON.stringify(mockedContainerListResponse)
        );
        cpMockedContainerListResponse[0].State = 'exited';

        await docker.listContainers.mockResolvedValue(
          cpMockedContainerListResponse
        );
      });

      it('should restart container with success', async () => {
        await docker.getContainer.mockResolvedValue(
          mockedGetContainerNoErrorResponse
        );
        await runContainerByName(meterIdCreated);

        expect(docker.getContainer).toBeCalledTimes(1);
        expect(docker.getContainer).toBeCalledWith(
          mockedContainerListResponse[0].Id
        );
      });

      it('should fail to restart', async () => {
        await docker.getContainer.mockResolvedValue(
          mockedGetContainerErrorResponse
        );
        await runContainerByName(meterIdCreated);

        expect(docker.getContainer).toBeCalledTimes(1);
        expect(docker.getContainer).toBeCalledWith(
          mockedContainerListResponse[0].Id
        );
      });
    });

    describe('State === unknown', () => {
      beforeEach(async () => {
        const cpMockedContainerListResponse = JSON.parse(
          JSON.stringify(mockedContainerListResponse)
        );
        cpMockedContainerListResponse[0].State = '';

        await docker.listContainers.mockResolvedValue(
          cpMockedContainerListResponse
        );
      });

      it('Fail to re run container', async () => {
        runContainerByName(meterIdCreated);

        expect(docker.getContainer).toBeCalledTimes(0);
      });
    });
  });
});
