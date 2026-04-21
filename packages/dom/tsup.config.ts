import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  // ⚡ The Senior Fix: Build-safe override
  tsconfig: 'tsconfig.build.json',
  platform: 'browser', // 👈 Signals this is for client-side use
  splitting: true,
  treeshake: true
});