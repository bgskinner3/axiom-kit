// packages/react/tsup.config.ts
// import { defineConfig } from 'tsup';

// export default defineConfig({
//   // 1. Entry point for the React-specific suite
//   entry: ['src/index.ts'],
  
//   // 2. Output both modern ESM and legacy CJS
//   format: ['cjs', 'esm'],
  
//   // 3. Generate .d.ts files for "Wizard-level" IntelliSense
//   dts: true,
  
//   // 4. Clean the dist folder before each build
//   clean: true,
  
//   // 5. CRITICAL: Do not bundle React or React-DOM
//   // This forces the user's app to provide them
//   external: ['react', 'react-dom'],
  
//   // 6. Optimization
//   minify: true,
//   sourcemap: true,
//   treeshake: true,
  
//   // 7. Ensure JSX is handled correctly
//   minifyWhitespace: true,
//   splitting: true,
// });
