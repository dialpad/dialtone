/**
 * Determines if a member should be excluded (hidden) based on exclusion rules
 * and the current prop values.
 *
 * @param {string} memberName - The name of the member to check.
 * @param {string} memberGroup - The member group ('props' or 'slots').
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @returns {boolean} Whether the member should be excluded.
 */
export function shouldExclude (memberName, memberGroup, exclusionRules, propValues) {
  if (!exclusionRules?.length) return false;
  return exclusionRules.some(rule => {
    const conditionsMet = Object.entries(rule.when).every(([prop, condition]) =>
      typeof condition === 'function'
        ? condition(propValues[prop])
        : condition === propValues[prop],
    );
    if (!conditionsMet) return false;
    return rule.hide?.[memberGroup]?.includes(memberName) ?? false;
  });
}

/**
 * Collects disabled values for a specific prop based on exclusion rules
 * and the current prop values.
 *
 * @param {string} propName - The prop to check for disabled values.
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @returns {Set} Set of disabled value strings.
 */
export function getDisabledValues (propName, exclusionRules, propValues) {
  const disabled = new Set();
  if (!exclusionRules?.length) return disabled;
  for (const rule of exclusionRules) {
    const conditionsMet = Object.entries(rule.when).every(([prop, condition]) =>
      typeof condition === 'function'
        ? condition(propValues[prop])
        : condition === propValues[prop],
    );
    if (!conditionsMet) continue;
    const values = rule.disableValues?.props?.[propName];
    if (values) values.forEach(v => disabled.add(String(v)));
  }
  return disabled;
}
