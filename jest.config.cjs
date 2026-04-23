/** @type {import('jest').Config} */
module.exports = {
  // Use the standard preset (since we're staying in CJS mode)
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,

  // Ignore build artifacts and type-only tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.test-d\\.ts$',
    '/__tests__/utils/',
  ],

  // Define executable test locations
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/*.spec.ts',
    '!**/*.test-d.ts',
  ],

  // Coverage settings
  coverageReporters: ['text', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/global.d.ts',
    '!src/types/**',
    '!**/node_modules/**',
  ],

  // Module resolution for Axiom workspaces
  moduleNameMapper: {
    // 1. Matches @bgskinner2/axiom-kit-guards -> ../guards/src
    '^@bgskinner2/axiom-kit-(.*)$': '<rootDir>/../$1/src',

    // 2. Matches @bgskinner2/guards -> ../guards/src
    '^@bgskinner2/(?!axiom-kit$)(.*)$': '<rootDir>/../$1/src',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        // 🚨 CRITICAL: Enable full type-checking
        isolatedModules: false,
        // 🚨 CRITICAL: Diagnostics must pass
        diagnostics: {
          warnOnly: false,
        },
      },
    ],
  },
};
