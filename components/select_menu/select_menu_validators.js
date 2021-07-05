const hasValidOptionIndex = option => !option.index || typeof option.index === 'number';

const hasValidOptionValue = option => {
  if (!option.value) {
    return false;
  }

  return typeof option.value === 'string' || typeof option.value === 'number';
};

const hasValidOptionLabel = option => {
  if (!option.label) {
    return false;
  }

  return typeof option.label === 'string';
};

export const optionsValidator = options => {
  if (!options) {
    return true;
  }

  return options.every(option => {
    if (!hasValidOptionIndex(option)) {
      return false;
    }

    if (!hasValidOptionValue(option)) {
      return false;
    }

    if (!hasValidOptionLabel(option)) {
      return false;
    }

    return true;
  });
};
