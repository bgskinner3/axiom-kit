// transformer/reifiers/registry/core.ts
import type { TReifier } from '../../types';

export const REIFIERS: TReifier[] = [];

export function registerReifier(reifier: TReifier) {
  REIFIERS.push(reifier);
}
