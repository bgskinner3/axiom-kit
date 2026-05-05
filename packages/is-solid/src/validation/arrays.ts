// src/validation/arrays.ts
import { validate } from './index';
import type { TSolidArrayShape, TValidationContext } from '../../models/types';
import { reportError } from './errors';
import { isArray } from '../../models/guards';

export function validateArray(
  data: unknown,
  shape: TSolidArrayShape,
  ctx: TValidationContext,
): boolean {
  if (!isArray(data)) return reportError(ctx, 'array', data);

  const originalPath = ctx.path;

  return data.every((item, index) => {
    ctx.path = `${originalPath}.${index}`;

    const isValid = validate(item, shape.items, ctx);

    ctx.path = originalPath;
    return isValid;
  });
}
