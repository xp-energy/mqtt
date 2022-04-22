const { PROJECT_ID, ALGORITHM } = require('../constants');

const { createJwt } = require('./createJwt');

describe('JWT Token', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-04-22T12:04:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return a jwt valid string', () => {
    const res = createJwt(PROJECT_ID, ALGORITHM);

    expect(res).toBe(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTA2Mzk4NDAsImV4cCI6MTY1MDYzOTk2MCwiYXVkIjoieHBlcmVzaWRlbmNpYWwifQ.fctMw7Qgqg4HAn9GzrjezFfp5rOTcSJvfT2pYYJsoRE2qyMK_4KbTzQ2qN7hqvSSbBSykw5jsCw21uWcfF2nS_yi3Nvdw1hfuuWzA0bc7ecvfv4bTg6ehK8XGI9BCWch5cuKW9jSvQV8ZUb4XjYMArj4F38UDYou9S7M9g8E1uc_f8V_XXJCEK2RsrVzZZP-Vxz8yT-IGAG-Fsx3Z-KpYB_WC7VTu3KONt9xQ70NF97IyPz2qWjvCkIG_ksHPOizkAHzEzLuw3iAixBVOpqkzUFwCqjlRJKfO77k8744iRqN-N0npeYbAcJUU32EVrsUu30LPpdlLjVv2jkwOCqLiw'
    );
  });
});
