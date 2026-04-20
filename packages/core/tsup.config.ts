// // tsup.config
// import { defineConfig } from 'tsup';
// export default defineConfig([
//   // 1. Build the main entry
//   {
//     entry: ['src/index.ts'],
//     format: ['cjs', 'esm'],
//     dts: true,
//     clean: true,
//     sourcemap: true,
//     minify: true,
//     external: ['react', 'react-dom'],
//     outDir: 'dist',
//   },
//   // 2. Build the transformer separately into its own folder
//   {
//     entry: ['transformer/index.ts'],
//     format: ['cjs', 'esm'],
//     dts: true,
//     clean: false, // Don't clean here or you'll delete the 'src' build
//     sourcemap: true,
//     minify: true,
//     external: ['react', 'react-dom'],
//     outDir: 'dist/transformer',
//   },
// ]);

// export default defineConfig({
//   entry: ['src/index.ts'],
//   format: ['cjs', 'esm'], // Build for both CommonJS and ESModules
//   dts: true, // Generate declaration file (.d.ts)
//   splitting: false,
//   sourcemap: true,
//   clean: true,
//   treeshake: true,
//   minify: true,
//   external: ['react', 'react-dom'],
// });
/**
 color 
 common
 computation 
 debug 
 deepoperations
 dom
 guards
 link
 processors
 transfprmers
 utility-types
 validations
 
 */