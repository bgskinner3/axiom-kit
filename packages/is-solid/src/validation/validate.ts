import type { TSolidShape } from '../../transformer/types';
import type {
  TValidationContext,
  TValidatorFn,
  TValidatorMapper,
} from '../../models';
import { createInitialContext } from './context';
import { validateObject } from './objects';
import { validateUnion } from './unions';
import { isObject, isNull, isPrimitive, isArray } from '../utils';
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
/**
 const VALIDATORS: { [K in TSolidShape['kind']]: TValidatorFn } = {
  primitive: (data, shape) => {
    // Narrowing shape to the 'primitive' variant
    if (shape.kind !== 'primitive') return false; 
    if (shape.type === 'unknown') return true;
    return typeof data === shape.type;
  },
  literal: (data, shape) => {
    if (shape.kind !== 'literal') return false;
    return data === shape.value;
  },
  union: (data, shape, ctx) => {
    if (shape.kind !== 'union') return false;
    return validateUnion(data, shape, ctx);
  },
  object: (data, shape, ctx) => {
    if (shape.kind !== 'object') return false;
    return validateObject(data, shape, ctx);
  },
  branded: (data, shape, ctx) => {
    if (shape.kind !== 'branded') return false;
    return validate(data, shape.base, ctx);
  },
  array: (data, shape, ctx) => {
    if (shape.kind !== 'array') return false;
    return Array.isArray(data) && data.every(item => validate(item, shape.items, ctx));
  },
  intersection: (data, shape, ctx) => {
    if (shape.kind !== 'intersection') return false;
    return shape.parts.every(part => validate(data, part, ctx));
  },
  reference: (data, shape, ctx) => {
    if (shape.kind !== 'reference') return false;
    // Logic for looking up the 'name' in your TSolidVaultMap would go here
    return true; 
  },
};
 */
// Define the registry using the kinds from TSolidShape
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
    return shape.parts.every((part) => validate(data, part, ctx));
  },
  // reference: (_data, shape, _ctx) => isValidatorKind(shape, 'reference') ? '',
  reference: (_data, shape, _ctx) => {
    if (!isReferenceShape(shape)) return false;
    return true;
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
  // 2. Route by Shape Kind
  // TODO: REMOVE SWITCH
  // switch (shape.kind) {
  //   case 'primitive':
  //     // return typeof data === shape.type;
  //     return isPrimitive(data);

  //   case 'literal':
  //     return data === shape.value;

  //   case 'union':
  //     return validateUnion(data, shape, ctx);

  //   case 'object':
  //     return validateObject(data, shape, ctx);

  //   case 'branded':
  //     // Validate the base (e.g., string) first
  //     return validate(data, shape.base, ctx);

  //   case 'reference':
  //     // Lookups for named recursion would go here
  //     return true;

  //   default:
  //     return false;
  // }
}
