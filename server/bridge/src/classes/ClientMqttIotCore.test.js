const ClientMqttIotCore = require('./ClientMqttIotCore');

describe('Client Iot Core', () => {
  const meterId = 'xp000000000000001235';

  const spyStart = jest
    .spyOn(ClientMqttIotCore.prototype, 'start')
    .mockImplementation(() => {
      console.log('mock start');
    });
  const spySub = jest
    .spyOn(ClientMqttIotCore.prototype, 'subscribeTo')
    .mockImplementation(() => {
      console.log('mock subscribeTo');
    });
  const spyEnd = jest
    .spyOn(ClientMqttIotCore.prototype, 'endConnection')
    .mockImplementation(() => {
      console.log('mock end connection');
    });

  const configTopic = `/devices/${meterId}/config`;
  const commandTopic = `/devices/${meterId}/commands`;
  const configQos = 1;
  const commandQos = 0;

  afterAll(() => {
    spyStart.mockRestore();
    spySub.mockRestore();
    spyEnd.mockRestore();
  });

  it('should pass instance initialization', () => {
    // eslint-disable-next-line no-unused-vars
    const clientIotCore = new ClientMqttIotCore(meterId);

    expect(spySub.mock.calls[0][0]).toBe(configTopic);
    expect(spySub.mock.calls[0][1]).toBe(configQos);
    expect(spySub.mock.calls[1][0]).toBe(commandTopic);
    expect(spySub.mock.calls[1][1]).toBe(commandQos);

    expect(spyStart).toBeCalledTimes(1);
    expect(spySub).toBeCalledTimes(2);
  });

  it('should renew a clean connection with new token', () => {
    const clientIotCore = new ClientMqttIotCore(meterId);

    jest.useFakeTimers().setSystemTime(new Date('2022-04-22T12:04:00'));
    clientIotCore.connect();
    const prevPwd = clientIotCore.connectionArgs.password;

    jest.useFakeTimers().setSystemTime(new Date('2022-04-22T12:10:00'));
    clientIotCore.renewConnection();
    const currPwd = clientIotCore.connectionArgs.password;

    expect(clientIotCore.connectionArgs.clean).toBe(true);
    expect(prevPwd).not.toBe(currPwd);

    expect(spyStart).toBeCalledTimes(2);
    expect(spySub).toBeCalledTimes(4);
    expect(spyEnd).toBeCalledTimes(1);

    expect(spySub.mock.calls[0][0]).toBe(configTopic);
    expect(spySub.mock.calls[0][1]).toBe(configQos);
    expect(spySub.mock.calls[1][0]).toBe(commandTopic);
    expect(spySub.mock.calls[1][1]).toBe(commandQos);

    jest.useRealTimers();
  });
});
