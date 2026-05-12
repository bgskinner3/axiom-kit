// transformer/emitters/intellisense-bridge.ts
import {
  IS_SOLID_CONFIG_ITEMS,
  REGISTERED_INTELLIGENCE_FUNCTIONS,
} from '../../src/models';
import { ObjectUtils } from '../../src/utils';
import * as fs from 'fs';
import * as path from 'path';
import type { TVaultSyncPayload } from '../types';
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
  registry: Map<string, TVaultSyncPayload>,
  targetDir: string,
  emitter: typeof IS_SOLID_CONFIG_ITEMS.emitter,
): string {
  const identityLines: string[] = []; // !!! For the Imports (Names)
  const registryLines: string[] = []; // !!! For the Shapes (Structures)

  registry.forEach((payload, key) => {
    const { filePath, symbolName, area, typeName } = payload;

    const relPath = path
      .relative(targetDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.(ts|tsx|js|jsx)$/, '');

    // 1. Extract just the line number from "path/to/file.ts:14:5"
    const line = area.split(':').reverse()[1] || 'unknown';

    // 2. THE IDENTITY CHOICE
    const canImport =
      symbolName !== 'unknown' &&
      !symbolName.includes('{') &&
      !key.includes('$');

    if (canImport) {
      // 💎 PREMIUM: Clickable source link
      identityLines.push(`    '${key}': import('./${relPath}').${symbolName};`);
    } else {
      // 📍 FALLBACK: Just show the line number so they know where to look
      // This appears in the IDE as: "USER": 14
      identityLines.push(`    '${key}': "${relPath}"; // 📍 Line in ${line}`);
    }

    // 💎 2. THE REGISTRY (The Structural Fallback + GPS)
    // We add the path as a comment for the developer to see in the hover-card
    registryLines.push(
      `    /** 📍 Origin: ${relPath} */\n    '${key}': ${typeName};`,
    );
  });

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
export function hydrateIntellisenseBridged(
  rootDir: string,
  registry: Map<string, TVaultSyncPayload>,
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

  fs.writeFileSync(envFile, dts);
  // console.log(`[xalor-fs] ✅ File written successfully.`);
}
// transformer/emitters/intellisense-bridge.ts

export function hydrateIntellisenseBridge(
  rootDir: string,
  registry: Map<string, TVaultSyncPayload>,
) {
  // 📍 FIX: Use the specific bridgeDir from lifeCyclePaths
  const { lifeCyclePaths, emitter } = IS_SOLID_CONFIG_ITEMS;

  const targetDir = path.join(rootDir, lifeCyclePaths.bridgeDir);
  const envFile = path.join(targetDir, lifeCyclePaths.bridgeFile); // Use bridgeFile instead of fileName

  const dts = temporalManifest(registry, targetDir, emitter);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(envFile, dts);
}
