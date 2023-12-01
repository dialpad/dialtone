const hasValidTerm = item => {
  if (!item.term) {
    return false;
  }

  return typeof item.term === 'string';
};

const hasValidDescription = item => {
  if (!item.description) {
    return false;
  }

  return typeof item.description === 'string';
};

export const itemsValidator = items => {
  if (!Array.isArray(items)) {
    return false;
  }

  return items.every(item => {
    if (typeof item !== 'object') {
      return false;
    }

    if (!hasValidTerm(item)) {
      return false;
    }

    if (!hasValidDescription(item)) {
      return false;
    }

    return true;
  });
};
