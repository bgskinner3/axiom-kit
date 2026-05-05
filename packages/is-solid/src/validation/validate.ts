import type {
  TValidationContext,
  TValidatorMapper,
  TSolidShape,
} from '../../models/types';
import { createInitialContext } from './context';
import { validateObject } from './objects';
import { validateUnion } from './unions';
import { validateIntersection } from './intersections';
import { validateReference } from './reference';
import {
  isPrimitiveShape,
  isLiteralShape,
  isObjectShape,
  isArrayShape,
  isBrandedShape,
  isIntersectionShape,
  isUnionShape,
  isReferenceShape,
} from '../../models/guards';
import { isObject, isNull, isPrimitive, isArray } from '../utils/guards';

const VALIDATORS: TValidatorMapper = {
  primitive: (data, shape) => {
    if (!isPrimitiveShape(shape)) return false;
    if (shape.type === 'unknown') return true;
    return typeof data === shape.type && isPrimitive(data);
  },
  literal: (data, shape) => {
    if (!isLiteralShape(shape)) return false;
    return data === shape.value;
  },
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

    return validate(data, shape.base, ctx);
  },
  array: (data, shape, ctx) => {
    if (!isArrayShape(shape)) return false;
    return (
      isArray(data) && data.every((item) => validate(item, shape.items, ctx))
    );
  },
  intersection: (data, shape, ctx) => {
    if (!isIntersectionShape(shape)) return false;
    return validateIntersection(data, shape, ctx);
  },

  reference: (data, shape, ctx) => {
    if (!isReferenceShape(shape)) return false;
    return validateReference(data, shape, ctx);
    // const vault = getGlobalVault();
    // if (!vault) return false;
    // const metadata = vault.items.get(shape.name);
    // if (!metadata) return false;

    // // 3. Validate the data against the blueprint we just found
    // // This stays in the same context (seen, path, etc.)
    // return validate(data, metadata.shape, ctx);
  },
} satisfies TValidatorMapper;

/**
 * Validates raw data against a Solid Shape.
 * No 'any', no 'as'.
 */
export function validate(
  data: unknown,
  shape: TSolidShape,
  ctx: TValidationContext = createInitialContext(),
): boolean {
  // 1. Handle Recursion Protection
  if (isObject(data) && !isNull(data)) {
    const validatedShapes = ctx.seen.get(data);
    if (validatedShapes?.has(shape)) return true;

    if (!validatedShapes) {
      ctx.seen.set(data, new Set([shape]));
    } else {
      validatedShapes.add(shape);
    }
  }
  const validator = VALIDATORS[shape.kind];
  return validator(data, shape, ctx);
}
