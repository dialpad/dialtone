import assert from 'node:assert/strict';

/** Check static subjects and CSS availability; this does not establish visual behavior. */
export function checkStaticCss(classes, utilities, stylesheet) {
  assert.ok(utilities.length, 'Static example requires a selected utility');
  const selectors = new Set();
  const subjectRules = [];
  stylesheet.walkRules(rule => {
    for (const selector of rule.selectors) selectors.add(selector);
    if (rule.selectors.includes('.d-ww-normal')) subjectRules.push(rule);
  });
  const missingClasses = classes.filter(name => {
    const escaped = name.replace(/[^a-zA-Z0-9_-]/g, character => `\\${character}`);
    return !selectors.has(`.${escaped}`);
  });
  for (const subject of utilities) {
    assert.ok(classes.includes(subject), `Selected utility ${subject} absent from HTML`);
    assert.ok(!missingClasses.includes(subject), `Selected utility ${subject} absent from CSS`);
  }
  if (utilities.includes('d-ww-normal')) assertWordWrapNormal(subjectRules);
  return {
    css: missingClasses.length ? 'partial' : 'passed',
    missingClasses,
    checked: classes.filter(name => !missingClasses.includes(name)),
  };
}

function assertWordWrapNormal(rules) {
  assert.ok(rules.some(rule => rule.nodes.some(node => node.prop === 'overflow-wrap'
    && node.value === 'normal')), 'Selected word-wrap declaration differs');
}
