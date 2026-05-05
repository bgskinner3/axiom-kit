const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Absolute path to the package root
  rootDir: path.resolve(__dirname),
  // is-solid
  moduleNameMapper: {
    '^@bgskinner2/is-solid(.*)$': '<rootDir>/src/$1', // Fixed mapping
    '^@bgskinner2/(.*)$': '<rootDir>/../$1/src',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/playground/',
    'setup.ts',
  ],
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
        // astTransformers: {
        //   before: [path.resolve(__dirname, 'dist/transformer.cjs')],
        // },
        astTransformers: {
          before: [path.resolve(__dirname, 'tools/jest-transformer.cjs')],
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  // Ensures we reset the global vault between every test file
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
