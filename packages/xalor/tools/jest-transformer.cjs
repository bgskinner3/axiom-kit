/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
const transformerPath = path.resolve(
  __dirname,
  '../dist/transformer/index.cjs',
);
const pkgPath = path.resolve(__dirname, '../package.json');

// Load the bundled transformer and package version
const mod = require(transformerPath);
const pkg = require(pkgPath);

const transformer = mod.default || mod;
/**
 * SEED VAULT FROM BUNKER
 *
 *  The Result
 * I. You build: The Miner flushes the data to the Bunker (the .json file).
 * II. You test: The Jest Transformer calls seedVaultFromBunker.
 * III. The Success: Your tests now have "X-Ray Vision" into your types.
 */
function seedVaultFromBunker() {
  const rootDir = process.cwd();
  // 📍 Look in the node_modules bunker
  const cacheFile = path.join(
    rootDir,
    'node_modules/.cache/xalor/vault-snapshot.json',
  );

  if (!fs.existsSync(cacheFile)) return;

  try {
    const raw = fs.readFileSync(cacheFile, 'utf-8');
    const snapshot = JSON.parse(raw);

    // 🏗️ MANUALLY HYDRATE THE TRIPLE-KV
    // We do this here because Jest runs in a separate process
    // and needs its own globalThis.__SOLID_VAULT__ instance.
    globalThis.__SOLID_VAULT__ = {
      blueprints: new Map(
        Object.entries(snapshot).map(([k, v]) => [k, v.shape]),
      ),
      manifest: new Map(Object.entries(snapshot).map(([k, v]) => [k, v.area])),
      registry: new Map(
        Object.entries(snapshot).map(([k, v]) => [k, v.symbolName]),
      ),
      errors: new Map(),
      items: new Map(Object.entries(snapshot)),
    };

    console.log(
      `[xalor-jest] ⚡ Genesis Hydration Complete: ${Object.keys(snapshot).length} types seeded.`,
    );
  } catch (err) {
    console.error(
      `[xalor-jest] ❌ Failed to seed vault from bunker: ${err.message}`,
    );
  }
}

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
    seedVaultFromBunker();
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
