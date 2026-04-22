/** @type {import('jest').Config} */
module.exports = {
  // Use the standard preset (since we're staying in CJS mode)
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,

  // Ignore build artifacts and type-only tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '\\.test-d\\.ts$'],

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
    '^@axiom/(.*)$': '<rootDir>/../$1/src',
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

// /** @type {import('jest').Config} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   extensionsToTreatAsEsm: ['.ts'],
//   verbose: true,
//   testPathIgnorePatterns: ['/node_modules/', '/dist/', '\\.test-d\\.ts$'],
//   // 2️⃣  STRICTLY define what files contain executable tests
//   testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '!**/*.test-d.ts'],
//   coverageReporters: ['text', 'text-summary'],
//   transform: {
//     '^.+\\.tsx?$': [
//       'ts-jest',
//       {
//         tsconfig: 'tsconfig.json',
//         // 🚨 CRITICAL: Set to false to enable full type-checking
//         isolatedModules: false,
//         // 🚨 CRITICAL: Ensure diagnostics aren't set to warnOnly
//         diagnostics: {
//           warnOnly: false,
//         },
//       },
//     ],
//   },
//   collectCoverageFrom: [
//     'src/**/*.{ts,tsx}',
//     '!src/**/*.d.ts',
//     '!src/**/index.ts',
//     '!src/global.d.ts',
//     '!src/managers/**',
//     '!src/types/**',
//     '!**/node_modules/**',
//     '!src/lib/processors/visual.ts',
//   ],
// };
