// src/validation/references.ts
import { Registry } from '../vault';
import type { TValidationContext } from '../../models/types';
import { validate } from './index';

export function validateReference(
  data: unknown,
  shape: { name: string },
  ctx: TValidationContext,
): boolean {
  const metadata = Registry.get(shape.name);
  if (!metadata) {
    // Optionally log: `Reference ${shape.name} not found in Vault`
    return false;
  }
  return validate(data, metadata.shape, ctx);
}
