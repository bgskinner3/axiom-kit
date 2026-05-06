// src/validation/errors.ts
import type { TValidationContext } from '../../models/types';
import { serialize, getCallerLocation } from '../../models';
/**
 * Records a validation failure into the current context.
 * Returns false to allow for: return reportError(...)
 */
export function reportError(
  ctx: TValidationContext,
  expected: string | TSolidShape,
  received: unknown,
): false {
  const caller = getCallerLocation({ preferredIndex: 4 });
  ctx.errors.push({
    key: ctx.currentKey || 'unknown',
    path: ctx.path,
    message: `Validation failed at ${ctx.path}`,
    expected: serialize(expected),
    received: serialize(received),
    area: caller,
  });
  return false;
}
