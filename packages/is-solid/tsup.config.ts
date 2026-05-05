import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    transformer: 'transformer/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },

  // 3. Platform & Optimization
  // We keep 'node' as the base because the transformer requires it
  platform: 'node',
  clean: true,
  minify: true,
  splitting: false, // Keep transformer logic in one file for ts-patch
  treeshake: true,
  sourcemap: true,

  // 4. Externalize heavy dependencies
  external: ['typescript'],

  // 5. Use your specific build config
  tsconfig: 'tsconfig.build.json',
});
