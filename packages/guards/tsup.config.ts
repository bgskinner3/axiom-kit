import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  // 🚀 WIZARD MOVE: Pull @axiom internal types into this package's d.ts
  dts: {
    resolve: true,
  },
  // We keep Core as external for now unless you want to bundle it
  external: [],
  clean: true,
  minify: true,
  sourcemap: true,

  splitting: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
  shims: true,
});
