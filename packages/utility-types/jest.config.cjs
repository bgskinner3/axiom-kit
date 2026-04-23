const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use absolute path for reliability
  rootDir: '.',

  moduleNameMapper: {
    '^@axiom/utility-types$': '<rootDir>/src/index.ts',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '<rootDir>/__tests__/utils/',
    '\\.test-d\\.ts$',
  ],
  // Alternatively, ensure your testMatch only looks for .test.ts files
  testMatch: ['**/__tests__/**/*.test.ts', '!**/*.test-d.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  coverageReporters: ['text', 'text-summary'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // 🚀 THE FIX: Point to the inclusive test config
        tsconfig: 'tsconfig.test.json',
        isolatedModules: false,
        diagnostics: {
          warnOnly: false,
        },
      },
    ],
  },
};
