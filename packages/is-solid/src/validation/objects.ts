// src/validation/objects.ts
import type { TValidationContext, TSolidObjectRawShape } from '../../models';
import { isObject, isNull, isRecord, ObjectUtils } from '../../models';
import { validate } from './index';
import { reportError } from './errors';
export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidObjectRawShape> },
  ctx: TValidationContext,
): boolean {
  if (!isObject(data) || isNull(data) || !isRecord(data)) {
    return reportError(ctx, 'object', data);
  }

  const originalPath = ctx.path; // 💎 Save the breadcrumb position

  for (const [key, metadata] of ObjectUtils.entries(shape.properties)) {
    const value = data[key];

    // 1. Update the path for this property
    ctx.path = `${originalPath}.${key}`;

    // 2. Handle Optionality
    if (value === undefined && metadata.optional) {
      ctx.path = originalPath; // Reset before next property
      continue;
    }

    // 3. Handle Missing Required Keys
    if (value === undefined && !metadata.optional) {
      const result = reportError(ctx, metadata.shape, 'missing');
      ctx.path = originalPath; // Reset before returning
      return result;
    }

    // 4. Recurse
    if (!validate(value, metadata.shape, ctx)) {
      ctx.path = originalPath; // Reset before returning
      return false;
    }

    // 5. Cleanup for next sibling in the loop
    ctx.path = originalPath;
  }

  return true;
}
// export function validateObject(
//   data: unknown,
//   shape: { properties: Record<string, TSolidObjectRawShape> },
//   ctx: TValidationContext,
// ): boolean {
//   if (!isObject(data) || isNull(data) || !isRecord(data)) {
//     return reportError(ctx, 'object', data);
//   }
//   const originalPath = ctx.path;
//   for (const [key, metadata] of ObjectUtils.entries(shape.properties)) {
//     const value = data[key];

//     if (value === undefined && metadata.optional) continue;

//     // Handle missing required keys
//     if (value === undefined && !metadata.optional) {
//       const subCtx = {
//         ...ctx,
//         path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
//       };
//       return reportError(subCtx, metadata.shape, 'missing');
//     }

//     const subCtx = {
//       ...ctx,
//       path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
//     };
//     // note: validate() internally calls reportError for primitives
//     if (!validate(value, metadata.shape, subCtx)) return false;
//   }
//   return true;
// }
