// packages/core/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  tsconfig: 'tsconfig.build.json',
});
