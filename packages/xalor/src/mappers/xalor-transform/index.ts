import type { TUniversalTransformMapper } from '../../models/types';
import { isUndefined } from '../../../shared';
import { XalethorVaultKeeper } from '../../xalor-service/vault-keeper';
import { validateShape, createInitialContext } from '../../validation';
import { transformerMapperObject } from './mapper-object';
import { transformerMapperArray } from './mapper-array';

/**
 * 🗺️ UNIVERSAL AUTOMATED SHAPE TRANSFORMATION MAPPER MATRIX
 *
 * ROLE:
 * The single source of truth matrix driving both property selection ('pick'/'omit')
 * and nominal alignment ('rename'). It collapses duplicate boilerplate routines
 * into a single unified execution pass with O(1) performance capability.
 *
 */
export const TRANSFORM_SHAPE_MAPPER: TUniversalTransformMapper = {
  // Primitives represent immutable terminal leaf nodes
  primitive: (_shape, data, dependency) => {
    return dependency.mode === 'merge' && isUndefined(data)
      ? dependency.patchData
      : data;
  },
  literal: (shape, data, dependency) => {
    const activeValue =
      dependency.mode === 'merge' && isUndefined(data)
        ? dependency.patchData
        : data;
    return activeValue === shape.value ? activeValue : null;
  },
  object: (shape, data, dependency, depth, recurse) =>
    transformerMapperObject({ shape, data, dependency, depth, recurse }),

  array: (shape, data, dependency, depth, recurse) =>
    transformerMapperArray({ shape, data, dependency, depth, recurse }),

  union: (shape, data, dependency, depth, recurse) => {
    const sampleVal =
      dependency.mode === 'merge' && data === undefined
        ? dependency.patchData
        : data;
    const matchingBranch = shape.values.find((branch) =>
      validateShape(sampleVal, branch, createInitialContext()),
    );
    return matchingBranch
      ? recurse(data, matchingBranch, dependency, depth)
      : null;
  },

  intersection: (shape, data, dependency, depth, recurse) => {
    let merged = {};
    for (const part of shape.parts) {
      const transformedPart = recurse(data, part, dependency, depth);
      if (transformedPart && typeof transformedPart === 'object') {
        merged = { ...merged, ...transformedPart };
      }
    }
    return merged;
  },

  reference: (shape, data, dependency, depth, recurse) => {
    const subShape = XalethorVaultKeeper.peek('blueprint', shape.name);
    return subShape ? recurse(data, subShape, dependency, depth + 1) : null;
  },

  branded: (shape, data, dependency, depth, recurse) => {
    return recurse(data, shape.base, dependency, depth);
  },
} as const satisfies TUniversalTransformMapper;
