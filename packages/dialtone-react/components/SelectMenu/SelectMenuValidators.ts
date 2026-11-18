/** What the validator accepts: the options prop, or anything a caller passes in its place. */
type OptionLike = { readonly value?: unknown; readonly label?: unknown };

const hasValidOptionValue = (option: OptionLike) => {
  return typeof option.value === 'string' || typeof option.value === 'number';
};

const hasValidOptionLabel = (option: OptionLike) => {
  if (!option.label) {
    return false;
  }

  return typeof option.label === 'string';
};

export const optionsValidator = (options?: readonly OptionLike[] | null) => {
  if (!options) {
    return true;
  }

  return options.every(option => {
    // A null entry is invalid, not a crash: the validator runs in an effect, whatever the options render.
    if (!option) {
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
