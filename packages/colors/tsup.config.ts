import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  // 🚀 THE FIX: Point to the build-only config
  tsconfig: 'tsconfig.build.json', 
  splitting: true,
  treeshake: true,
  
});