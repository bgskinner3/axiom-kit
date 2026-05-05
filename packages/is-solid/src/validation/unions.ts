// src/validation/unions.ts
import type { TValidationContext, TSolidShape } from '../../models/types';
import { validate } from './index';

/**
 * Checks if data satisfies at least one part of the union.
 */
export function validateUnion(
  data: unknown,
  shape: { values: TSolidShape[] },
  ctx: TValidationContext,
): boolean {
  return shape.values.some((subShape) => validate(data, subShape, ctx));
}
