// __tests__/engine/validator.test.ts
import { validateShape } from '../../src/validation/validate-shape';
import { XalethorVaultKeeper } from '../../src/xalor-service/vault-keeper';
import { createInitialContext } from '../../src/validation/context';
import type { TSolidShape } from '../../src/models/types';

/**
 * 🛡️ ENGINE: VALIDATOR ORCHESTRATOR
 *
 * ROLE:
 * Verifies the integrity of the runtime bouncer.
 */
describe('Engine: Validator Orchestrator', () => {
  describe('The Dispatcher (Routing)', () => {
    it('should route primitive shapes to the primitive validator', () => {
      const shape: TSolidShape = { kind: 'primitive', type: 'string' };
      expect(validateShape('hello', shape)).toBe(true);
      expect(validateShape(123, shape)).toBe(false);
    });

    it('should route unknown primitives as a total pass', () => {
      const shape: TSolidShape = { kind: 'primitive', type: 'unknown' };
      expect(validateShape({ any: 'data' }, shape)).toBe(true);
    });

    it('should handle literal equality checks', () => {
      const shape: TSolidShape = { kind: 'literal', value: 'ADMIN' };
      expect(validateShape('ADMIN', shape)).toBe(true);
      expect(validateShape('USER', shape)).toBe(false);
    });
  });

  describe('🛡️ Pillar 2: Recursion Protection (Identity Law)', () => {
    it('should detect circular references and prevent stack overflows', () => {
      // 1. Create circular data
      const data: any = { name: 'Node 1' };
      data.self = data;

      // 2. Create circular shape
      const shape: any = {
        kind: 'object',
        properties: {
          name: {
            name: 'name',
            optional: false,
            shape: { kind: 'primitive', type: 'string' },
          },
          self: { name: 'self', optional: false, shape: null },
        },
      };
      shape.properties.self.shape = shape;

      // Logic: The 'seen' map in ctx must catch the same data/shape pair
      expect(() => validateShape(data, shape)).not.toThrow();
      expect(validateShape(data, shape)).toBe(true);
    });

    it('should distinguish between the same data validated against different shapes', () => {
      const data = { id: 1 };
      const shapeA: TSolidShape = {
        kind: 'object',
        properties: {
          id: {
            name: 'id',
            optional: false,
            shape: { kind: 'primitive', type: 'number' },
          },
        },
      };
      const shapeB: TSolidShape = {
        kind: 'object',
        properties: {
          id: {
            name: 'id',
            optional: false,
            shape: { kind: 'primitive', type: 'string' },
          },
        },
      };

      const ctx = createInitialContext();
      expect(validateShape(data, shapeA, ctx)).toBe(true);
      expect(validateShape(data, shapeB, ctx)).toBe(false);
    });
  });

  describe('⚖️ The Depth Law (Security)', () => {
    it('should stop validation if depth exceeds the security limit (25)', () => {
      const ctx = createInitialContext();
      // Force the depth beyond the law
      ctx.depth = 26;

      const shape: TSolidShape = { kind: 'primitive', type: 'string' };
      expect(validateShape('test', shape, ctx)).toBe(false);
    });
  });

  describe('Integration: Reference Resolution', () => {
    it('should resolve shredded references through the VaultKeeper', () => {
      const mockShape: TSolidShape = { kind: 'primitive', type: 'boolean' };

      // 💎 Use the new VaultKeeper instead of the old Registry
      XalethorVaultKeeper.solidify({
        key: 'IS_VALID',
        shape: mockShape,
        area: 'test.ts:1:1',
        version: '1.0.0',
        filePath: 'test.ts',
        symbolName: 'MockType',
        typeName: 'boolean',
      });

      const refShape: TSolidShape = { kind: 'reference', name: 'IS_VALID' };
      expect(validateShape(true, refShape)).toBe(true);
      expect(validateShape(123, refShape)).toBe(false);
    });
  });
});

