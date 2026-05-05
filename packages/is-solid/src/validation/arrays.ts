// src/validation/arrays.ts
import { validate } from './index';
import type { TSolidArrayShape, TValidationContext } from '../../models/types';
import { reportError } from './errors';
import { isArray } from '../utils/guards';

export function validateArray(
  data: unknown,
  shape: TSolidArrayShape,
  ctx: TValidationContext,
): boolean {
  if (!isArray(data)) return reportError(ctx, 'array', data);

  const originalPath = ctx.path;

  // Use .every to stop at the first failure, or .forEach to collect all errors
  return data.every((item, index) => {
    // ✨ Update path: $.items -> $.items.0
    ctx.path = `${originalPath}.${index}`;

    const isValid = validate(item, shape.items, ctx);

    // Reset path for the next sibling
    ctx.path = originalPath;
    return isValid;
  });
}
