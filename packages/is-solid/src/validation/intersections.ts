// src/validation/intersections.ts
import type {
  TValidationContext,
  TSolidIntersectionShape,
} from '../../models/types';
import { validate } from './index';

export function validateIntersection(
  data: unknown,
  shape: TSolidIntersectionShape,
  ctx: TValidationContext,
): boolean {
  return shape.parts.every((part) => validate(data, part, ctx));
}