describe('EDGE CASES: Validator Orchestrator', () => {
  it('should performantly handle large shared-reference graphs', () => {
    const ctx = createInitialContext();
    const sharedShape: TSolidShape = { kind: 'primitive', type: 'string' };
    const leaf = 'data';
    const data = Array.from({ length: 10000 }, () => leaf);
    const shape: TSolidShape = {
      kind: 'array',
      items: sharedShape,
    };

    const start = performance.now();
    validateShape(data, shape, ctx);
    const end = performance.now();

    // Performance check: should be nearly instant due to 'seen' Map
    expect(end - start).toBeLessThan(50);
  });

  it('should ignore prototype pollution on incoming data', () => {
    const data = Object.create({ kind: 'primitive', type: 'number' });
    const shape: TSolidShape = { kind: 'primitive', type: 'string' };
    expect(validateShape(data, shape)).toBe(false);
  });

  it('should throw a descriptive system error if a shape kind is corrupted', () => {
    const corruptedShape = { kind: 'unsupported-plugin-type' } as any;
    expect(() => validateShape({}, corruptedShape)).toThrow(
      /Unsupported shape kind/,
    );
  });

  it('should prevent path bleeding from failed intersections into sibling properties', () => {
    const ctx = createInitialContext();
    const data = { contact: { email: 123 }, status: 'active' };

    const shape: TSolidShape = {
      kind: 'object',
      properties: {
        contact: {
          name: 'contact',
          optional: false,
          shape: {
            kind: 'intersection',
            parts: [
              {
                kind: 'object',
                properties: {
                  email: {
                    name: 'email',
                    optional: false,
                    shape: { kind: 'primitive', type: 'string' },
                  },
                },
              },
            ],
          },
        },
        status: {
          name: 'status',
          optional: false,
          shape: { kind: 'primitive', type: 'string' },
        },
      },
    };

    validateShape(data, shape, ctx);
    // Verified: Pathing must reset for siblings
    expect(ctx.errors[0].path).toBe('contact.email');
  });

  it('should successfully validate Reactive Proxies (Vue/MobX compatibility)', () => {
    const rawData = { id: 1 };
    const proxyData = new Proxy(rawData, {});
    const shape: TSolidShape = {
      kind: 'object',
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };
    expect(validateShape(proxyData, shape)).toBe(true);
  });
});

// // __tests__/engine/validator.test.ts
// import { validateShape } from '../../src/validation/solidify-shape';
// import { XalethorVaultKeeper } from '../../src/xalor-service/vault-keeper';
// import { createInitialContext } from '../../src/validation/context';
// import type { TSolidShape } from '../../src/models/types';
// /**
//  * BREAK DOWN
//  * --------
//  * WE NEED TO TEST THREE THINGS:
//  * I.   Initialization (Default state)
//  * II.  Error Collection (Pushing to the array)
//  * III. Path Management (Breadcrumb accuracy)
//  */
// describe('Engine: Validator Orchestrator', () => {
//   describe('The Dispatcher (Routing)', () => {
//     it('should route primitive shapes to the primitive validator', () => {
//       const shape = { kind: 'primitive' as const, type: 'string' as const };
//       expect(solidifyShape('hello', shape)).toBe(true);
//       expect(solidifyShape(123, shape)).toBe(false);
//     });

//     it('should route unknown primitives as a total pass', () => {
//       const shape = { kind: 'primitive' as const, type: 'unknown' as const };
//       expect(solidifyShape({ any: 'data' }, shape)).toBe(true);
//     });

//     it('should handle literal equality checks', () => {
//       const shape = { kind: 'literal' as const, value: 'ADMIN' };
//       expect(solidifyShape('ADMIN', shape)).toBe(true);
//       expect(solidifyShape('USER', shape)).toBe(false);
//     });
//   });

//   describe('Pillar 2: Recursion Protection (The "Seen" Set)', () => {
//     it('should detect circular references and prevent stack overflows', () => {
//       // 1. Create circular data
//       const data: any = { name: 'Node 1' };
//       data.self = data;

//       // 2. Create circular shape
//       const shape: any = {
//         kind: 'object',
//         properties: {
//           name: {
//             name: 'name',
//             optional: false,
//             shape: { kind: 'primitive', type: 'string' },
//           },
//           self: { name: 'self', optional: false, shape: null },
//         },
//       };
//       shape.properties.self.shape = shape;

//       expect(() => solidifyShape(data, shape)).not.toThrow();
//       expect(solidifyShape(data, shape)).toBe(true);
//     });

//     it('should handle the same data being validated against different shapes', () => {
//       const data = { id: 1 };
//       const shapeA = {
//         kind: 'object',
//         properties: {
//           id: {
//             name: 'id',
//             optional: false,
//             shape: { kind: 'primitive', type: 'number' },
//           },
//         },
//       };
//       const shapeB = {
//         kind: 'object',
//         properties: {
//           id: {
//             name: 'id',
//             optional: false,
//             shape: { kind: 'primitive', type: 'string' },
//           },
//         },
//       };

//       const ctx = createInitialContext();

//       // Should pass for A, fail for B
//       expect(solidifyShape(data, shapeA as any, ctx)).toBe(true);
//       expect(solidifyShape(data, shapeB as any, ctx)).toBe(false);
//     });
//   });

//   describe('Context Lifecycle', () => {
//     it('should initialize a fresh context if none is provided', () => {
//       const shape = { kind: 'primitive' as const, type: 'number' as const };

//       expect(solidifyShape('not-a-number', shape)).toBe(false);
//     });
//   });

//   describe('Integration: Reference Resolution', () => {
//     it('should resolve references through the Registry (The Vault)', () => {
//       const mockShape = {
//         kind: 'primitive' as const,
//         type: 'boolean' as const,
//       };

