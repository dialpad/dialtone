/** Compare the membership of owned selection snapshots without sorting consumer arrays. */
export function sameSelection (first, second) {
  if (!Array.isArray(first) || !Array.isArray(second)) return first === second;
  return first.length === second.length && first.every(value => second.includes(value));
}

export function selectionSnapshot (value) {
  return Array.isArray(value) ? [...value] : value;
}

/** Normalize the controlled contract without reading or mutating the legacy model. */
export function getSelectionState (options, selected, { useDropdown, neutralValue } = {}) {
  const issues = [];
  const validOptions = Array.isArray(options) && options.every(option =>
    option && typeof option.value === 'string' && typeof option.label === 'string' &&
    (option.shortLabel == null || typeof option.shortLabel === 'string')) &&
    new Set(options.map(option => option.value)).size === options.length;
  if (!validOptions) issues.push('options must contain unique string values and string labels.');
  const resolved = selected === undefined ? (useDropdown ? null : []) : selected;
  const validSelected = useDropdown
    ? resolved === null || typeof resolved === 'string'
    : Array.isArray(resolved) && resolved.every(value => typeof value === 'string');
  if (!validSelected) issues.push('selected has the wrong shape for this selection pattern.');
  const validNeutral = !useDropdown || neutralValue == null || typeof neutralValue === 'string';
  if (!validNeutral) issues.push('neutralValue must be a string or null in single selection.');
  const value = validSelected ? (useDropdown ? resolved : [...new Set(resolved)]) : (useDropdown ? null : []);
  if (!useDropdown && validSelected && value.length !== resolved.length) issues.push('selected contains duplicate values.');
  if (!useDropdown && neutralValue != null) issues.push('neutralValue is ignored in multiple selection.');
  const records = validOptions ? options.map(option => Object.freeze({ ...option })) : [];
  const values = useDropdown ? (value === null ? [] : [value]) : value;
  const selectedOptions = records.filter(option => values.includes(option.value));
  const unknownValues = values.filter(value => !records.some(option => option.value === value));
  const isActive = useDropdown ? value !== null && value !== neutralValue : value.length > 0;
  return {
    valid: validOptions && validSelected && validNeutral,
    options: records,
    value,
    values,
    selectedOptions,
    unknownValues,
    isActive,
    issues,
  };
}
