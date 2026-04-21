import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], 
  dts: {
    resolve: true, // 👈 Flattens your utilities into one index.d.ts
  },
  clean: true,
  minify: true,
  // This helps tsup focus strictly on the types
  splitting: false,
    tsconfig: 'tsconfig.build.json',
});