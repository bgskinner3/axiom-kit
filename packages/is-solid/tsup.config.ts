import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'transformer/index.ts', 'types/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
});
