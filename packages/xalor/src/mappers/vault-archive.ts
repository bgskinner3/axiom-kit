import type {
  TSolidShape,
  TShapeNormalizerMap,
  TSolidObjectRawShape,
  TShapeInflatorMap,
} from '../models/types';
import { computeStringHash } from '../utils/common';

/**
 * ============================================================================
 * BUILD-TIME ENCODE MAP: EXTRACT SHAPE NORMALIZERS
 * ============================================================================
 *
 * ROLE:
 * The "De-duplicator." Performs a recursive, content-addressable shredding pass
 * during Stage 4 (Persist) to compress structural layouts before writing to disk.
 *
 * STRATEGY:
 * - Targeted Shredding: Isolates 'object' schemas, replaces them with deterministically
 *   hashed reference tokens ('sh_'), and pushes them flatly into the global database pool.
 * - Value Inlining: Leaves scalars (primitives, literals) and wrappers (arrays, unions)
 *   inline to eliminate empty reference token bloat and optimize downstream reads.
 *
 * WHY:
 * Converts deep, redundant, object dependency trees into a highly compacted,
 * single-instance structural grid—saving massive disk space across monorepos.
 *
 * @see XalethorVaultArchive.persist
 */
export const EXTRACT_SHAPE_NORMALIZERS: TShapeNormalizerMap = {
  object: (shape, flatPool, recurse) => {
    const normalizedProps: Record<string, TSolidObjectRawShape> = {};

    for (const key in shape.properties) {
      if (Reflect.has(shape.properties, key)) {
        const prop = shape.properties[key];
        normalizedProps[key] = {
          ...prop,
          shape: recurse(prop.shape, flatPool),
        };
      }
    }

    const cleanObjectShape: TSolidShape = {
      ...shape,
      properties: normalizedProps,
    };

    const rawStr = JSON.stringify(cleanObjectShape);
    const objectHash = computeStringHash(rawStr);

    flatPool[objectHash] = cleanObjectShape;

    return { kind: 'reference', name: objectHash };
  },

  array: (shape, flatPool, recurse) => ({
    ...shape,
    items: recurse(shape.items, flatPool),
  }),

  union: (shape, flatPool, recurse) => ({
    ...shape,
    values: shape.values.map((v) => recurse(v, flatPool)),
  }),

  intersection: (shape, flatPool, recurse) => ({
    ...shape,
    parts: shape.parts.map((p) => recurse(p, flatPool)),
  }),

  branded: (shape, flatPool, recurse) => ({
    ...shape,
    base: recurse(shape.base, flatPool),
  }),

  primitive: (shape) => shape,
  literal: (shape) => shape,
  reference: (shape) => shape,
} satisfies TShapeNormalizerMap;
/**
 * ============================================================================
 * RUNTIME DECODE MAP: BUILD SHAPE INFLATORS
 * ============================================================================
 *
 * ROLE:
 * The "Re-Assembler." Performs a single-pass inverse tree reconstruction on boot
 * during Stage 5 (Hydrate) to expand flat hashes back into full memory definitions.
 *
 * STRATEGY:
 * - Relational Expansion: Intercepts 'sh_' hash string indicators, jumps to the flat
 *   database snapshot table, and embeds the structural object properties deep inside.
 * - Nominal Isolation: Detects original compiler nominal fragments (like User$d10)
 *   and allows them to bypass the map to maintain cross-fragment tracking for the Bouncer.
 *
 * WHY:
 * Resolves the entire graph data matrix *prior* to inserting blueprints into memory.
 * This ensures your validation runs carrying zero map-hopping lookup overhead.
 *
 * @see XalethorVaultArchive.hydrateFromGenesis
 */
export const BUILD_SHAPE_INFLATORS: TShapeInflatorMap = {
  reference: (shape, blueprintsPool, recurse) => {
    // If this reference name points to an internal content hash entry, jump and inflate it!
    if (Reflect.has(blueprintsPool, shape.name)) {
      return recurse(blueprintsPool[shape.name], blueprintsPool);
    }
    // If it's a structural nominal fragment link (e.g. User$d10), preserve it inline for the Bouncer
    return shape;
  },

  // 🏗️ THE STRUCTURAL COMPLEX INFLATOR
  object: (shape, blueprintsPool, recurse) => {
    const inflatedProps: Record<string, TSolidObjectRawShape> = {};

    for (const key in shape.properties) {
      if (Reflect.has(shape.properties, key)) {
        const prop = shape.properties[key];
        inflatedProps[key] = {
          ...prop,
          shape: recurse(prop.shape, blueprintsPool), // Deep-dive to reconstruct children
        };
      }
    }
    return { ...shape, properties: inflatedProps };
  },

  // 🛰️ THE PASS-THROUGH INFLATORS
  array: (shape, blueprintsPool, recurse) => ({
    ...shape,
    items: recurse(shape.items, blueprintsPool),
  }),

  union: (shape, blueprintsPool, recurse) => ({
    ...shape,
    values: shape.values.map((v) => recurse(v, blueprintsPool)),
  }),

  intersection: (shape, blueprintsPool, recurse) => ({
    ...shape,
    parts: shape.parts.map((p) => recurse(p, blueprintsPool)),
  }),

  branded: (shape, blueprintsPool, recurse) => ({
    ...shape,
    base: recurse(shape.base, blueprintsPool),
  }),

  // 🛡️ STATIC LEAF NODES (Zero modifications)
  primitive: (shape) => shape,
  literal: (shape) => shape,
} satisfies TShapeInflatorMap;
