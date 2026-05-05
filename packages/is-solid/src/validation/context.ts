import type { TValidationContext } from '../../models';

export function createInitialContext(): TValidationContext {
  return {
    seen: new Map(),
    path: '$',
  };
}
