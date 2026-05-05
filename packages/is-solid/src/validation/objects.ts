// src/validation/objects.ts
import type { TValidationContext, TSolidShape } from '../../models';
import { isObject, isNull, isRecord, ObjectUtils } from '../utils';
import { validate } from './index';

export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidShape> },
  ctx: TValidationContext,
): boolean {
  if (!isObject(data) || isNull(data) || !isRecord(data)) return false;

  for (const [key, propShape] of ObjectUtils.entries(shape.properties)) {
    const value = data[key];

    const subCtx: TValidationContext = {
      ...ctx,
      path: `${ctx.path}.${key}`,
    };

    if (!validate(value, propShape, subCtx)) return false;
  }

  return true;
}