//       Registry.register({
//         key: 'IS_VALID',
//         shape: mockShape,
//         area: 'test.ts',
//         version: '1.0.0',
//       });

//       const refShape = { kind: 'reference' as const, name: 'IS_VALID' };

//       expect(solidifyShape(true, refShape)).toBe(true);
//       expect(solidifyShape(123, refShape)).toBe(false);
//     });
//   });
// });

// // ==================================================
// // ==================================================
// // EDGE CASES
// // ==================================================
// // ==================================================
// describe('EDGE CASES: Validator Orchestrator', () => {
//   /**
//    * DEEP GRAPH -- MEMORY LEAK PREVENTION
//    * !!! Tests if the seen map correctly handles a massive graph of
//    * !!! objects that share the same shape. This ensures we don't redundant-check nodes.
//    */
//   it('should performantly handle large shared-reference graphs', () => {
//     const ctx = createInitialContext();
//     const sharedShape = { kind: 'primitive' as const, type: 'string' as const };
//     const leaf = 'data';

//     const data = Array.from({ length: 10000 }, () => leaf);
//     const shape = { kind: 'array' as const, items: sharedShape };

//     const start = performance.now();
//     solidifyShape(data, shape, ctx);
//     const end = performance.now();

//     expect(end - start).toBeLessThan(50);
//   });
//   /**
//    * SEEN TRAP
//    * !!! What if the same object matches Shape A
//    * !!! but is later validated against Shape B? The seen Set must distinguish between shapes.
//    */
//   it('should re-validate the same object if the shape changes (Polymorphic Guard)', () => {
//     const ctx = createInitialContext();
//     const data = { id: 1 };

//     const shapeA = {
//       kind: 'object',
//       properties: {
//         id: {
//           name: 'id',
//           optional: false,
//           shape: { kind: 'primitive', type: 'number' },
//         },
//       },
//     };
//     const shapeB = {
//       kind: 'object',
//       properties: {
//         id: {
//           name: 'id',
//           optional: false,
//           shape: { kind: 'primitive', type: 'string' },
//         },
//       },
//     };

//     expect(solidifyShape(data, shapeA as any, ctx)).toBe(true);

//     expect(solidifyShape(data, shapeB as any, ctx)).toBe(false);
//   });
//   /**
//    * POISONED PROTOTYPE!!!
//    * !!! HANDLE IF an attacker passes an object with a __proto__ that mimics a shape kind?
//    */
//   it('should ignore prototype pollution on incoming data', () => {
//     const data = Object.create({ kind: 'primitive', type: 'number' });
//     const shape = { kind: 'primitive' as const, type: 'string' as const };

//     expect(solidifyShape(data, shape)).toBe(false);
//   });
//   /**
//    * MISSING KIND RECOVERY
//    * !!! What if the Vault returns a corrupted shape or a shape with a kind that doesn't exist in VALIDATORS?
//    */
//   it('should throw a descriptive error if a shape kind is unsupported', () => {
//     const corruptedShape = { kind: 'magic-type' } as any;

//     expect(() => solidifyShape({}, corruptedShape)).toThrow(
//       /Unsupported shape kind/,
//     );
//   });
//   /**
//    * PATH BLEEDING
//    * !!! ensures that if an intersection is a property of a larger object, its internal
//    * !!!  failures don't "stain" the rest of the object's report
//    */
//   it('should prevent path bleeding from failed intersections into sibling properties', () => {
//     const ctx = createInitialContext();
//     const data = {
//       contact: { email: 123 }, // Fail (should be string)
//       status: 'active', // Sibling
//     };

//     const shape = {
//       kind: 'object',
//       properties: {
//         contact: {
//           name: 'contact',
//           optional: false,
//           shape: {
//             kind: 'intersection',
//             parts: [
//               {
//                 kind: 'object',
//                 properties: {
//                   email: {
//                     name: 'email',
//                     optional: false,
//                     shape: { kind: 'primitive', type: 'string' },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//         status: {
//           name: 'status',
//           optional: false,
//           shape: { kind: 'primitive', type: 'string' },
//         },
//       },
//     };

//     solidifyShape(data, shape as any, ctx);

//     expect(ctx.errors[0].path).toBe('$.contact.email');
//   });
//   /**
//    * DEEP PROXY
//    * !!! modern frameworks (Vue, MobX) use Proxies.
//    * !!! We must ensure the seen map and isObject guards don't choke on a Proxy.
//    */
//   it('should successfully validate Reactive Proxies', () => {
//     const rawData = { id: 1 };
//     const proxyData = new Proxy(rawData, {});

//     const shape = {
//       kind: 'object',
//       properties: {
//         id: {
//           name: 'id',
//           optional: false,
//           shape: { kind: 'primitive', type: 'number' },
//         },
//       },
//     };

//     expect(solidifyShape(proxyData, shape as any)).toBe(true);
//   });
// });
