// src/validation/unions.ts
import type { TValidationContext, TSolidUnionShape } from '../../models/types';
import { validate } from './index';

/**
 * Checks if data satisfies at least one part of the union.
 */
export function validateUnion(
  data: unknown,
  shape: TSolidUnionShape,
  ctx: TValidationContext,
): boolean {
  return shape.values.some((subShape) => validate(data, subShape, ctx));
}
