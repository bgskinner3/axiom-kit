const path = require('path');
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use absolute path for reliability
  rootDir: path.resolve(__dirname),

  moduleNameMapper: {
    '^@axiom/(.*)$': '<rootDir>/../$1/src',
  },
  coverageReporters: ['text', 'text-summary'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        isolatedModules: false,
      },
    ],
  },
};
