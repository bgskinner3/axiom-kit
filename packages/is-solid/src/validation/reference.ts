// src/validation/references.ts
import { Registry } from '../vault';
import type {
  TValidationContext,
  TSolidReferenceShape,
} from '../../models/types';
import { validate } from './index';

export function validateReference(
  data: unknown,
  shape: TSolidReferenceShape, // 💎 Strict type
  ctx: TValidationContext,
): boolean {
  const metadata = Registry.get(shape.name);
  if (!metadata) return false;

  return validate(data, metadata.shape, ctx);
}
