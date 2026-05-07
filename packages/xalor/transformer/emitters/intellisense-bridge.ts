// transformer/emitters/intellisense-bridge.ts
import {
  IS_SOLID_CONFIG_ITEMS,
  REGISTERED_INTELLIGENCE_FUNCTIONS,
} from '../../src/models';
import { ObjectUtils } from '../../src/utils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * temporalManifest
 *
 * PURPOSE:
 * Composes the raw source string for the ambient declaration (.d.ts) file.
 * It transforms the in-memory Registry Map into a valid TypeScript module
 * augmentation, creating a "Temporal" snapshot of all mined types.
 *
 * ROLE:
 * 1. MAPPING: Converts absolute file paths into portable relative imports.
 * 2. MERGING: Populates the ISolidRegistry interface via declaration merging.
 * 3. OVERLOADING: Generates specific function signatures that map string
 *    keys to their respective TypeScript interfaces for the IDE.
 */
function temporalManifest(
  registry: Map<string, string>,
  targetDir: string,
  emitter: typeof IS_SOLID_CONFIG_ITEMS.emitter,
): string {
  const identityLines: string[] = []; // 💎 For the Imports (Names)
  const registryLines: string[] = []; // 💎 For the Shapes (Structures)

  registry.forEach((value, key) => {
    const [filePath, symbolName, rawStructure] = value.split('|');

    const isNamed = symbolName !== 'unknown' && !symbolName.startsWith('{');

    if (isNamed) {
      const relPath = path
        .relative(targetDir, filePath)
        .replace(/\\/g, '/')
        .replace('.ts', '');
      identityLines.push(`    '${key}': import('./${relPath}').${symbolName};`);
    }

    // Always add the raw structure to the Registry
    registryLines.push(`    '${key}': ${rawStructure};`);
  });

  // 2. Fetch the "Master" signatures from your config
  const functionLines = ObjectUtils.values(
    REGISTERED_INTELLIGENCE_FUNCTIONS,
  ).map((config) =>
    config.signature({ key: 'K', typeImport: 'ISolidRegistry[K]' }),
  );

  return [
    emitter.banner,
    `/* eslint-disable ${emitter.eslintDisabled.join(' ')} */`,
    ...emitter.imports,
    '',
    `declare module '${emitter.moduleName}' {`,
    // --- VAULT 1: THE NAMES ---
    `  interface ISolidIdentity {`,
    ...identityLines,
    `  }`,
    '',
    // --- VAULT 2: THE STRUCTURES ---
    `  interface ISolidRegistry {`,
    ...registryLines,
    `  }`,
    '',
    `  // --- UNIFIED GHOST API ---`,
    ...functionLines,
    `}`,
  ]
    .join('\n')
    .trim();
}

/**
 * hydrateIntellisenseBridge
 *
 * PURPOSE:
 * Orchestrates the physical emission of the IDE "Ghost Layer." It synchronizes
 * the build-time metadata with the developer's environment to enable
 * zero-import autocomplete and hover-cards.
 *
 * ROLE:
 * 1. PATH RESOLUTION: Determines the absolute destination for the .d.ts file.
 * 2. ATOMIC SYNC: Only writes to disk if the temporal manifest has changed,
 *    preventing unnecessary IDE re-indexes or build triggers.
 * 3. DIRECTORY SAFETY: Ensures the distribution path exists before writing.
 */
export function hydrateIntellisenseBridge(
  rootDir: string,
  registry: Map<string, string>,
) {
  const { emitter } = IS_SOLID_CONFIG_ITEMS;
  const targetDir = path.join(rootDir, emitter.targetDir);
  const envFile = path.join(targetDir, emitter.fileName);

  // 🚩 DEBUG LOGS
  // console.log(`[xalor-fs] Attempting to write to: ${envFile}`);
  // console.log(`[xalor-fs] Registry size: ${registry.size}`);

  const dts = temporalManifest(registry, targetDir, emitter);

  if (!fs.existsSync(targetDir)) {
    // console.log(`[xalor-fs] Creating missing directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(envFile, dts); // 💎 FORCE WRITE (Remove the 'existing' check for now)
  // console.log(`[xalor-fs] ✅ File written successfully.`);
}
