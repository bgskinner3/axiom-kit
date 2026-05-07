import { isXalor } from '../../../../src/operations/core';
import { Registry } from '../../../../src/vault';
import type { TSolidMetadata } from '../../../../models/types';
declare module '../../../../src/' {
  interface ISolidRegistry {
    USER: any;
    PRODUCT: any;
    SETTINGS: any;
    SESSION: any;
  }
}
describe('isXalor Polymorphic Entry Point', () => {
  // 💎 MOCK 1: Standard User
  const userMetadata: TSolidMetadata = {
    key: 'USER',
    area: 'test-file.ts',
    version: '1.0.0',
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

  // 💎 MOCK 2: Simple Product
  const productMetadata: TSolidMetadata = {
    key: 'PRODUCT',
    area: 'test-file.ts',
    version: '1.0.0',
    shape: {
      kind: 'object',
      properties: {
        sku: {
          name: 'sku',
          optional: false,
          shape: { kind: 'primitive', type: 'string' },
        },
        price: {
          name: 'price',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    },
  };

  // 💎 MOCK 3: App Settings
  // const settingsMetadata: TSolidMetadata = {
  //   key: 'SETTINGS',
  //   area: 'test-file.ts',
  //   version: '1.0.0',
  //   shape: {
  //     kind: 'object',
  //     properties: {
  //       theme: {
  //         name: 'theme',
  //         optional: true,
  //         shape: { kind: 'primitive', type: 'string' },
  //       },
  //       retries: {
  //         name: 'retries',
  //         optional: false,
  //         shape: { kind: 'primitive', type: 'number' },
  //       },
  //     },
  //   },
  // };

  // // 💎 MOCK 4: Session Info
  // const sessionMetadata: TSolidMetadata = {
  //   key: 'SESSION',
  //   area: 'test-file.ts',
  //   version: '1.0.0',
  //   shape: {
  //     kind: 'object',
  //     properties: {
  //       token: {
  //         name: 'token',
  //         optional: false,
  //         shape: { kind: 'primitive', type: 'string' },
  //       },
  //     },
  //   },
  // };

  beforeEach(() => {
    const vault = (globalThis as any).__SOLID_VAULT__;
    if (vault) {
      vault.items.clear();
      vault.errors.clear();
    }
  });

  test('🛡️ Hat 1: Registration (Miner Injection)', () => {
    expect(isXalor(undefined, userMetadata)).toBe(true);
    expect(isXalor(undefined, productMetadata)).toBe(true);
    // expect(Registry.has('USER')).toBe(true);
    expect(Registry.has('PRODUCT')).toBe(true);
    isXalor<'USER_NUMBER_TWO', { id: number }>();
    isXalor<'MY_BALLS', { id: number }>();
    console.log(globalThis.__SOLID_VAULT__);
  });

  // test('🔍 Hat 2: Resolution', () => {
  //   isXalor(undefined, settingsMetadata); // Register
  //   const resolved = isXalor<'SETTINGS'>(undefined, 'SETTINGS');
  //   expect(resolved).toEqual(settingsMetadata);
  //   expect(resolved.key).toBe('SETTINGS');
  // });

  // test('✅ Hat 3: Validation (Guard)', () => {
  //   isXalor(undefined, userMetadata); // Register
  //   const validData = { id: 1, name: 'John' };
  //   const invalidData = { id: 'not-a-number', name: 'John' };

  //   expect(isXalor(validData, 'USER')).toBe(true);
  //   expect(isXalor(invalidData, 'USER')).toBe(false);
  // });

  // test('🚀 Hat 3: Validation (Assertion)', () => {
  //   isXalor(undefined, sessionMetadata); // Register
  //   const invalidData = { token: 12345 }; // Should be string

  //   expect(() => {
  //     isXalor(invalidData, true, 'SESSION');
  //   }).toThrow(/\[xalor\] SESSION failed/);
  //   /**
  //        expect(() => {
  //     isXalor< 'SESSION'>(invalidData, true);
  //   }).toThrow(/\[xalor\] SESSION failed/);
  //    */
  // });

  // test('👻 Hat 4: Ghost Call Fallback', () => {
  //   expect(isXalor()).toBe(true);
  //   expect(isXalor(undefined)).toBe(true);
  // });
});
// describe('isXalor Polymorphic Entry Point', () => {
//   const mockMetadata: TSolidMetadata = {
//     key: 'USER',
//     area: 'test-file.ts',
//     version: '1.0.0', // Ensure this matches your IS_SOLID_CONFIG_ITEMS version
//     shape: {
//       kind: 'object',
//       properties: {
//         id: {
//           name: 'id',
//           optional: false,
//           shape: { kind: 'primitive', type: 'number' },
//         },
//         name: {
//           name: 'name',
//           optional: false,
//           shape: { kind: 'primitive', type: 'string' },
//         },
//       },
//     },
//   };

//   beforeEach(() => {
//     // Clear the global vault before each test
//     const vault = (globalThis as any).__SOLID_VAULT__;
//     if (vault) vault.items.clear();
//   });

//   test('🛡️ Hat 1: Registration (Injected by Miner)', () => {
//     // Simulate what the Miner injects at the bottom of a file
//     const result = isXalor(undefined, mockMetadata);

//     expect(result).toBe(true);
//     expect(Registry.has('USER')).toBe(true);
//   });

//   // test('🔍 Hat 2: Resolution', () => {
//   //   isXalor(undefined, mockMetadata); // Register first

//   //   // Simulate isXalor<'USER'>() resolution
//   //   const resolved = isXalor<'USER'>(undefined);

//   //   expect(resolved).toEqual(mockMetadata);
//   //   expect(resolved.key).toBe('USER');
//   // });

//   // test('✅ Hat 3: Validation (Guard)', () => {
//   //   isXalor(undefined, mockMetadata); // Register

//   //   const validData = { id: 1, name: 'John' };
//   //   const invalidData = { id: 'not-a-number', name: 'John' };

//   //   expect(isXalor(validData, 'USER')).toBe(true);
//   //   expect(isXalor(invalidData, 'USER')).toBe(false);
//   // });

//   // test('🚀 Hat 3: Validation (Assertion)', () => {
//   //   isXalor(undefined, mockMetadata);

//   //   const invalidData = { id: 'wrong' };

//   //   // Expect the assertion to throw a detailed error
//   //   expect(() => {
//   //     isXalor(invalidData, true, 'USER');
//   //   }).toThrow(/\[xalor\] USER failed/);
//   // });

//   // test('👻 Hat 4: Ghost Call Fallback', () => {
//   //   // Simulate isXalor<"KEY", Type>() without injection yet
//   //   expect(isXalor()).toBe(true);
//   // });
// });
