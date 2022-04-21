const { fromRemotaToXPEId } = require('./idConversion');

describe('Id Conversion', () => {
  it('should convert numeric remota id to xpe id', () => {
    const remotaId = '1235';
    const xpeId = 'xp000000000000001235';

    const res = fromRemotaToXPEId(remotaId);
    console.log('test', res);
    expect(res).toBe(xpeId);
  });
});
