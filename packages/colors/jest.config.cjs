const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use absolute path for reliability
  rootDir: path.resolve(__dirname),
  
  moduleNameMapper: {
    '^@axiom/(.*)$': '<rootDir>/../$1/src',
  },

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
