// src/validation/context.ts
import type { TValidationContext } from '../models/types';

export function createInitialContext(): TValidationContext {
  return {
    seen: new Map(),
    path: '$',
    errors: [],
  };
}
