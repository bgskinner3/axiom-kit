import type {
  TSolidShape,
  TShapeNormalizerMap,
  TSolidObjectRawShape,
  TShapeInflatorMap,
} from '../../models/types';
import { computeStringHash } from '../common';
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
