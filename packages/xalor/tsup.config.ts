// packages/xalor/tsup.config.ts
import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    // 💎 FIX: Use 'transformer/index' as the key to nest it automatically
    'transformer/index': 'transformer/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: { resolve: true },
  platform: 'node',
  clean: true, // Keep this to ensure fresh builds
  minify: true,
  splitting: true,
  // minify: false, // 💎 Recommendation: Don't minify the library itself if it's for dev use
  // splitting: false,
  treeshake: true,
  sourcemap: true,
  external: ['typescript'],
  tsconfig: 'tsconfig.build.json',
  // esbuildOptions(options) {
  //   options.preserveSymlinks = true;
  // },
  onSuccess: async () => {
    const root = process.cwd();
    const distDir = path.join(root, 'dist');
    const transDir = path.join(distDir, 'transformer');

    // 1. Ensure directories exist safely
    if (!fs.existsSync(transDir)) {
      fs.mkdirSync(transDir, { recursive: true });
    }

    // 2. Create the CJS Island package.json
    fs.writeFileSync(
      path.join(transDir, 'package.json'),
      JSON.stringify({ type: 'commonjs' }, null, 2),
    );

    // 3. Copy the transformer bundle
    const srcTransformer = path.join(distDir, 'transformer.cjs');
    const destTransformer = path.join(transDir, 'index.cjs');

    if (fs.existsSync(srcTransformer)) {
      fs.copyFileSync(srcTransformer, destTransformer);
    }
  },
});

// export default defineConfig({
//   entry: {
//     index: 'src/index.ts',
//     transformer: 'transformer/index.ts',
//   },
//   format: ['cjs', 'esm'],
//   dts: {
//     resolve: true,
//   },

//   // 3. Platform & Optimization
//   // We keep 'node' as the base because the transformer requires it
//   platform: 'node',
//   clean: true,
//   minify: true,
//   splitting: false, // Keep transformer logic in one file for ts-patch
//   treeshake: true,
//   sourcemap: true,

//   // 4. Externalize heavy dependencies
//   external: ['typescript'],

//   // 5. Use your specific build config
//   tsconfig: 'tsconfig.build.json',
//   onSuccess: async () => {
//     const transDir = path.join(process.cwd(), 'dist/transformer');
//     if (!fs.existsSync(transDir)) fs.mkdirSync(transDir, { recursive: true });

//     // This forces Node to treat the transformer as CJS
//     fs.writeFileSync(
//       path.join(transDir, 'package.json'),
//       JSON.stringify({ type: 'commonjs' }, null, 2),
//     );

//     // Copy the built transformer into this isolated folder
//     fs.copyFileSync(
//       path.join(process.cwd(), 'dist/transformer.cjs'),
//       path.join(transDir, 'index.cjs'),
//     );
//   },
// });
