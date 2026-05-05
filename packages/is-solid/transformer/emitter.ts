// transformer/emitter.ts
import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
import * as fs from 'fs';
import * as path from 'path';
/**
 * EMIT AMBIENT TYPES
 *
 * Synchronizes the Mined Registry with the Ghost Layer (solid-env.d.ts).
 * This uses Declaration Merging to extend the 'ISolidRegistry' interface,
 * which powers the zero-import autocomplete in the IDE.
 */
export function emitAmbientTypes(
  rootDir: string,
  registry: Map<string, string>,
) {
  // const modelsDir = path.join(rootDir, IS_SOLID_CONFIG_ITEMS.modelsDirName);
  // 'node_modules/@bgskinner2/is-solid/dist/solid-env.d.ts'
  // const modelsDir = path.join(
  //   rootDir,
  //   'node_modules/@bgskinner2/is-solid/dist/solid-env.d.ts',
  // );
  // const envFile = path.join(modelsDir, IS_SOLID_CONFIG_ITEMS.ambientFileName);

  const targetDir = path.join(
    rootDir,
    'node_modules',
    '@bgskinner2',
    'is-solid',
    'dist',
  );

  // 2. Define the TARGET FILE (The .d.ts file)
  const envFile = path.join(targetDir, 'solid-env.d.ts');
  // 1. Build Header with ESLint suppression
  let dts = IS_SOLID_CONFIG_ITEMS.banner;
  dts += `/* eslint-disable @typescript-eslint/no-unused-vars */\n`;
  // Import directly from the package name for stability
  dts += `import type { ISolidRegistry, TSolid } from './index';\n\n`;
  dts += `declare module 'is-solid' {\n`;

  let interfaceEntries = `  interface ISolidRegistry {\n`;
  let functionEntries = '';

  registry.forEach((value, key) => {
    const [absPath, typeName] = value.split('|');

    /**
     * 🚀 Absolute paths inside import() are safe for local development node_modules.
     * This ensures the IDE finds the user's source file regardless of depth.
     */
    const typeImport = `import('${absPath}').${typeName}`;

    interfaceEntries += `    '${key}': ${typeImport};\n`;
    functionEntries += `  export function isSolid(data: unknown): data is TSolid<'${key}', ${typeImport}>;\n`;
  });

  dts += interfaceEntries + `  }\n\n` + functionEntries + `}\n`;

  // if (!fs.existsSync(targetDir)) {
  //   fs.mkdirSync(targetDir, { recursive: true });
  // }

  // const existing = fs.existsSync(envFile)
  //   ? fs.readFileSync(envFile, 'utf8')
  //   : '';
  // if (dts !== existing) {
  //   fs.writeFileSync(envFile, dts);
  // }
  // 4. Ensure Directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 5. Atomic File Check & Write
  // ✨ Fix: Specifically checking and reading the FILE path
  let existing = '';
  if (fs.existsSync(envFile) && !fs.lstatSync(envFile).isDirectory()) {
    existing = fs.readFileSync(envFile, 'utf8');
  }

  if (dts !== existing) {
    fs.writeFileSync(envFile, dts);
  }
}

// export function emitAmbientTypes(
//   rootDir: string,
//   registry: Map<string, string>,
// ) {
//   const modelsDir = path.join(rootDir, IS_SOLID_CONFIG_ITEMS.modelsDirName);
//   const envFile = path.join(modelsDir, IS_SOLID_CONFIG_ITEMS.ambientFileName);

//   let dts = IS_SOLID_CONFIG_ITEMS.banner;
//   dts += `import type { TSolid } from './index';\n\n`;
//   dts += `declare module 'is-solid' {\n`;

//   registry.forEach((_, key) => {
//     dts += `  export function isSolid(data: unknown): data is TSolid<'${key}', any>;\n`;
//   });
//   dts += `}\n`;

//   if (!fs.existsSync(modelsDir)) {
//     fs.mkdirSync(modelsDir, { recursive: true });
//   }

//   const existing = fs.existsSync(envFile)
//     ? fs.readFileSync(envFile, 'utf8')
//     : '';
//   if (dts !== existing) {
//     fs.writeFileSync(envFile, dts);
//   }
// }
