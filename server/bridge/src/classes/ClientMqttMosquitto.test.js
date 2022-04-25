const ClientMqttMosquitto = require('./ClientMqttMosquitto');

describe('Client Iot Core', () => {
  const meterId = 'xp000000000000001235';

  const spyStart = jest
    .spyOn(ClientMqttMosquitto.prototype, 'start')
    .mockImplementation(() => {
      console.log('mock start');
    });
  const spySub = jest
    .spyOn(ClientMqttMosquitto.prototype, 'subscribeTo')
    .mockImplementation(() => {
      console.log('mock subscribeTo');
    });

  const topic = `remota/${meterId}/#`;
  const qos = 1;

  afterAll(() => {
    spyStart.mockRestore();
    spySub.mockRestore();
  });

  it('should pass instance initialization', () => {
    // eslint-disable-next-line no-unused-vars
    const clientMqttMosquitto = new ClientMqttMosquitto(meterId);

    expect(spySub.mock.calls[0][0]).toBe(topic);
    expect(spySub.mock.calls[0][1]).toBe(qos);

    expect(spyStart).toBeCalledTimes(1);
    expect(spySub).toBeCalledTimes(1);
  });
});
