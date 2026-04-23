import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: { resolve: true },
  external: [], // These stay zero-dependency
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
  shims: true,
  minifyWhitespace: true,
});
