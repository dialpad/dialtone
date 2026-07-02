/**
 * Returns true when a prop/slot value is "set" — a non-blank string, or any
 * non-null/undefined/false value. Shared predicate for variant exclusion rules.
 *
 * @param {*} value - The prop or slot value.
 * @returns {boolean}
 */
export function hasValue (value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined && value !== false;
}

/**
 * Inverse of `hasValue`.
 *
 * @param {*} value - The prop or slot value.
 * @returns {boolean}
 */
export function hasNoValue (value) {
  return !hasValue(value);
}

/**
 * Builds an exclusion-rule fragment that both disables a control and clears its
 * value — the standard gating for a deprecated alias whose replacement is active.
 *
 * @param {string[]} props - The prop names to disable and clear.
 * @returns {{ disable: { props: string[] }, clear: { props: string[] } }}
 */
export function disableAndClearProps (props) {
  return {
    disable: { props },
    clear: { props },
  };
}

function areConditionEntriesMet (conditions = {}, values = {}) {
  return Object.entries(conditions).every(([key, condition]) =>
    typeof condition === 'function'
      ? condition(values[key])
      : condition === values[key],
  );
}

function areConditionsMet (rule, propValues, slotValues) {
  if (!areConditionEntriesMet(rule.when, propValues)) return false;
  if (rule.whenSlots && !slotValues) return false;
  return areConditionEntriesMet(rule.whenSlots, slotValues);
}

function matchesRuleKey (ruleKey, memberName, memberGroup, exclusionRules, propValues, slotValues) {
  if (!exclusionRules?.length) return false;
  return exclusionRules.some(rule => {
    if (!areConditionsMet(rule, propValues, slotValues)) return false;
    return rule[ruleKey]?.[memberGroup]?.includes(memberName) ?? false;
  });
}

/**
 * Determines if a member should be excluded (hidden) based on exclusion rules
 * and the current prop and slot values.
 *
 * @param {string} memberName - The name of the member to check.
 * @param {string} memberGroup - The member group ('props' or 'slots').
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @param {object} slotValues - Current slot values.
 * @returns {boolean} Whether the member should be excluded.
 */
export function shouldExclude (memberName, memberGroup, exclusionRules, propValues, slotValues) {
  return matchesRuleKey('hide', memberName, memberGroup, exclusionRules, propValues, slotValues);
}

/**
 * Determines if a member should be disabled based on exclusion rules and the
 * current prop and slot values. `hide` is treated as a disable signal for backwards
 * compatibility with variant metadata that predates the `disable` key.
 *
 * @param {string} memberName - The name of the member to check.
 * @param {string} memberGroup - The member group ('props' or 'slots').
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @param {object} slotValues - Current slot values.
 * @returns {boolean} Whether the member should be disabled.
 */
export function shouldDisable (memberName, memberGroup, exclusionRules, propValues, slotValues) {
  if (!exclusionRules?.length) return false;
  return exclusionRules.some(rule => {
    if (!areConditionsMet(rule, propValues, slotValues)) return false;
    const isDisabled = rule.disable?.[memberGroup]?.includes(memberName);
    const isHidden = rule.hide?.[memberGroup]?.includes(memberName);
    return (isDisabled || isHidden) ?? false;
  });
}

/**
 * Determines if a member value should be cleared based on exclusion rules
 * and the current prop and slot values.
 *
 * @param {string} memberName - The name of the member to check.
 * @param {string} memberGroup - The member group ('props' or 'slots').
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @param {object} slotValues - Current slot values.
 * @returns {boolean} Whether the member value should be cleared.
 */
export function shouldClear (memberName, memberGroup, exclusionRules, propValues, slotValues) {
  return matchesRuleKey('clear', memberName, memberGroup, exclusionRules, propValues, slotValues);
}

/**
 * Collects disabled values for a specific prop based on exclusion rules
 * and the current prop and slot values.
 *
 * @param {string} propName - The prop to check for disabled values.
 * @param {Array} exclusionRules - Array of exclusion rule objects.
 * @param {object} propValues - Current prop values.
 * @param {object} slotValues - Current slot values.
 * @returns {Set} Set of disabled value strings.
 */
export function getDisabledValues (propName, exclusionRules, propValues, slotValues) {
  const disabled = new Set();
  if (!exclusionRules?.length) return disabled;
  for (const rule of exclusionRules) {
    if (!areConditionsMet(rule, propValues, slotValues)) continue;
    const values = rule.disableValues?.props?.[propName];
    if (values) values.forEach(v => disabled.add(String(v)));
  }
  return disabled;
}
