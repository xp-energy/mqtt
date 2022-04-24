// const ClientMqttIotCore = require('./ClientMqttIotCore');

// jest.mock('./ClientMqttIotCore');

// const mockStart = jest.fn();
// const mockSubscribeTo = jest.fn();

// jest.mock('./ClientMqttIotCore', () =>
//   jest.fn().mockImplementation(() => ({
//     start: mockStart,
//     // subscribeTo: mockSubscribeTo,
//   }))
// );

describe('Client Iot Core', () => {
  // beforeEach(() => {
  //   // Limpa todas as instâncias e chamadas de construtor e todos os métodos:
  //   ClientMqttIotCore.mockClear();
  // });

  it('should connect with success', () => {
    // const meterId = 'xp000000000000001235';
    // const spyStart = jest
    //   .spyOn(ClientMqttIotCore.prototype, 'start')
    //   .mockImplementation(() => {
    //     console.log('mock start');
    //   });
    // const spySubsc = jest
    //   .spyOn(ClientMqttIotCore.prototype, 'subscribeTo')
    //   .mockImplementation(() => {
    //     console.log('mock subscribe');
    //   });
    // const clientIotCore = new ClientMqttIotCore(meterId);
    // expect(spyStart).toBeCalledTimes(1);
    // expect(spySubsc).toBeCalledTimes(2);
  });
});
