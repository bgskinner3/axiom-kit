const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Absolute path to the package root
  rootDir: path.resolve(__dirname),

  moduleNameMapper: {
    // Your standard monorepo mapping
    '^@bgskinner2/axiom-kit-(.*)$': '<rootDir>/../$1/src',
    '^@bgskinner2/(?!axiom-kit$)(.*)$': '<rootDir>/../$1/src',
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageReporters: ['text', 'text-summary'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        isolatedModules: false,
        diagnostics: {
          ignoreCodes: [5103, 5023, 5024],
        },
        // ✨ ADD THIS: Link Jest to your local Miner
        astTransformers: {
          before: [path.resolve(__dirname, 'transformer/index.ts')],
        },
      },
    ],
  },

  // Ensures we reset the global vault between every test file
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
