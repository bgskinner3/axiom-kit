import { defineConfig } from 'tsup';

export default defineConfig({
  // 1. Entry point for your type engine
  entry: ['src/index.ts'],
  
  // 2. CRITICAL: Only generate types (0 bytes of JS)
  dts: {
    only: true,
  },
  
  // 3. Clean the dist folder before each build
  clean: true,
  
  // 4. Optimization
  minify: true,
  
  // 5. Ensure the bundle is one single clean declaration file
  bundle: true,
});