function hex2bin(hex) {
  return parseInt(hex, 16).toString(2).padStart(8, '0');
}

function convertTimestamp(timestamp = '') {
  return timestamp.replace('T', ' ');
}

function convertDateToISOStringWithoutDots(date) {
  return date.toISOString().replace(/\..*/g, '');
}

function decimal2Fix(value) {
  return parseFloat(value).toFixed(2);
}

function calculateElectricalQuantities(
  activePulse,
  reactivePulse,
  actualTimestamp,
  previousTimestamp
) {
  const PHASE_NUMBER = 3;
  const ASSUMED_VOLTAGE = 220.0;
  const ACTIVE_CONVERSION = 1;
  const REACTIVE_CONVERSION = 1;

  const activeEnergy = activePulse * ACTIVE_CONVERSION;
  const reactiveEnergy = reactivePulse * REACTIVE_CONVERSION;

  const TO_KW = (actualTimestamp - previousTimestamp) / (1e3 * 3600);

  const activePotency = activeEnergy / TO_KW;
  const reactivePotency = reactiveEnergy / TO_KW;

  const s = (activePotency ** 2 + reactivePotency ** 2) ** 0.5;

  const i3f = s / ASSUMED_VOLTAGE;
  const i1f = i3f / PHASE_NUMBER;

  const p1f = activePotency / PHASE_NUMBER;

  return {
    v1f: ASSUMED_VOLTAGE,
    i1f,
    p1f,
  };
}

/**
 * * FORMATO FRAME NORMAL
 * * OCTETO | BITS POSITION | DESCRIPTION
 * * 0 NÃO UTILIZADO
 * * 1 | bits 6 e 7 | se 6 === 1 energia capacitiva se 7 for 1 energia indutiva
 * * 2 NÃO UTILIZADO
 * * 3 | 0 A 7 | PULSOS DE ENERGIA ATIVA MENOS SIGNIFICATIVOS (LSB)
 * * 4 | 0 A 7 | PULSOS DE ENERGIA ATIVA MAIS SIGNIFICATIVOS (MSB)
 * * 5 | 0 A 7 | PULSOS DE ENERGIA REATIVA MENOS SIGNIFICATIVOS (LSB)
 * * 6 | 0 A 7 | PULSOS DE ENERGIA REATIVA MAIS SIGNIFICATIVOS (MSB)
 * * 7 NÃO UTILIZADO
 */

function decodeNormalFrame(frame) {
  const splittedFrame = frame.match(/.{2}/g);
  const binaryList = splittedFrame.map(hex2bin);

  const energyFlag = parseFloat(binaryList[1].at(6));
  const activePulse = parseInt(binaryList[4] + binaryList[3], 2);
  const reactivePulse = parseInt(binaryList[6] + binaryList[5], 2);

  return {
    activePulse,
    energyFlag,
    reactivePulse,
  };
}

let previousTimestampStr = ''; // ! PEGAR VALOR DO BANCO É MAIS CORRETO

function frameToXPEInput(meterId, input) {
  const {
    // cmd = '',
    // esn = '',
    // frames = [],
    // fc = 504,
    pt = 0,
    frame = '',
    ts = '',
    // timestamp = '',
  } = input;

  const convertedActualTimestamp = convertTimestamp(ts);
  const convertedPreviousTimestamp = convertTimestamp(previousTimestampStr);

  const firstTimestamp = convertedPreviousTimestamp || convertedActualTimestamp;

  let xpeInput = `${meterId};${firstTimestamp};0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0.00;0`;

  if (convertedPreviousTimestamp) {
    if (pt === 0 && frame.length === 16) {
      const { activePulse, energyFlag, reactivePulse } =
        decodeNormalFrame(frame);

      const actualTimestamp = new Date(ts);
      const previousTimestamp = new Date(previousTimestampStr);

      const { i1f, p1f, v1f } = calculateElectricalQuantities(
        activePulse,
        reactivePulse,
        actualTimestamp,
        previousTimestamp
      );

      const v1fStr = decimal2Fix(v1f);
      const i1fStr = decimal2Fix(i1f);
      const p1fStr = decimal2Fix(p1f);
      const e1fStr = decimal2Fix(energyFlag);

      xpeInput = `${meterId};${convertedActualTimestamp};${v1fStr};${v1fStr};${v1fStr};${i1fStr};${i1fStr};${i1fStr};${p1fStr};${p1fStr};${p1fStr};${e1fStr};${e1fStr};${e1fStr};0`;
    } /* else if (pt === 1 && frame.length === 18) {} */ else {
      console.log('Error: wrong format.');
      xpeInput = null;
    }
  }

  previousTimestampStr = ts;

  return xpeInput;
}

function convertXPEConfigToTaskFrequency(xpeConfig, date) {
  if (xpeConfig.match(/\d;\d;\d/g)) {
    const [msFrequency] = xpeConfig.split(';');

    const cmd = 'tasks_frequency';
    const sendMeasures = msFrequency / 1e3;

    return JSON.stringify({
      cmd,
      send_measures: sendMeasures,
      send_logs: 1800,
      send_status: 1800,
      timestamp: convertDateToISOStringWithoutDots(date),
    });
  }

  return null;
}

function convertXPEIdToRemotaFormat(xpeId) {
  return xpeId.replace(/^xp(0)+/g, '');
}

module.exports = {
  frameToXPEInput,
  decimal2Fix,
  convertTimestamp,
  hex2bin,
  decodeNormalFrame,
  calculateElectricalQuantities,
  convertXPEConfigToTaskFrequency,
  convertDateToISOStringWithoutDots,
  convertXPEIdToRemotaFormat,
};
