// src/validation/objects.ts
import type { TValidationContext, TSolidObjectRawShape } from '../../models';
import { isObject, isNull, isRecord, ObjectUtils } from '../utils';
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

  for (const [key, meta] of ObjectUtils.entries(shape.properties)) {
    const value = data[key];

    if (value === undefined && meta.optional) continue;

    if (value === undefined && !meta.optional) {
      const subCtx = {
        ...ctx,
        path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
      };
      return reportError(subCtx, meta.shape, 'missing');
    }

    const subCtx: TValidationContext = {
      ...ctx,
      path: ctx.path === '$' ? key : `${ctx.path}.${key}`,
    };

    if (!validate(value, meta.shape, subCtx)) return false;
  }
  return true;
}
