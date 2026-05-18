import type { TSolidShape } from '../../shared';

export const UTIL_CONFIG_OPTIONS = {
  fileName: 'test.ts',
  // mineTransformation
  programLib: 'lib.esnext.d.ts',
  // reifyType
  solidType: 'type TSolid<K extends string, T> = T & { readonly __brand: K };',
} as const;

/**
 * 🧱 TEST_SHAPE_REGISTRY
 *
 * ROLE:
 * Centralizes deep structural blueprints for compiler-free runtime testing.
 * Provides O(1) immutable shape profiles spanning primitives, objects, arrays, and unions.
 */
export const TEST_SHAPE_REGISTRY = {
  /**
   * 👤 TYPE 1: THE STANDARD PROFILE (The Structured Flat-Object Zone)
   * Target Interface Shape: { id: number; username: string; active: boolean }
   */
  STANDARD_USER: {
    kind: 'object',
    properties: {
      id: {
        name: 'id', // 🎯 FIX: Satisfies the strict name contract requirements
        optional: false,
        shape: { kind: 'primitive', type: 'number' },
      },
      username: {
        name: 'username', // 🎯 FIX: Satisfies the strict name contract requirements
        optional: false,
        shape: { kind: 'primitive', type: 'string' },
      },
      active: {
        name: 'active', // 🎯 FIX: Satisfies the strict name contract requirements
        optional: false,
        shape: { kind: 'primitive', type: 'boolean' },
      },
    },
  },

  /**
   * 📦 TYPE 2: THE DEEP NESTED MATRIX (The Complex Composite Graph)
   * Target Interface Shape: { orderId: string; items: { SKU: string; quantity: number }[] }
   */
  COMPLEX_ORDER: {
    kind: 'object',
    properties: {
      orderId: {
        name: 'orderId',
        optional: false,
        shape: { kind: 'primitive', type: 'string' },
      },
      items: {
        name: 'items',
        optional: false,
        shape: {
          kind: 'array',
          items: {
            kind: 'object',
            properties: {
              SKU: {
                name: 'SKU',
                optional: false,
                shape: { kind: 'primitive', type: 'string' },
              },
              quantity: {
                name: 'quantity',
                optional: false,
                shape: { kind: 'primitive', type: 'number' },
              },
            },
          },
        },
      },
    },
  },

  /**
   * 🚀 TYPE 3: THE VOLATILE VARIANT (The Multi-Branch Logical Combinator)
   * Target Interface Shape: { status: 'success' | 'failed' | number }
   */
  UNION_RESPONSE: {
    kind: 'object',
    properties: {
      status: {
        name: 'status',
        optional: false,
        shape: {
          kind: 'union',
          values: [
            { kind: 'literal', value: 'success' },
            { kind: 'literal', value: 'failed' },
            { kind: 'primitive', type: 'number' },
          ],
        },
      },
    },
  },
} as const satisfies Record<string, TSolidShape>;
