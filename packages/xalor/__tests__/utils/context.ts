import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';
import { TReifyCTX } from '../../transformer/types';

/**
 * 🛠️ CREATE TEST REIFY CTX
 * Generates a clean slate for the Miner's recursive loop during unit tests.
 */
export function createTestReifyCtx(
  overrides: Partial<TReifyCTX> = {},
): TReifyCTX {
  return {
    depth: 0,
    maxDepth: IS_SOLID_CONFIG_ITEMS.reifyLimit.maxDepth,
    fragments: new Map(),
    parentKey: 'test-root',
    seen: new Set(),
    ...overrides,
  };
}
