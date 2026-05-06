import { isXalor } from '../../../../src/operations/core';
import { Registry } from '../../../../src/vault';
import type { TSolidMetadata } from '../../../../models/types';

describe('isXalor Polymorphic Entry Point', () => {
  const mockMetadata: TSolidMetadata = {
    key: 'USER',
    area: 'test-file.ts',
    version: '1.0.0', // Ensure this matches your IS_SOLID_CONFIG_ITEMS version
    shape: {
      kind: 'object',
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
        name: {
          name: 'name',
          optional: false,
          shape: { kind: 'primitive', type: 'string' },
        },
      },
    },
  };

  beforeEach(() => {
    // Clear the global vault before each test
    const vault = (globalThis as any).__SOLID_VAULT__;
    if (vault) vault.items.clear();
  });

  test('🛡️ Hat 1: Registration (Injected by Miner)', () => {
    // Simulate what the Miner injects at the bottom of a file
    const result = isXalor(undefined, mockMetadata);

    expect(result).toBe(true);
    expect(Registry.has('USER')).toBe(true);
  });

  // test('🔍 Hat 2: Resolution', () => {
  //   isXalor(undefined, mockMetadata); // Register first

  //   // Simulate isXalor<'USER'>() resolution
  //   const resolved = isXalor<'USER'>(undefined);

  //   expect(resolved).toEqual(mockMetadata);
  //   expect(resolved.key).toBe('USER');
  // });

  // test('✅ Hat 3: Validation (Guard)', () => {
  //   isXalor(undefined, mockMetadata); // Register

  //   const validData = { id: 1, name: 'John' };
  //   const invalidData = { id: 'not-a-number', name: 'John' };

  //   expect(isXalor(validData, 'USER')).toBe(true);
  //   expect(isXalor(invalidData, 'USER')).toBe(false);
  // });

  // test('🚀 Hat 3: Validation (Assertion)', () => {
  //   isXalor(undefined, mockMetadata);

  //   const invalidData = { id: 'wrong' };

  //   // Expect the assertion to throw a detailed error
  //   expect(() => {
  //     isXalor(invalidData, true, 'USER');
  //   }).toThrow(/\[xalor\] USER failed/);
  // });

  // test('👻 Hat 4: Ghost Call Fallback', () => {
  //   // Simulate isXalor<"KEY", Type>() without injection yet
  //   expect(isXalor()).toBe(true);
  // });
});
