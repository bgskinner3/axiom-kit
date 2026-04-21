import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
});
