export const extractInitialsFromName = (fullName) => {
  if (typeof fullName !== 'string' || !fullName.trim()) return '';

  const names = fullName.trim().split(/\s+/g);

  return names.length === 1
    ? names.join('').substring(0, 2)
    : names.filter((_, index) => (index === 0 || index === names.length - 1))
      .map(name => name.slice(0, 1).toUpperCase())
      .join('');
};
