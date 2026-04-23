/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use absolute path for reliability
  rootDir: path.resolve(__dirname),

  moduleNameMapper: {
    // 1. Matches @bgskinner2/axiom-kit-guards -> ../guards/src
    '^@bgskinner2/axiom-kit-(.*)$': '<rootDir>/../$1/src',

    // 2. Matches @bgskinner2/guards -> ../guards/src
    '^@bgskinner2/(?!axiom-kit$)(.*)$': '<rootDir>/../$1/src',
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
