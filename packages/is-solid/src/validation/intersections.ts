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
  // 💎 Refinement: Stop at the first part that fails to avoid
  // duplicate error messages for the same path.
  return shape.parts.every((part) => {
    const isValid = validate(data, part, ctx);
    return isValid;
  });
}
// TODO DELTE
// export function validateIntersection(
//   data: unknown,
//   shape: TSolidIntersectionShape,
//   ctx: TValidationContext,
// ): boolean {
//   return shape.parts.every((part) => validate(data, part, ctx));
// }
