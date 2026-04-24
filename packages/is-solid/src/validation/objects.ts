import type { TSolidShape } from '../../transformer/types';
import type { TValidationContext } from '../models';
import { validate } from './index';

export function validateObject(
  data: unknown,
  shape: { properties: Record<string, TSolidShape> },
  ctx: TValidationContext,
): boolean {
  // 1. Basic Type Check
  if (typeof data !== 'object' || data === null) return false;

  // 2. Structural Crawl
  // Use a strictly typed record from the unknown data
  const dataObj = data as Record<string, unknown>;

  for (const [key, propShape] of Object.entries(shape.properties)) {
    const value = dataObj[key];

    // Update path for potential error reporting
    const subCtx: TValidationContext = {
      ...ctx,
      path: `${ctx.path}.${key}`,
    };

    if (!validate(value, propShape, subCtx)) {
      return false;
    }
  }

  return true;
}
