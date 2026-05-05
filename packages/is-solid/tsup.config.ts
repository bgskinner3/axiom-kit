import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    transformer: 'transformer/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },

  // 3. Platform & Optimization
  // We keep 'node' as the base because the transformer requires it
  platform: 'node',
  clean: true,
  minify: true,
  splitting: false, // Keep transformer logic in one file for ts-patch
  treeshake: true,
  sourcemap: true,

  // 4. Externalize heavy dependencies
  external: ['typescript'],

  // 5. Use your specific build config
  tsconfig: 'tsconfig.build.json',
  onSuccess: async () => {
    const transDir = path.join(process.cwd(), 'dist/transformer');
    if (!fs.existsSync(transDir)) fs.mkdirSync(transDir, { recursive: true });

    // This forces Node to treat the transformer as CJS
    fs.writeFileSync(
      path.join(transDir, 'package.json'),
      JSON.stringify({ type: 'commonjs' }, null, 2),
    );

    // Copy the built transformer into this isolated folder
    fs.copyFileSync(
      path.join(process.cwd(), 'dist/transformer.cjs'),
      path.join(transDir, 'index.cjs'),
    );
  },
});
