'use strict';

function getElementName(node) {
  const parent = node.parent;
  if (!parent || parent.type !== 'VStartTag') return '';
  const element = parent.parent;
  if (!element || element.type !== 'VElement') return '';
  return element.rawName || element.name || '';
}

function isDtTextComponent(node) {
  const name = getElementName(node);
  return name === 'dt-text' || name === 'DtText';
}

function getAttributeName(attribute) {
  if (!attribute) return null;

  return attribute.directive
    ? attribute.key.argument && attribute.key.argument.name
    : attribute.key.name;
}

function hasAttribute(node, name) {
  const startTag = node.parent;
  if (!startTag || !Array.isArray(startTag.attributes)) return false;

  return startTag.attributes.some(
    (attribute) => getAttributeName(attribute) === name,
  );
}

function hasDirectiveAttribute(node, name) {
  const startTag = node.parent;
  if (!startTag || !Array.isArray(startTag.attributes)) return false;

  return startTag.attributes.some((attribute) => {
    return attribute.directive && getAttributeName(attribute) === name;
  });
}

function getStaticAttributeValue(attribute) {
  if (!attribute || attribute.directive || !attribute.value) return null;
  return attribute.value.value;
}

function findStaticAttribute(node, name) {
  const startTag = node.parent;
  if (!startTag || !Array.isArray(startTag.attributes)) return null;

  return (
    startTag.attributes.find((attribute) => {
      return !attribute.directive && getAttributeName(attribute) === name;
    }) || null
  );
}

function removeAttributeFix(fixer, sourceCode, attribute) {
  let start = attribute.range[0];
  const end = attribute.range[1];
  const text = sourceCode.text;

  while (start > 0 && /[ \t]/.test(text[start - 1])) {
    start -= 1;
  }

  return fixer.removeRange([start, end]);
}

module.exports = {
  findStaticAttribute,
  getAttributeName,
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  hasDirectiveAttribute,
  isDtTextComponent,
  removeAttributeFix,
};
