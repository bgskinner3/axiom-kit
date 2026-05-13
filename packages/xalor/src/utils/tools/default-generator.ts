import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
  isReferenceShape,
  isIntersectionShape,
} from '../guards';
import { ObjectUtils } from '../object-utils';
import {
  PRIMITIVE_DEFAULTS,
  IS_SOLID_CONFIG_ITEMS,
} from '../../models/constants';
import type { TSolidShape } from '../../models/types';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';

/**
 * 🏗️ PRODUCE DEFAULT
 *
 * ROLE:
 * The "Materializer." Converts a static TSolidShape blueprint into a
 * physical, zero-value JavaScript object.
 *
 * STRATEGY:
 * - Recursive Materialization: Traverses the shape tree to build nested structures.
 * - Reference Resolution: Jumps across "Atomic Cut" fragments via the VaultKeeper.
 * - Law of Least Resistance: Defaults to the first branch of a Union.
 * - Depth Protection: Bails at IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth to prevent infinite loops.
 */
export function produceDefault(shape: TSolidShape, depth = 0): unknown {
  // 🛑 THE EMERGENCY BRAKE
  // Sync with Miner's maxDepth (10) to prevent Stack Overflow on circular types.
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) {
    return null;
  }

  // 1. PRIMITIVES & LITERALS
  if (isPrimitiveShape(shape)) return PRIMITIVE_DEFAULTS[shape.type];
  if (isLiteralShape(shape)) return shape.value;

  // 2. OBJECTS (Recursive)
  if (isObjectShape(shape)) {
    const obj: Record<string, unknown> = {};
    const keys = ObjectUtils.keys(shape.properties);

    for (const key of keys) {
      const metadata = shape.properties[key];
      // Skip optional fields for a "Minimum Viable Object"
      if (!metadata.optional) {
        obj[key] = produceDefault(metadata.shape, depth + 1);
      }
    }
    return obj;
  }

  // 3. COLLECTIONS
  if (isArrayShape(shape)) return [];
  if (isIntersectionShape(shape)) {
    /**
     * 💎 INTERSECTION LAW: To materialize an intersection, we construct
     * every atomic sub-constituent and aggregate their properties flatly.
     */
    let merged: Record<string, unknown> | unknown = undefined;

    for (const part of shape.parts) {
      const defaultPart = produceDefault(part, depth);

      if (defaultPart === null || defaultPart === undefined) continue;

      if (typeof defaultPart === 'object' && !Array.isArray(defaultPart)) {
        // 🎯 THE TYPE-SAFE TWIST: Safely narrow unknown to perform property spreads
        const currentObj = defaultPart as Record<string, unknown>;

        merged =
          merged && typeof merged === 'object' && !Array.isArray(merged)
            ? { ...(merged as Record<string, unknown>), ...currentObj }
            : currentObj;
      } else {
        // If it evaluates to a scalar primitive or literal value, it seeds the tracking base
        merged = defaultPart;
      }
    }
    return merged;
  }
  // 4. GRAPH JUMPS (Atomic Cuts)
  if (isReferenceShape(shape)) {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    // Jumping to a fragment counts as a depth increment
    return subShape ? produceDefault(subShape, depth + 1) : undefined;
  }

  // 5. BRANCHES & WRAPPERS
  if (isUnionShape(shape)) {
    // Law of Least Resistance: Take the first available branch
    const firstBranch = shape.values[0];
    return firstBranch ? produceDefault(firstBranch, depth + 1) : undefined;
  }

  if (isBrandedShape(shape)) {
    return produceDefault(shape.base, depth + 1);
  }

  return undefined;
}
// /**
//  * 🏗️ PRODUCE DEFAULT
//  *
//  * ROLE:
//  * The "Materializer." Converts a static TSolidShape blueprint into a
//  * physical, zero-value JavaScript object.
//  *
//  * STRATEGY:
//  * - Recursive Materialization: Traverses the shape tree to build nested structures.
//  * - Reference Resolution: Jumps across "Atomic Cut" fragments via the VaultKeeper.
//  * - Law of Least Resistance: Defaults to the first branch of a Union.
//  * - Structural Integrity: Omits optional fields to produce a minimal valid set.
//  *
//  * WHY:
//  * Provides a "Standard Initial State" for any solidified type. Essential for
//  * form initialization, state management, and the `XalethorVaultGenerator.cast` logic.
//  *
//  * @param {TSolidShape} shape - The structural DNA to materialize.
//  * @returns {unknown} - A physical representation of the TypeScript interface.
//  */
// export function produceDefault(shape: TSolidShape, depth = 0): unknown {
//   if (isPrimitiveShape(shape)) return PRIMITIVE_DEFAULTS[shape.type];
//   if (isLiteralShape(shape)) return shape.value;

//   if (isObjectShape(shape)) {
//     const obj: Record<string, unknown> = {};
//     const keys = ObjectUtils.keys(shape.properties);
//     for (const key of keys) {
//       const metadata = shape.properties[key];
//       // Only generate if required; let optional fields stay undefined
//       if (!metadata.optional) {
//         obj[key] = produceDefault(metadata.shape);
//       }
//     }
//     return obj;
//   }

//   if (isArrayShape(shape)) return [];

//   // 🔗 THE MISSING LINK: Reference Resolution
//   if (isReferenceShape(shape)) {
//     // Jump to the Vault to get the shredded fragment
//     const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
//     return subShape ? produceDefault(subShape) : undefined;
//   }

//   if (isUnionShape(shape)) {
//     // Law of Least Resistance: Use the first valid branch
//     return shape.values[0] ? produceDefault(shape.values[0]) : undefined;
//   }

//   if (isBrandedShape(shape)) return produceDefault(shape.base);

//   return undefined;
// }
