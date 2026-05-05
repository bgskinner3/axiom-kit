// src/validation/objects.ts
import type { TValidationContext, TSolidObjectShape } from '../../models';
import { isObject, isNull, isRecord, ObjectUtils } from '../utils';
import { validate } from './index';

export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidObjectShape> },
  ctx: TValidationContext,
): boolean {
  if (!isObject(data) || isNull(data) || !isRecord(data)) return false;
  const entries = ObjectUtils.entries(shape.properties);

  for (const [key, metadata] of entries) {
    const value = data[key];

    // 2. Handle Optionality (Pillar 3)
    // If the key is missing but marked optional, skip to the next property
    if (value === undefined && metadata.optional) {
      continue;
    }

    // 3. Prepare recursive context
    const subCtx: TValidationContext = {
      ...ctx,
      path: ctx.path ? `${ctx.path}.${key}` : key,
    };

    // 4. Validate the value against the nested shape
    if (!validate(value, metadata.shape, subCtx)) {
      return false;
    }
  }

  return true;
}
