import { defineConfig } from 'tsup';

export default defineConfig({
  // 1. Entry point for the React suite
  entry: ['src/index.ts'],
  
  // 2. Dual-format output for modern and legacy projects
  format: ['cjs', 'esm'],
  
  // 3. Wizard-level Type Inlining
  dts: {
    resolve: true, // 👈 Sucks @axiom/utility-types directly into this bundle
  },
  
  external: ['react', 'react-dom'],
  
  // 5. Optimization & Performance
  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  
  // 6. Modern React logic (fixes React 19 / Next.js hydration issues)
  minifyWhitespace: true,
  platform: 'browser',
      tsconfig: 'tsconfig.build.json',
});