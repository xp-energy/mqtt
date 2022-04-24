const Bridge = require('./Bridge');

const ClientMqttIotCore = require('./ClientMqttIotCore');
const ClientMqttMosquitto = require('./ClientMqttMosquitto');

jest.mock('./ClientMqttMosquitto');
jest.mock('./ClientMqttIotCore');

describe('Bridge constructor', () => {
  beforeEach(() => {
    // Limpa todas as instâncias e chamadas de construtor e todos os métodos:
    ClientMqttIotCore.mockClear();
    ClientMqttMosquitto.mockClear();
  });

  it('should create mosquitto and iot core clients', () => {
    const meterId = 'xp000000000000001235';

    const bridge = new Bridge(meterId);
    bridge.link();

    expect(bridge.iotCoreConn.onMessage).toHaveBeenCalledTimes(1);
    expect(bridge.mosquittoConn.onMessage).toHaveBeenCalledTimes(1);

    expect(ClientMqttIotCore).toHaveBeenCalledTimes(1);
    expect(ClientMqttMosquitto).toHaveBeenCalledTimes(1);
    expect(ClientMqttIotCore).toHaveBeenCalledWith(meterId);
    expect(ClientMqttMosquitto).toHaveBeenCalledWith(meterId);
  });
});
