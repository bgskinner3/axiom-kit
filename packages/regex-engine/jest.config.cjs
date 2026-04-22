/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // 🔗 Link the setup file here
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.ts'],

  moduleNameMapper: {
    '^@axiom/(.*)$': '<rootDir>/../$1/src',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: false, // 👈 Required for branding check
        diagnostics: { warnOnly: false },
      },
    ],
  },
};
