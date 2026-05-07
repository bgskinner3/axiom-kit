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
  const { emitter } = IS_SOLID_CONFIG_ITEMS;
  const targetDir = path.join(rootDir, emitter.targetDir);
  const envFile = path.join(targetDir, emitter.fileName);

  const interfaceLines: string[] = [];
  const functionLines: string[] = [];

  registry.forEach((value, key) => {
    const [absPath, typeName] = value.split('|');

    // 💎 Pro-Tip: Convert absolute path to relative for better portability
    const relativePath = path.relative(targetDir, absPath).replace(/\\/g, '/');
    const typeImport = `import('./${relativePath}').${typeName}`;

    // 1. Map string key to the actual TypeScript Interface
    interfaceLines.push(`    '${key}': ${typeImport};`);

    // 2. Generate the Overloads for this specific key
    // This allows the IDE to know that isSolid<'USER'>(data) returns data is User
    functionLines.push(
      `  export function isSolid(data?: undefined): true;`,
      `  export function isSolid(data: unknown): data is TSolid<'${key}', ${typeImport}>;`,
    );
  });

  const dts = [
    emitter.banner,
    `/* eslint-disable ${emitter.eslintDisabled.join(' ')} */`,
    ...emitter.imports,
    '',
    `declare module '${emitter.moduleName}' {`,
    `  interface ISolidRegistry {`,
    ...interfaceLines,
    `  }`,
    '',
    `  // --- GHOST REGISTRATIONS ---`,
    ...functionLines,
    `}`,
  ]
    .join('\n')
    .trim();

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const existing = fs.existsSync(envFile)
    ? fs.readFileSync(envFile, 'utf8')
    : '';
  if (dts !== existing) {
    fs.writeFileSync(envFile, dts);
  }
}
// export function emitAmbientTypes(
//   rootDir: string,
//   registry: Map<string, string>,
// ) {
//   const { emitter } = IS_SOLID_CONFIG_ITEMS;

//   const targetDir = path.join(rootDir, emitter.targetDir);
//   const envFile = path.join(targetDir, emitter.fileName);

//   // HEADER
//   const eslintHeader = `/* eslint-disable ${emitter.eslintDisabled.join(' ')} */`;
//   const importHeader = emitter.imports.join('\n');

//   // CONTENT
//   const interfaceLines: string[] = [];
//   const functionLines: string[] = [];
//   registry.forEach((value, key) => {
//     const [absPath, typeName] = value.split('|');
//     const typeImport = `import('${absPath}').${typeName}`;

//     interfaceLines.push(`    '${key}': ${typeImport};`);
//     functionLines.push(
//       `  export function isSolid(data: unknown): data is TSolid<'${key}', ${typeImport}>;`,
//     );
//   });
//   const dts = `
//     ${emitter.banner}
//     ${eslintHeader}
//     ${importHeader}

//     declare module '${emitter.moduleName}' {
//       interface ISolidRegistry {
//     ${interfaceLines.join('\n')}
//       }

//     ${functionLines.join('\n')}
//     }
// `.trim();

//   if (!fs.existsSync(targetDir)) {
//     fs.mkdirSync(targetDir, { recursive: true });
//   }

//   // 5. Atomic File Check & Write
//   // ✨ Fix: Specifically checking and reading the FILE path
//   let existing = '';
//   if (fs.existsSync(envFile) && !fs.lstatSync(envFile).isDirectory()) {
//     existing = fs.readFileSync(envFile, 'utf8');
//   }

//   if (dts !== existing) {
//     fs.writeFileSync(envFile, dts);
//   }
// }
