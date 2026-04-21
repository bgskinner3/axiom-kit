import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true, // 🧙 Essential for inlining TDeepPartial from utility-types
  },
  clean: true,
  minify: true,
  // 🚀 The Fix: Use the build-safe config
  tsconfig: 'tsconfig.build.json',
  splitting: true,
  treeshake: true
});
