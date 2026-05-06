// src/validation/unions.ts
import type { TValidationContext, TSolidUnionShape } from '../../models/types';
import { validate } from './index';
import { reportError } from './errors';

/**
 * Checks if data satisfies at least one part of the union.
 */
// export function validateUnion(
//   data: unknown,
//   shape: TSolidUnionShape,
//   ctx: TValidationContext,
// ): boolean {
//   return shape.values.some((subShape) => validate(data, subShape, ctx));
// }

export function validateUnion(
  data: unknown,
  shape: TSolidUnionShape,
  ctx: TValidationContext,
): boolean {
  const snapshotCount = ctx.errors.length;

  const isValid = shape.values.some((subShape) => {
    const branchIsValid = validate(data, subShape, ctx);

    if (branchIsValid) {
      ctx.errors.splice(snapshotCount); // Clean up sub-errors
      return true;
    }
    return false;
  });

  if (!isValid) {
    reportError(ctx, shape, data);
  }

  return isValid;
}
