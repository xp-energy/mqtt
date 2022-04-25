const Bridge = require('./Bridge');

const ClientMqttIotCore = require('./ClientMqttIotCore');
const ClientMqttMosquitto = require('./ClientMqttMosquitto');

jest.mock('./ClientMqttMosquitto');
jest.mock('./ClientMqttIotCore');

describe('Bridge constructor', () => {
  const meterId = 'xp000000000000001235';

  beforeEach(() => {
    // Limpa todas as instâncias e chamadas de construtor e todos os métodos:
    ClientMqttIotCore.mockClear();
    ClientMqttMosquitto.mockClear();
  });

  it('should create mosquitto and iot core clients', () => {
    const bridge = new Bridge(meterId);
    bridge.link();

    expect(bridge.iotCoreConn.onMessage).toHaveBeenCalledTimes(1);
    expect(bridge.mosquittoConn.onMessage).toHaveBeenCalledTimes(1);

    expect(bridge.iotCoreConn.onMessage.mock.calls[0][0]).toBeTruthy();
    expect(bridge.mosquittoConn.onMessage.mock.calls[0][0]).toBeTruthy();

    expect(ClientMqttIotCore).toHaveBeenCalledTimes(1);
    expect(ClientMqttMosquitto).toHaveBeenCalledTimes(1);
    expect(ClientMqttIotCore).toHaveBeenCalledWith(meterId);
    expect(ClientMqttMosquitto).toHaveBeenCalledWith(meterId);
  });

  it('should on message calls for two client instances', () => {
    // const bridge = new Bridge(meterId);
    // bridge.link();
    // const spyOnMsg = jest
    //   .spyOn(Bridge.prototype, '#linkMosquitto')
    //   .mockImplementation(() => {
    //     console.log('onMessageMock');
    //   });
    // console.log(spyOnMsg.mock);
  });
});
