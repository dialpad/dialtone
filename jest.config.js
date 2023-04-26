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
  transformIgnorePatterns: ['/node_modules/(?!@dialpad/dialtone)'],
};
