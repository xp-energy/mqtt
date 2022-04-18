const {
  convertTimestamp,
  decimal2Fix,
  hex2bin,
  decodeNormalFrame,
  calculateElectricalQuantities,
  frameToXPEInput,
} = require('./remota');

describe('Remota operations', () => {
  it('should remove T from remota timestamp format', () => {
    const date = new Date().toISOString().replace(/\..*/g, '');
    const result = convertTimestamp(date);

    expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g);
  });

  it('should increase two digits beyond dot', () => {
    const result = decimal2Fix(220);

    expect(result).toBe('220.00');
  });

  it('should parse hex to binary', () => {
    const result = hex2bin('f5');

    expect(result).toBe('11110101');
  });

  it('should convert raw optical input to electric pulses format', () => {
    const result = decodeNormalFrame('009082b80b1400F9');

    expect(result).toEqual({
      activePulse: 3000,
      energyFlag: 0,
      reactivePulse: 20,
    });
  });

  it('should calculate electrical quantities', () => {
    const prev = new Date();
    const now = new Date(prev);
    now.setSeconds(prev.getSeconds() + 10);

    const result = calculateElectricalQuantities(3000, 20, now, prev);

    expect(result).toEqual({ i1f: 1636.3999995959687, p1f: 360000, v1f: 220 });
  });

  describe('should check if a frame is convertible', () => {
    const METER_ID = 'xp000000000000001235';
    const framesFormat = {
      cmd: '',
      esn: '',
      frames: [],
      fc: 0,
      pt: 0,
      frame: '009082b80b1400F9',
      ts: '',
      timestamp: '',
    };

    it('should remota frame converted to XPE input format', () => {
      const now1 = new Date();
      const nowTreated1 = now1.toISOString().replace(/\..*/g, '');
      const ts1 = convertTimestamp(nowTreated1);

      framesFormat.ts = ts1;

      const result1 = frameToXPEInput(METER_ID, framesFormat);

      expect(result1).toBe(
        `${METER_ID};${ts1};0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0`
      );

      const now2 = new Date();
      now2.setSeconds(now2.getSeconds() + 10);

      const nowTreated2 = now2.toISOString().replace(/\..*/g, '');
      const ts2 = convertTimestamp(nowTreated2);

      framesFormat.ts = ts2;

      const result2 = frameToXPEInput(METER_ID, framesFormat);

      expect(result2).toBe(
        `${METER_ID};${ts2};220.00;220.00;220.00;1636.40;1636.40;1636.40;360000.00;360000.00;360000.00;0.00;0.00;0.00;0`
      );
    });

    it('should reject invalid input from remota', () => {
      const cpFrameFormat = { ...framesFormat };
      cpFrameFormat.frame = '';

      const result = frameToXPEInput(METER_ID, cpFrameFormat);

      expect(result).toBe(null);
    });
  });
});
