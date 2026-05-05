import { ensureGlobalVault } from '../src/utils/global';

beforeEach(() => {
  const vault = ensureGlobalVault();
  vault.items.clear();
  vault.errors.clear();
});
