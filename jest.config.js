// Any libraries containing vue components / esModules must be put here or jest will error out on them.
const esModules = ['@dialpad/dialtone', '@tiptap/vue-3'].join('|');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.js',
  ],
  testMatch: [
    '**/components/**/*.test.[jt]s?(x)',
    '**/recipes/**/*.test.[jt]s?(x)',
  ],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};
