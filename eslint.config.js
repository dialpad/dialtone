export default [{
  extends: [
    'standard',
    'semistandard',
  ],
  env: {
    browser: true,
    node: true,
    amd: true,
  },
  rules: {
    camelcase: ['error', {
      properties: 'never', // Ignore snake_case in JSON properties, which are often params.
      allow: ['^opt_'], // Allow opt_varname arguments.
    }],
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'prefer-promise-reject-errors': ['error', {
      allowEmptyReject: true,
    }],
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    complexity: ['warn', 5],
  },
}];
