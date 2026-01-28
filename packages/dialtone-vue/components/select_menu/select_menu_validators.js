const hasValidOptionValue = option => {
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
    if (!hasValidOptionValue(option)) {
      return false;
    }

    if (!hasValidOptionLabel(option)) {
      return false;
    }

    return true;
  });
};
