// __tests__/setup.ts
import { ensureGlobalVault } from '../models/utils/global';

beforeEach(() => {
  const vault = ensureGlobalVault();
  vault.items.clear();
  vault.errors.clear();
});
