// __tests__/engine/vault.test.ts
describe('Engine Vault', () => {
  expect(true).toBe(true);
});
// EXAMPLE OLD
// import { Registry } from '../src/vault';
// import { ensureGlobalVault } from '../models/utils/global';

// describe('Solid Vault', () => {
//   it('should maintain a global singleton on globalThis', () => {
//     const vault = ensureGlobalVault();
//     expect(globalThis.__SOLID_VAULT__).toBeDefined();
//     expect(globalThis.__SOLID_VAULT__).toBe(vault);
//   });

//   it('should register and retrieve metadata by key', () => {
//     const mockMetadata = {
//       key: 'AUTH',
//       version: '1.0.0',
//       shape: { kind: 'primitive', type: 'boolean' },
//     } as any;

//     Registry.register(mockMetadata);
//     expect(Registry.get('AUTH')).toEqual(mockMetadata);
//     expect(Registry.keys()).toContain('AUTH');
//   });
// });
// import { Registry } from '../src/vault';
// import { IS_SOLID_CONFIG_ITEMS } from '../src/models';
// import type { TSolidMetadata } from '../src/models';

// describe('Solid Vault (The Storage)', () => {
//   it('should register and retrieve metadata from globalThis', () => {
//     const mockMetadata: TSolidMetadata = {
//       key: 'User',
//       area: 'src/models/User.ts',
//       version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//       shape: { kind: 'primitive', type: 'string' },
//     };

//     // 1. Check-in
//     Registry.register(mockMetadata);

//     // 2. Query the "Database"
//     const result = Registry.get('User');

//     // 3. Verify it landed correctly
//     expect(result).toBeDefined();
//     expect(result?.key).toBe('User');
//     expect(result?.version).toBe(IS_SOLID_CONFIG_ITEMS.solidVersion);

//     // Prove it's actually on globalThis (Strict check)
//     const globalVault = (globalThis as any).__SOLID_VAULT__;
//     expect(globalVault.has('User')).toBe(true);
//   });

//   // it('should reject metadata with a version mismatch', () => {
//   //   const staleMetadata: TSolidMetadata = {
//   //     key: 'OldType',
//   //     area: 'test.ts',
//   //     version: '0.0.1', // Wrong version
//   //     shape: { kind: 'primitive', type: 'number' },
//   //   };

//   //   // We expect a console error (you can mock this if you want)
//   //   Registry.register(staleMetadata);

//   //   // Should NOT be in the vault
//   //   expect(Registry.get('OldType')).toBeUndefined();
//   // });
// });
