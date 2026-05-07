// src/validation/arrays.ts
import { validate } from './index';
import type { TSolidArrayShape, TValidationContext } from '../models/types';
import { reportError } from './errors';
import { isArray } from '../utils/guards';

// export function validateArray(
//   data: unknown,
//   shape: TSolidArrayShape,
//   ctx: TValidationContext,
// ): boolean {
//   if (!isArray(data)) return reportError(ctx, 'array', data);

//   const originalPath = ctx.path;

//   return data.every((item, index) => {
//     ctx.path = `${originalPath}.${index}`;

//     const isValid = validate(item, shape.items, ctx);

//     ctx.path = originalPath;
//     return isValid;
//   });
// }

export function validateArray(
  data: unknown,
  shape: TSolidArrayShape,
  ctx: TValidationContext,
): boolean {
  if (!isArray(data)) return reportError(ctx, 'array', data);

  const originalPath = ctx.path;

  for (let i = 0; i < data.length; i++) {
    ctx.path = `${originalPath}[${i}]`; // Standard array notation
    if (!validate(data[i], shape.items, ctx)) {
      ctx.path = originalPath;
      return false;
    }
  }

  ctx.path = originalPath;
  return true;
}
