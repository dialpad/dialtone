// Match DtSlider's scalar step reconstruction exactly, before its bounds clamp.
function decimalPlaces (number) {
  const [mantissa, exponent = '0'] = String(number).toLowerCase().split('e');
  return Math.max(0, (mantissa.split('.')[1]?.length ?? 0) - Number(exponent));
}

function gridValue (value, { min, step }) {
  const precision = Math.max(decimalPlaces(min), decimalPlaces(step));
  if (precision > 100) return NaN;
  return parseFloat((min + Math.round((value - min) / step) * step).toFixed(precision));
}

function validConfig (config) {
  if (!config || typeof config !== 'object') return false;
  const { min, max, step, suffix = '' } = config;
  const span = max - min;
  return [min, max, step, span].every(Number.isFinite) &&
    span > 0 && step > 0 && step <= span && typeof suffix === 'string' &&
    gridValue(max, config) === max;
}

export function getSliderControlConfig (member) {
  if (member?.types?.length !== 1 || member.types[0] !== 'number' ||
    member.values?.length || member.tokenCategory || !validConfig(member.slider)) return null;
  const { min, max, step, suffix = '' } = member.slider;
  return { min, max, step, suffix };
}

export function isSliderControlValue (value, config, validator) {
  if (!validConfig(config) || !Number.isFinite(value) || value < config.min || value > config.max ||
    gridValue(value, config) !== value) return false;
  try {
    return !validator || Boolean(validator(value));
  } catch {
    return false;
  }
}
