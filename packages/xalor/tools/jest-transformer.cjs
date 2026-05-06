/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');
const transformerPath = path.resolve(__dirname, '../dist/transformer/index.cjs');
const pkgPath = path.resolve(__dirname, '../package.json');

// Load the bundled transformer and package version
const mod = require(transformerPath);
const pkg = require(pkgPath);

const transformer = mod.default || mod;

/**
 * JEST TRANSFORMER BRIDGE!!!!
 *
 * This file allows ts-jest to communicate with your custom Miner.
 * It handles the extraction of the TypeScript Program and
 * manages cache invalidation.
 */
module.exports = {
  name: 'xalor-transformer',

  // Appending Date.now() forces Jest to refresh the cache
  // every time you run the test script, ensuring your Miner's
  // latest logic is always applied to your test files.
  version: pkg.version + '-' + Date.now(),

  factory: (compiler) => {
    // : ts-jest wraps the program differently
    // depending on the version and 'isolatedModules' setting.
    const program =
      compiler.program ||
      compiler.tsProgram ||
      (compiler.compiler && compiler.compiler.program) ||
      compiler._program;

    if (!program) {
      console.warn(
        '[xalor] Jest Miner Warning: No TypeScript Program found. Transformation skipped.',
      );
      // Return a no-op transformer so the test doesn't crash
      // mock this !
      return () => (node) => node;
    }

    return transformer(program);
  },
};
