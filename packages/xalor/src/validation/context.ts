// src/validation/context.ts
import type { TValidationContext } from '../models/types';

export function createInitialContext(key?: string): TValidationContext {
  return {
    seen: new Map(),
    path: '$',
    errors: [],
    currentKey: key,
  };
}
