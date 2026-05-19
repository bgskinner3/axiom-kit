import type { TShapeDefaultMaterializeMap } from '../../models/types';
import { ObjectUtils } from '../../utils/object-utils';
import { PRIMITIVE_DEFAULTS } from '../../models/constants';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';

/**
 * ============================================================================
 * 🏗️ DESIGN SYSTEM MAPPER: DEFAULT SHAPE MATERIALIZER
 * ============================================================================
 *
 * ROLE:
 * The "Materializer." Converts static structural TSolidShape blueprints into
 * physical, clean, zero-value JavaScript objects. It acts as the core
 * "3D Printer" of the Factory Layer (Category 3 Generator API).
 * @see produceDefault
 */
export const DEFAULT_SHAPE_MATERIALIZER: TShapeDefaultMaterializeMap = {
  primitive: (shape) => PRIMITIVE_DEFAULTS[shape.type],
  literal: (shape) => shape.value,

  // 2. OBJECTS (Recursive)
  object: (shape, depth, recurse) => {
    const obj: Record<string, unknown> = {};
    const keys = ObjectUtils.keys(shape.properties);

    for (const key of keys) {
      const metadata = shape.properties[key];
      // Keep it minimal: Skip optional fields to build a true "Minimum Viable Object"
      if (!metadata.optional) {
        obj[key] = recurse(metadata.shape, depth + 1);
      }
    }
    return obj;
  },

  array: () => [],

  // 4. LOGICAL COMBINATORS (Unions & Intersections)
  union: (shape, depth, recurse) => {
    // Law of Least Resistance: Materialize the first available branch constituent
    const firstBranch = shape.values[0];
    return firstBranch ? recurse(firstBranch, depth + 1) : undefined;
  },

  intersection: (shape, depth, recurse) => {
    let merged: Record<string, unknown> | unknown = undefined;

    for (const part of shape.parts) {
      const defaultPart = recurse(part, depth);
      if (defaultPart === null || defaultPart === undefined) continue;

      if (typeof defaultPart === 'object' && !Array.isArray(defaultPart)) {
        const currentObj = defaultPart as Record<string, unknown>;
        merged =
          merged && typeof merged === 'object' && !Array.isArray(merged)
            ? { ...(merged as Record<string, unknown>), ...currentObj }
            : currentObj;
      } else {
        merged = defaultPart;
      }
    }
    return merged;
  },

  // 5. GRAPH JUMPS (Atomic Cuts)
  reference: (shape, depth, recurse) => {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? recurse(subShape, depth + 1) : undefined;
  },

  // 6. NOMINAL BRAND WRAPPERS
  branded: (shape, depth, recurse) => recurse(shape.base, depth + 1),
} satisfies TShapeDefaultMaterializeMap;
