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

function validConfig (config, allowSingleValue = false) {
  if (!config || typeof config !== 'object') return false;
  const { min, max, step, suffix = '' } = config;
  const span = max - min;
  return [min, max, step, span].every(Number.isFinite) &&
    (span > 0 || (allowSingleValue && span === 0)) && step > 0 &&
    (step <= span || (allowSingleValue && span === 0)) && typeof suffix === 'string' &&
    gridValue(max, config) === max;
}

// Docgen reports numeric enum values as strings; blank strings must not become 0.
function toNumber (value) {
  return typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN;
}

// An explicit enum opts in only when its values are exactly the configured grid.
function coversGrid (values, config) {
  const numbers = values.map(toNumber);
  const count = Math.round((config.max - config.min) / config.step) + 1;
  return numbers.length === count && new Set(numbers).size === count &&
    numbers.every(value => isSliderControlValue(value, config));
}

export function getSliderControlConfig (member, propValues) {
  if (member?.types?.length !== 1 || member.types[0] !== 'number' ||
    member.tokenCategory || !member.slider) return null;
  const { min, max, maxProp, step, suffix = '' } = member.slider;
  const dependent = maxProp !== undefined;
  if (dependent && (typeof maxProp !== 'string' || !maxProp.trim() || max !== undefined || member.values?.length)) {
    return null;
  }
  // Eligibility is independent of current sibling values, so an invalid total
  // cannot switch an opted-in property back to manual entry.
  const config = { min, max: dependent ? min + step : max, step, suffix };
  if (!validConfig(config) || (member.values?.length && !coversGrid(member.values, config))) return null;
  if (dependent && propValues !== undefined) {
    config.max = propValues[maxProp];
    if (!validConfig(config, true)) return null;
  }
  return config;
}

// Called only inside the canonical options transaction for an explicit prop edit.
export function reconcileSliderControlValues (members, values, changedProp) {
  for (const member of members) {
    if (member.slider?.maxProp !== changedProp) continue;
    const config = getSliderControlConfig(member, values);
    const value = values[member.name];
    if (!config || !Number.isFinite(value) || gridValue(value, config) !== value) continue;
    const clamped = Math.min(config.max, Math.max(config.min, value));
    if (isSliderControlValue(clamped, config, member.validator)) values[member.name] = clamped;
  }
}

export function isSliderControlValue (value, config, validator) {
  if (!validConfig(config, true) || !Number.isFinite(value) || value < config.min || value > config.max ||
    gridValue(value, config) !== value) return false;
  try {
    return !validator || Boolean(validator(value));
  } catch {
    return false;
  }
}
