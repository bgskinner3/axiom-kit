import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true, 
  },
  external: ['react', 'react-dom'],

  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  minifyWhitespace: true,
  platform: 'browser',
  tsconfig: 'tsconfig.build.json',
});
