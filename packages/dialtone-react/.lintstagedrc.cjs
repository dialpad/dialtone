// Staged files under packages/dialtone-react: the repo's checks, plus ESLint (this package's config) and the related
// Vitest tests for TypeScript. `--passWithNoTests`: a staged file no test imports (a story, a script) isn't a failure.
const baseConfig = require('../../.lintstagedrc.js');

module.exports = {
  ...baseConfig,
  '*.{ts,tsx}': [
    'eslint --fix',
    'vitest related --run --passWithNoTests',
  ],
};
