import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  // 🚀 The Fix: Use the build-safe config
  tsconfig: 'tsconfig.build.json',
  splitting: true,
  treeshake: true,
  // Ensure we don't bundle Node built-ins
  external: ['node:fs', 'node:path', 'node:process']
});