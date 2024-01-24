module.exports = {
  // turn off the rules because of syntax semantic of less code generation
  // and related to that code styling (functions, mixin, colors, variables declarations)
  spaceBetweenParens: false,
  spaceBeforeBrace: false,
  newlineAfterBlock: false,
  singleLinePerProperty: false,
  importantRule: false,
  importPath: {
    filenameExtension: true,
  },
  maxCharPerLine: 150,
  spaceAroundComma: false,
  propertyOrdering: false,
  idSelector: false,
  universalSelector: false,
  zeroUnit: {
    style: 'no_unit',
  },
  decimalZero: 'none',
  spaceAfterPropertyColon: {
    style: 'at_least_one_space',
  },
  borderZero: {
    style: 'none',
  },
};
