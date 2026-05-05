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
    return reportError(ctx, 'object', data); // ✨ Add this
  }

  for (const [key, metadata] of ObjectUtils.entries(shape.properties)) {
    const value = data[key];

    if (value === undefined && metadata.optional) continue;

    // Handle missing required keys
    if (value === undefined && !metadata.optional) {
      const subCtx = {
        ...ctx,
        path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
      };
      return reportError(subCtx, metadata.shape, 'missing'); // ✨ Add this
    }

    const subCtx = {
      ...ctx,
      path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
    };
    // note: validate() internally calls reportError for primitives
    if (!validate(value, metadata.shape, subCtx)) return false;
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

//   for (const [key, meta] of ObjectUtils.entries(shape.properties)) {
//     const value = data[key];

//     if (value === undefined && meta.optional) continue;

//     if (value === undefined && !meta.optional) {
//       const subCtx = {
//         ...ctx,
//         path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
//       };
//       return reportError(subCtx, meta.shape, 'missing');
//     }

//     const subCtx: TValidationContext = {
//       ...ctx,
//       path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
//     };

//     if (!validate(value, meta.shape, subCtx)) return false;
//   }
//   return true;
// }
