// transformer/reifiers/registry/core.ts
import type { TReifier } from '../../../models/types';

export const REIFIERS: TReifier[] = [];

export function registerReifier(reifier: TReifier) {
  REIFIERS.push(reifier);
}
