// src/validation/objects.ts
import type { TValidationContext, TSolidObjectRawShape } from '../../models';
import { isObject, isNull, isRecord, ObjectUtils } from '../../models';
import { validate } from './index';
import { reportError } from './errors';

// TODO: CLEAN UP
export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidObjectRawShape> },
  ctx: TValidationContext,
): boolean {
  if (!isObject(data) || isNull(data) || !isRecord(data)) {
    return reportError(ctx, 'object', data);
  }

  const originalPath = ctx.path;

  for (const [key, metadata] of ObjectUtils.entries(shape.properties)) {
    const value = data[key];

    // Update the path for this property
    ctx.path = `${originalPath}.${key}`;

    // Handle Optionality
    if (value === undefined && metadata.optional) {
      ctx.path = originalPath; // Reset before next property
      continue;
    }

    // Handle Missing Required Keys
    if (value === undefined && !metadata.optional) {
      const result = reportError(ctx, metadata.shape, 'missing');
      ctx.path = originalPath; // Reset before returning
      return result;
    }

    // Recurse
    if (!validate(value, metadata.shape, ctx)) {
      ctx.path = originalPath; // Reset before returning
      return false;
    }

    // Cleanup for next sibling in the loop
    ctx.path = originalPath;
  }

  return true;
}
