// shared/genesis/hydrate-from-genesis.ts
import type { TSolidShape, TSolidMetadata } from '../types';
import { logDev } from '../utils';
import { EXTRACT_SHAPE_NORMALIZERS, BUILD_SHAPE_INFLATORS } from './mappers';

/**
 * 🌀 RECURSIVE RE-SHREDDER
 *
 * ROLE:
 * Deeply flattens complex nested objects into a content-addressable storage map.
 *
 * STRATEGY:
 * Pure computational function. Passes its own identifier as a clean continuation
 * callback loop parameter, entirely avoiding context binding or 'this' keywords.
 *
 * WHY:
 * Satisfies Commandment VIII (Zero-Footprint Iteration). It passes operational
 * states via the stack without allocating intermediate closures.
 */
export function extractAndNormalizeShape(
  shape: TSolidShape,
  flatPool: Record<string, TSolidShape>,
): TSolidShape {
  if (!shape) return shape;

  const executeNormalizer = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): TSolidShape => {
    const normalizer = EXTRACT_SHAPE_NORMALIZERS[kind];

    return normalizer(targetShape, flatPool, (nextShape) =>
      extractAndNormalizeShape(nextShape, flatPool),
    );
  };

  return executeNormalizer(shape.kind, shape);
}

/**
 * 🚀 RECURSIVE RE-ASSEMBLER
 *
 * ROLE:
 * Re-inflates serialized reference hash records back into complete nested objects.
 *
 * STRATEGY:
 * Pure runtime mapping loop. Leverages structural literal handlers to maintain
 * linear execution properties during system cold-starts.
 */
export function inflateAndNormalizeShape(
  shape: TSolidShape,
  blueprintsPool: Record<string, TSolidShape>,
): TSolidShape {
  if (!shape) return shape;

  const executeInflator = <K extends TSolidShape['kind']>(
    kind: K,
    targetShape: Extract<TSolidShape, { kind: K }>,
  ): TSolidShape => {
    const inflator = BUILD_SHAPE_INFLATORS[kind];

    return inflator(targetShape, blueprintsPool, (nextShape) =>
      inflateAndNormalizeShape(nextShape, blueprintsPool),
    );
  };

  return executeInflator(shape.kind, shape);
}

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
