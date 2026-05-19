import type { TShapeMockMapperMap } from '../../models/types';
import { ObjectUtils } from '../../utils/object-utils';
import { generateRandomString } from '../../utils/transformers';
import { isArray } from '../../../shared';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';
import type { TSolidShape } from '../../../shared';

/**
 * ============================================================================
 * 🎲 DESIGN SYSTEM MAPPER: MOCK SHAPE MATERIALIZER
 * ============================================================================
 *
 * ROLE:
 * The "Simulacrum." Materializes highly realistic, randomized data structures
 * that respect your static blueprint limits while introducing structural entropy.
 *
 * @see produceMock
 */
/* prettier-ignore */ const PRIMITIVE_MOCK_GENERATORS: Record<string,(shape: TSolidShape) => unknown> = {
  string: () => generateRandomString(10),
  number: () => Math.floor(Math.random() * 1000),
  boolean: () => Math.random() > 0.5,
  bigint: () => BigInt(Math.floor(Math.random() * 1000000)),
  unknown: () => `unknown_val_${Math.random().toString(36).substring(7)}`,
} satisfies Record<string,(shape: TSolidShape) => unknown>

export const MOCK_SHAPE_MATERIALIZER: TShapeMockMapperMap = {
  // 1. PRIMITIVES & LITERALS
  primitive: (shape) => {
    const generator = PRIMITIVE_MOCK_GENERATORS[shape.type];
    return generator ? generator(shape) : undefined;
  },

  literal: (shape) => shape.value,

  // 2. OBJECTS (Stochastic & Optionality-Aware)
  object: (shape, depth, recurse) => {
    const obj: Record<string, unknown> = {};
    const keys = ObjectUtils.keys(shape.properties);

    for (const key of keys) {
      const metadata = shape.properties[key];
      // 🎲 STOCHASTIC ENTROPY: Required fields are absolute, optionals have a 50% appearance rate
      const shouldInclude = !metadata.optional || Math.random() > 0.5;

      if (shouldInclude) {
        obj[key] = recurse(metadata.shape, depth + 1);
      }
    }
    return obj;
  },

  // 3. COLLECTIONS (Variadic Length 1-3)
  array: (shape, depth, recurse) => {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, () => recurse(shape.items, depth + 1));
  },

  // 4. LOGICAL COMBINATORS (Unions & Intersections)
  union: (shape, depth, recurse) => {
    // Law of Entropy: Picks a completely random branch to stretch edge-case logic testing
    const randomIndex = Math.floor(Math.random() * shape.values.length);
    const targetBranch = shape.values[randomIndex];
    return targetBranch ? recurse(targetBranch, depth + 1) : undefined;
  },

  intersection: (shape, depth, recurse) => {
    let merged: Record<string, unknown> | unknown = undefined;

    for (const part of shape.parts) {
      const mockedPart = recurse(part, depth);
      if (mockedPart === null || mockedPart === undefined) continue;

      if (typeof mockedPart === 'object' && !isArray(mockedPart)) {
        const currentObj = mockedPart as Record<string, unknown>;
        merged =
          merged && typeof merged === 'object' && !isArray(merged)
            ? { ...(merged as Record<string, unknown>), ...currentObj }
            : currentObj;
      } else {
        merged = mockedPart;
      }
    }
    return merged;
  },

  // 5. GRAPH JUMPS (Atomic Cuts)
  reference: (shape, depth, recurse) => {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? recurse(subShape, depth + 1) : undefined;
  },

  // 6. WRAPPERS
  branded: (shape, depth, recurse) => recurse(shape.base, depth + 1),
} satisfies TShapeMockMapperMap;
