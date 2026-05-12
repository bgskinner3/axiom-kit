// packages/xalor/tsup.config.ts
import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'transformer/index': 'transformer/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
    // 💎 THE MAGIC FIX:
    // Setting this forces TSUP to create self-contained files
    // without cross-entry-point chunking.
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },
  platform: 'node',
  clean: true, // Keep this to ensure fresh builds
  minify: true,
  splitting: true,
  bundle: true,
  treeshake: true,
  sourcemap: true,
  external: ['typescript', 'fs', 'path'],
  tsconfig: 'tsconfig.build.json',
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
