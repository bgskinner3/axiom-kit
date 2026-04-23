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
  // testPathIgnorePatterns: ['/node_modules/', '/dist/', '\\.test-d\\.ts$'],
  // testMatch: [
  //   // 🚀 THE FIX: Broaden the search to catch all spec/test files
  //   '<rootDir>/__test__/**/*.{spec,test}.{ts,tsx}',
  //   '<rootDir>/src/**/*.spec.{ts,tsx}', // Optional: if you keep tests next to source
  // ],
};
// /* eslint-disable @typescript-eslint/no-var-requires */
// const path = require('path');
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   // Use absolute path for reliability
//   rootDir: path.resolve(__dirname),

//   moduleNameMapper: {
//     '^@axiom/(.*)$': '<rootDir>/../$1/src',
//   },
//   coverageReporters: ['text', 'text-summary'],
//   transform: {
//     '^.+\\.tsx?$': [
//       'ts-jest',
//       {
//         tsconfig: 'tsconfig.test.json',
//         isolatedModules: false,
//       },
//     ],
//   },
// };
