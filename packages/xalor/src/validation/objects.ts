// src/validation/objects.ts
import type { TValidationContext, TSolidObjectRawShape } from '../models/types';
import { isObject, isNull, isRecord, yieldEntries } from '../utils';
import { validate } from './index';
import { reportError } from './errors';
export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidObjectRawShape> },
  ctx: TValidationContext,
): boolean {
  /* prettier-ignore */ if (!isObject(data) || isNull(data) || !isRecord(data))  return reportError(ctx, 'object', data);

  const originalPath = ctx.path;
  // yieldEntries for O(1)
  const propertyEntries = yieldEntries(
    shape.properties,
    (_key): _key is string => true,
  );

  for (const [key, metadata] of propertyEntries) {
    const value = data[key];
    ctx.path = originalPath === '$' ? key : `${originalPath}.${key}`;

    if (value === undefined) {
      if (metadata.optional) continue;
      const result = reportError(ctx, metadata.shape, 'missing');
      ctx.path = originalPath;
      return result;
    }

    // 2. Recurse
    if (!validate(value, metadata.shape, ctx)) {
      ctx.path = originalPath;
      return false;
    }
  }

  ctx.path = originalPath; // Restore for parent
  return true;
}

// TODO: CLEAN UP
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

//     // Update the path for this property
//     ctx.path = `${originalPath}.${key}`;

//     // Handle Optionality
//     if (value === undefined && metadata.optional) {
//       ctx.path = originalPath; // Reset before next property
//       continue;
//     }

//     // Handle Missing Required Keys
//     if (value === undefined && !metadata.optional) {
//       const result = reportError(ctx, metadata.shape, 'missing');
//       ctx.path = originalPath; // Reset before returning
//       return result;
//     }

//     // Recurse
//     if (!validate(value, metadata.shape, ctx)) {
//       ctx.path = originalPath; // Reset before returning
//       return false;
//     }

//     // Cleanup for next sibling in the loop
//     ctx.path = originalPath;
//   }

//   return true;
// }
