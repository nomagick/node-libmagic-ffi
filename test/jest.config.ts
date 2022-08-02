export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testPathIgnorePatterns: ['/node_modules/', '/src/'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coverageReporters: ['json', 'text-summary'],
  collectCoverageFrom: ['src/**'],
  coveragePathIgnorePatterns: [
    '/src/test/',
    '.spec.ts$',
    '.json$'
  ],
  reporters: [
    'default'
  ],
  testEnvironment: 'node',

  testMatch: ['<rootDir>/test/**/*.spec.{ts,js}'],
  coverageDirectory: 'coverage',
  testTimeout: 240000,
};
