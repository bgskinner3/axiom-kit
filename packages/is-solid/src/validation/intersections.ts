// src/validation/intersections.ts
import type { TValidationContext, TSolidShape } from '../../models/types';
import { validate } from './index';
export function validateIntersection(
  data: unknown,
  shape: { parts: TSolidShape[] },
  ctx: TValidationContext,
): boolean {
  return shape.parts.every((part) => validate(data, part, ctx));
}
