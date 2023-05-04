// Any libraries containing vue components / esModules must be put here or jest will error out on them.
const esModules = ['@dialpad/dialtone', '@tiptap/vue-3'].join('|');

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: [
    'js',
    'vue',
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transform: {
    '.*\\.(vue)$': '@vue/vue3-jest',
    '.*\\.(js)$': 'babel-jest',
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
