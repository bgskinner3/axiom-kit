// packages/core/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    // 3. Generate .d.ts files for "Wizard-level" IntelliSense
  dts: {
    resolve: true, // 👈 Flattens your utilities into one index.d.ts
  },
    // 4. Clean the dist folder before each build
    clean: true,

    // 5. CRITICAL: Do not bundle React or React-DOM
    // This forces the user's app to provide them
    external: ['react', 'react-dom'],

    // 6. Optimization
    minify: true,
    sourcemap: true,
    treeshake: true,

    // 7. Ensure JSX is handled correctly
    minifyWhitespace: true,


    splitting: true
});
