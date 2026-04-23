const path = require('path');

module.exports = {
  preset: 'ts-jest',
  // 🌐 CRITICAL: Browsers have a DOM; Node does not.
  testEnvironment: 'jsdom',
  rootDir: path.resolve(__dirname),

  // 🔗 Setup file for custom matchers like .toBeInTheDocument()
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.ts'],

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
        diagnostics: { warnOnly: false },
        compilerOptions: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
};