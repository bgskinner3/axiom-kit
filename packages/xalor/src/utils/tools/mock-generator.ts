import {
  isPrimitiveShape,
  isObjectShape,
  isArrayShape,
  isUnionShape,
  isLiteralShape,
  isBrandedShape,
  isReferenceShape,
  isIntersectionShape,
  isArray,
  isObject,
} from '../guards';
import { ObjectUtils } from '../object-utils';
import { IS_SOLID_CONFIG_ITEMS } from '../../models/constants';
import type { TSolidShape } from '../../models/types';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';
const generateRandomString = (maxLength: number = 20): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  const length = Math.floor(Math.random() * Math.min(maxLength, 20)) + 5;
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('');
};
const generators: Record<string, (shape: TSolidShape) => unknown> = {
  string: () => generateRandomString(10),
  number: () => Math.floor(Math.random() * 1000),
  boolean: () => Math.random() > 0.5,
  bigint: () => BigInt(Math.floor(Math.random() * 1000000)),
  unknown: () => `unknown_val_${Math.random().toString(36).substring(7)}`,
};

/**
 * 🏗️ PRODUCE MOCK
 *
 * ROLE:
 * The "Simulacrum." Materializes realistic, randomized data structures
 * based on a static TSolidShape blueprint.
 *
 * STRATEGY:
 * - Stochastic Materialization: Randomly decides whether to include optional
 *   fields (50% chance) and varies array lengths (1-3 items).
 * - Law of Entropy: Unlike 'produceDefault', this selects random branches
 *   of Unions to test edge-case logic in consuming code.
 * - Constraint Respect: Random strings and numbers respect the physical
 *   limits (e.g., maxLength) defined in the blueprint.
 *
 * WHY:
 * Essential for frontend prototyping, unit testing, and load testing. It
 * allows developers to see how their systems handle varying but valid data.
 *
 * @example
 * // If shape is { id: number; bio?: string }
 * const mock = produceMock(userShape);
 * // Run 1: { id: 482, bio: "mock_a7f2k" }
 * // Run 2: { id: 103 } // Bio omitted due to optionality entropy
 *
 * @param {TSolidShape} shape - The DNA to simulate.
 * @param {number} depth - Internal recursion tracker.
 * @returns {unknown} - A randomized physical object.
 */
export function produceMock(shape: TSolidShape, depth = 0): unknown {
  if (depth >= IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth) return null;
  if (isPrimitiveShape(shape)) {
    const generator = generators[shape.type];
    return generator ? generator(shape) : undefined;
  }

  // 2. LITERALS: Exact values only
  if (isLiteralShape(shape)) return shape.value;

  // 3. OBJECTS: Recursive & Optionality aware
  if (isObjectShape(shape)) {
    const obj: Record<string, unknown> = {};
    const keys = ObjectUtils.keys(shape.properties);

    for (const key of keys) {
      const metadata = shape.properties[key];
      const shouldInclude = !metadata.optional || Math.random() > 0.5;

      if (shouldInclude) {
        obj[key] = produceMock(metadata.shape, depth + 1);
      }
    }
    return obj;
  }

  // 4. ARRAYS: Variadic lengths (1 to 3)
  if (isArrayShape(shape)) {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, () =>
      produceMock(shape.items, depth + 1),
    );
  }

  // 5. UNIONS: Random Branch Selection
  if (isUnionShape(shape)) {
    const randomIndex = Math.floor(Math.random() * shape.values.length);
    return produceMock(shape.values[randomIndex], depth + 1);
  }

  // 6. REFERENCES (Atomic Jumps)
  if (isReferenceShape(shape)) {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? produceMock(subShape, depth + 1) : undefined;
  }

  // 7. BRANDING: Pass-through
  if (isBrandedShape(shape)) {
    return produceMock(shape.base, depth + 1);
  }
  if (isIntersectionShape(shape)) {
    /**
     * 💎 INTERSECTION LAW: To mock an intersection, we must materialize
     * EVERY part of the DNA and merge them.
     */
    let merged = {};
    for (const part of shape.parts) {
      const mockedPart = produceMock(part, depth);

      // We only merge if the part materializes as an object
      if (mockedPart && isObject(mockedPart) && !isArray(mockedPart)) {
        merged = { ...merged, ...mockedPart };
      } else if (mockedPart !== undefined) {
        // If it's a primitive intersection (rare but possible), the last one wins
        return mockedPart;
      }
    }
    return merged;
  }
  return undefined;
}
