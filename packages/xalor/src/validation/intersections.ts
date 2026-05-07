// src/validation/intersections.ts
import type {
  TValidationContext,
  TSolidIntersectionShape,
  TSolidShape,
} from '../models/types';
import { validate } from './index';
import { yieldFiltered } from '../utils';

export function validateIntersection(
  data: unknown,
  shape: TSolidIntersectionShape,
  ctx: TValidationContext,
): boolean {
  // Use yieldFiltered to only grab valid shapes from the intersection
  const parts = yieldFiltered(
    shape.parts,
    (_part): _part is TSolidShape => true,
  );

  for (const part of parts) {
    // If one part fails, we stop immediately (Short-circuit)
    if (!validate(data, part, ctx)) {
      return false;
    }
  }

  return true;
}
/**
 export function validateIntersection(
  data: unknown,
  shape: TSolidIntersectionShape,
  ctx: TValidationContext,
): boolean {
  // Use yieldFiltered to only grab valid shapes from the intersection
  const parts = yieldFiltered(shape.parts, (part): part is TSolidShape => true);

  for (const part of parts) {
    // If one part fails, we stop immediately (Short-circuit)
    if (!validate(data, part, ctx)) {
      return false; 
    }
  }

  return true;
}
 */
