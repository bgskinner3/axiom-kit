const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),

  // Ignore build, node_modules, and the type-test source files
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/dist/', 
    '/test-utils/', 
    '\\.test-d\\.ts$'
  ],

  // Match your spec files in BOTH singular and plural folders
  testMatch: [
    '<rootDir>/__test__/**/*.spec.ts',
    '<rootDir>/__tests__/**/*.test.ts'
  ],

  moduleNameMapper: {
    '^@axiom/(.*)$': '<rootDir>/../$1/src',
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        isolatedModules: false,
        diagnostics: { warnOnly: false },
        compilerOptions: {
          rootDir: './'
        }
      }
    ]
  }
};
