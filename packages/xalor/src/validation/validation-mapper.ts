// src/validation/validation-mapper.ts
import {
  validateArray,
  validateReference,
  validateIntersection,
  validateUnion,
  validateObject,
  validatePrimitive,
  validateLiteral,
} from './validators';
import type { TValidatorMapper } from '../models/types';
import {
  isPrimitiveShape,
  isLiteralShape,
  isObjectShape,
  isArrayShape,
  isBrandedShape,
  isIntersectionShape,
  isUnionShape,
  isReferenceShape,
} from '../utils/guards';
import { solidifyShape } from './solidify-shape';
/**
 * 💎 VALIDATOR MAPPING TABLE
 *
 * A specialized lookup table that maps Shape Kinds to their execution logic.
 *
 * INVARIANTS:
 * - Governed by COMMANDMENT IV: Operation Isolation (Routes only, no logic).
 * - Governed by COMMANDMENT VIII: Internal Efficiency (Static lookup).
 * - ZERO 'as' casts. ZERO 'any' usage.
 */
export const VALIDATORS: TValidatorMapper = {
  primitive: (data, shape, ctx) => {
    if (!isPrimitiveShape(shape)) return false;
    return validatePrimitive(data, shape, ctx);
  },
  literal: (data, shape, ctx) =>
    isLiteralShape(shape) && validateLiteral(data, shape, ctx),
  union: (data, shape, ctx) => {
    if (!isUnionShape(shape)) return false;
    return validateUnion(data, shape, ctx);
  },
  object: (data, shape, ctx) => {
    if (!isObjectShape(shape)) return false;
    return validateObject(data, shape, ctx);
  },
  branded: (data, shape, ctx) => {
    if (!isBrandedShape(shape)) return false;

    return solidifyShape(data, shape.base, ctx);
  },
  array: (data, shape, ctx) => {
    if (!isArrayShape(shape)) return false;
    return validateArray(data, shape, ctx);
  },
  intersection: (data, shape, ctx) => {
    if (!isIntersectionShape(shape)) return false;
    return validateIntersection(data, shape, ctx);
  },

  reference: (data, shape, ctx) => {
    if (!isReferenceShape(shape)) return false;
    return validateReference(data, shape, ctx);
  },
} satisfies TValidatorMapper;
