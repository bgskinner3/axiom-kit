import type {
  TShapeDefaultMaterializeMap,
  TShapeMockMapperMap,
  TSolidShape,
  TShapeCloneMapperMap,
} from '../models/types';
import { ObjectUtils } from '../utils/object-utils';
import { generateRandomString } from '../utils/common';
import { isObject, isNull } from '../utils/guards';
import { PRIMITIVE_DEFAULTS } from '../models/constants';
import { XalethorVaultKeeper } from '../xalor-service/vault-keeper';
import { IS_SOLID_CONFIG_ITEMS } from '../models/constants';
import { validateShape, createInitialContext } from '../validation';
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

      if (typeof mockedPart === 'object' && !Array.isArray(mockedPart)) {
        const currentObj = mockedPart as Record<string, unknown>;
        merged =
          merged && typeof merged === 'object' && !Array.isArray(merged)
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

/**
 * ============================================================================
 * 🧼 DESIGN SYSTEM MAPPER: CLONE SHAPE SANITIZER
 * ============================================================================
 *
 * ROLE:
 * The "Sanitizer." Performs a deep, circular-safe scrubbing copy of data,
 * physically removing any keys or structural elements NOT defined in the blueprint.
 *
 * @see produceClone
 */
export const CLONE_SHAPE_SANITIZER_MAPPER: TShapeCloneMapperMap = {
  // 1. PRIMITIVES & LITERALS
  primitive: (_shape, data) => data, // Primitives are immutable pass-through nodes

  literal: (shape, data) => (data === shape.value ? data : null),

  // 2. OBJECTS (The Core Scrubbing Zone)
  object: (shape, data, seen, depth, recurse) => {
    if (!isObject(data) || isNull(data)) return null;

    // Preserve class prototypes cleanly if tracking class instances
    const proto = Object.getPrototypeOf(data);
    const cleanObj = Object.create(proto);
    seen.set(data, cleanObj);

    // 🎯 THE XALOR LAW: Loop the BLUEPRINT properties, ignoring raw data keys.
    // This physically strips un-declared variables from memory cache layers.
    const blueprintProps = shape.properties;
    for (const key in blueprintProps) {
      if (
        Reflect.has(blueprintProps, key) &&
        Reflect.has(data as object, key)
      ) {
        const sourceValue = (data as any)[key];
        const metadata = blueprintProps[key];

        cleanObj[key] = recurse(sourceValue, metadata.shape, seen, depth + 1);
      }
    }
    return cleanObj;
  },

  // 3. COLLECTIONS (With Safe Performance Buffer Bounds)
  array: (shape, data, seen, depth, recurse) => {
    if (!Array.isArray(data)) return [];

    const copy: unknown[] = [];
    seen.set(data, copy);

    // 🛡️ THE ARRAY BRAKE: Prevent infinite loops or memory crashes on rogue payloads
    const limit = Math.min(
      data.length,
      IS_SOLID_CONFIG_ITEMS.reifyLimit.maxObjectProperties,
    );

    for (let i = 0; i < limit; i++) {
      copy[i] = recurse(data[i], shape.items, seen, depth + 1);
    }
    return copy;
  },

  // 4. LOGICAL COMBINATORS (Unions & Intersections)
  union: (shape, data, seen, depth, recurse) => {
    // Union Sniffing: Locate which sub-branch validly parses this payload shape
    const matchingBranch = shape.values.find((branch) =>
      validateShape(data, branch, createInitialContext()),
    );

    return matchingBranch ? recurse(data, matchingBranch, seen, depth) : null;
  },

  intersection: (shape, data, seen, depth, recurse) => {
    let merged: Record<string, unknown> | unknown = undefined;

    for (const part of shape.parts) {
      // 🎯 THE FIX: Pass 'data' first, and the blueprint 'part' second
      const clonedPart = recurse(data, part, seen, depth);

      if (clonedPart === null || clonedPart === undefined) continue;

      if (typeof clonedPart === 'object' && !Array.isArray(clonedPart)) {
        const currentObj = clonedPart as Record<string, unknown>;

        merged =
          merged && typeof merged === 'object' && !Array.isArray(merged)
            ? { ...(merged as Record<string, unknown>), ...currentObj }
            : currentObj;
      } else {
        merged = clonedPart;
      }
    }
    return merged;
  },

  // 5. GRAPH JUMPS (Atomic Slices)
  reference: (shape, data, seen, depth, recurse) => {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? recurse(data, subShape, seen, depth) : data;
  },

  // 6. WRAPPERS
  branded: (shape, data, seen, depth, recurse) =>
    recurse(data, shape.base, seen, depth),
} satisfies TShapeCloneMapperMap;
