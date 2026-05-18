import { inflateAndNormalizeShape } from './support';
import type { TSolidMetadata } from '../types';
import { logDev } from '../utils';

/**
 * 🌿 PURE STREAMING HYDRATION ENGINE
 *
 * ROLE:
 * Decoupled, environment-agnostic blueprint processing loop.
 *
 * STRATEGY:
 * - Pure Function: Accepts a raw JSON content string instead of managing disk files.
 * - Inversion of Control: Accepts an `onSolidify` execution callback parameter.
 *   The caller decides if the data is assigned to compiler maps or runtime heaps.
 *
 * WHY:
 * Satisfies Commandment III and VIII. It performs memory-isolated parsing
 * without leaking file systems or runtime singletons into the shared space.
 */
export function processGenesisHydration(
  rawJsonContent: string,
  onSolidify: (metadata: TSolidMetadata) => void,
): void {
  try {
    const snapshot = JSON.parse(rawJsonContent);
    const blueprints = snapshot.blueprints || {};
    const nominalKeys = Object.keys(snapshot.references || blueprints);

    // 🔄 THE RECONSTRUCTION LOOP
    for (const key of nominalKeys) {
      if (key === 'Anonymous') continue;

      const shapeHash = snapshot.references ? snapshot.references[key] : key;
      const rawShape = blueprints[shapeHash];
      const manifest = snapshot.manifest?.[key];
      const registry = snapshot.registry?.[key];

      if (!rawShape) continue;

      // Unpack references using your pure recursor loop
      const fullyInflatedShape = inflateAndNormalizeShape(rawShape, blueprints);

      // 🚀 INVERSION TRIGGER: Fire the callback injected by the caller
      onSolidify({
        key,
        shape: fullyInflatedShape,
        area: manifest?.area ?? 'unknown:0:0',
        filePath: manifest?.filePath ?? 'unknown_file.ts',
        symbolName: registry?.symbolName ?? 'unknown',
        typeName: registry?.typeName ?? '{ ... }',
        version: snapshot.version ?? '1.0.0',
      });
    }

    /* prettier-ignore */
    logDev(`[xalor:shared] 🌿 Hydration loop processed ${nominalKeys.length} type models into target memory map.`, { service: 'transformer/boot' });
  } catch (error) {
    /* prettier-ignore */
    logDev(`[xalor:shared] 🚨 Genesis Hydration structural parsing failed: ${error}`, { type: 'error', service: 'transformer/boot', override: true });
  }
}
