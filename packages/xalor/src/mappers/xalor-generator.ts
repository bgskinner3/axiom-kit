import type {
  TShapeDefaultMaterializeMap,
  TShapeMockMapperMap,
  TShapeCloneMapperMap,
  TShapeCastMapperMapper,
  TCastingPrimitiveMapper,
} from '../models/types';
import { ObjectUtils } from '../utils/object-utils';
import { generateRandomString } from '../utils/transformers';
import {
  isObject,
  isNull,
  isString,
  isBoolean,
  isNumber,
  isBigInt,
  isUndefined,
  isArray,
} from '../../shared';
import { PRIMITIVE_DEFAULTS } from '../models/constants';
import { XalethorVaultKeeper } from '../xalor-service/vault-keeper';
import { IS_SOLID_CONFIG_ITEMS } from '../../shared';
import { validateShape, createInitialContext } from '../validation';
import type { TSolidShape } from '../../shared';
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
        const sourceValue = data[key];
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

/**
 * CASTING_PRIMITIVE_GENERATORS
 *
 */
/* prettier-ignore */ const CASTING_PRIMITIVE_GENERATOR: TCastingPrimitiveMapper = {
    number: (data: unknown): number | unknown => {
    // 🚀 THE GUARD WIN: Uses your custom isNumber guard to enforce that NaN is immediately rejected
    if (isNumber(data)) return data;
    
    const parsed = Number(data);
    return isNumber(parsed) ? parsed : data; 
  },
  string: (data: unknown): string => {
    if (isString(data)) return data;
    if (isObject(data)) return JSON.stringify(data);
    return String(data);
  },
  boolean: (data: unknown): boolean => {
    if (isBoolean(data)) return data;
    
    if (isString(data)) {
      const cleaned = data.trim().toLowerCase();
      if (cleaned === 'true') return true;
      if (cleaned === 'false') return false;
    }
    return Boolean(data);
  },
  bigint: (data: unknown): bigint | unknown => {
    if (isBigInt(data)) return data;
    try {
      return BigInt(String(data));
    } catch {
      return data;
    }
  },
  unknown: (data: unknown): unknown => data
} satisfies TCastingPrimitiveMapper

export const CAST_SHAPE_MAPPER: TShapeCastMapperMapper = {
  /* prettier-ignore */ primitive: (shape: Extract<TSolidShape, { kind: 'primitive' }>, data: unknown, _depth: number, _recurse: unknown) => {
    if (isUndefined(data)|| isNull(data)) return data;
    const coercer = CASTING_PRIMITIVE_GENERATOR[shape.type];
    return coercer ? coercer(data) : data;
  },
  object: (shape, data, depth, recurse) => {
    if (!data || !isObject(data) || isArray(data)) return data;
    const castedObject: Record<string, unknown> = {};
    for (const key of ObjectUtils.keys(shape.properties)) {
      const childShape = shape.properties[key].shape;
      castedObject[key] = recurse(childShape, data[key], depth + 1);
    }

    return castedObject;
  },

  array: (shape, data, depth, recurse) => {
    if (!isArray(data)) {
      // If data is accidentally a single item instead of an array, wrap it and attempt coercion
      if (!isUndefined(data) && !isNull(data))
        return [recurse(shape.items, data, depth + 1)];
      return [];
    }

    return data.map((item) => recurse(shape.items, item, depth + 1));
  },
  union: (shape, data, depth, recurse) => {
    // Phase 1: Check if the raw input already satisfies a branch without casting
    const immediateMatch = shape.values.find((branch) =>
      validateShape(data, branch, createInitialContext()),
    );
    if (immediateMatch) return recurse(immediateMatch, data, depth);

    // Phase 2: If no direct match, attempt to cast against the first available variant branch
    const fallbackBranch = shape.values[0];
    return fallbackBranch ? recurse(fallbackBranch, data, depth) : data;
  },
  literal: (shape, data, _depth, _recurse) => {
    if (data === shape.value) return data;

    if (isString(shape.value) && isString(data)) {
      // If they match case-insensitively, force it to the contract's exact target value!
      if (data.trim().toLowerCase() === shape.value.toLowerCase()) {
        return shape.value;
      }
    }

    if (isNumber(shape.value)) {
      const parsed = Number(data);
      if (!isNaN(parsed) && parsed === shape.value) {
        return parsed;
      }
    }

    if (isBoolean(shape.value)) {
      const normalizedInput = String(data).trim().toLowerCase();
      if (normalizedInput === String(shape.value)) {
        return shape.value;
      }
    }

    return data;
  },
  intersection: (shape, data, depth, recurse) => {
    let merged: Record<string, unknown> | unknown = undefined;

    for (const part of shape.parts) {
      const castedPart = recurse(part, data, depth);
      if (isUndefined(castedPart) || isNull(castedPart)) continue;

      if (isObject(castedPart) && !isArray(castedPart)) {
        const shouldMerge = merged && isObject(merged) && !isArray(merged);
        const currentObj: Record<string, unknown> = { ...castedPart };
        merged = shouldMerge
          ? { ...(merged as Record<string, unknown>), ...currentObj }
          : currentObj;
      } else {
        merged = castedPart;
      }
    }
    return merged;
  },
  reference: (shape, data, depth, recurse) => {
    // Resolve dynamic content-addressable storage layout links inside the global vault pointer mapping
    const resolvedBlueprint =
      globalThis.__SOLID_VAULT__?.blueprints?.[shape.name];
    if (!resolvedBlueprint) return data;
    return recurse(resolvedBlueprint, data, depth + 1);
  },
  branded: (shape, data, depth, recurse) => recurse(shape.base, data, depth),
} satisfies TShapeCastMapperMapper;
