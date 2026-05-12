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
  dts: { resolve: true },
  platform: 'node',
  clean: true, // Keep this to ensure fresh builds
  minify: true,
  splitting: true,
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
