module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: [
    'js',
    'vue',
  ],
  testEnvironment: "jsdom",
  transform: {
    '.*\\.(vue)$': 'vue-jest',
    ".*\\.(js)$": "babel-jest"
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
