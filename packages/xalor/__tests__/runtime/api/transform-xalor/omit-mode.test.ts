// __tests__/runtime/api/transform-xalor.test.ts
import { transformXalor } from '../../../../src/operations';
import { TEST_SHAPE_REGISTRY } from '../../../utils/constants';
import { seedTestVault, logEngineTrace } from '../../../utils';

const TEST_LOGS = {
  OMIT_MODE_TEST_ONE: false,
  OMIT_MODE_TEST_TWO: false,
  OMIT_MODE_TEST_THREE: false,
  OMIT_MODE_TEST_FOUR: false,
  OMIT_MODE_TEST_FIVE: true,
} as const;

/**
 pnpm run test -- __tests__/runtime/api/transform-xalor/omit-mode.test.ts
 */
declare module '../../../../src/models/types' {
  interface ISolidRegistry {
    USER_TEST: {
      id: number;
      username: string;
      active: boolean;
    };
    API_RESPONSE: {
      status: 'success' | 'failed' | number;
    };
    STORE_ORDER: {
      orderId: string;
      items: {
        SKU: string;
        quantity: number;
      }[];
    };
    DEEPLY_NESTED_STORE: {
      orderId: string;
      items: {
        SKU: string;
        quantity: number;
        logistics: {
          warehouseCode: string;
          dimensions: {
            weight: number;
            fragile: boolean;
          };
        };
      }[];
    };
  }
}
// pick, omit, rename, merge, flatten
describe('Runtime Generator API', () => {
  beforeAll(() => {
    // Seed your mock blueprint registry definitions flatly straight into RAM memory
    /* prettier-ignore */ seedTestVault('USER_TEST', TEST_SHAPE_REGISTRY.STANDARD_USER);
    /* prettier-ignore */ seedTestVault('API_RESPONSE', TEST_SHAPE_REGISTRY.UNION_RESPONSE);
    /* prettier-ignore */ seedTestVault('STORE_ORDER', TEST_SHAPE_REGISTRY.COMPLEX_ORDER);
    /* prettier-ignore */ seedTestVault('DEEPLY_NESTED_STORE', TEST_SHAPE_REGISTRY.DEEPLY_NESTED_STORE);
  });

  //============================================================================================
  //============================================================================================
  // TRANSFORM XALOR API OMIT MODE
  //============================================================================================
  //============================================================================================
  describe('Transform XALOR OMIT MODE', () => {
    it('🛡️ should successfully drop targeted fields from a flat object payload while retaining unlisted properties', () => {
      const mockUser = {
        id: 42,
        username: 'XalethorPrune',
        active: true,
      };

      const result = transformXalor<'USER_TEST', 'omit'>({
        data: mockUser,
        keys: ['active'],
      });

      logEngineTrace({
        enabled: TEST_LOGS.OMIT_MODE_TEST_ONE,
        mode: 'omit',
        operation: 'Flat Structural Property Exclusion',
        target: 'USER_TEST',
        behavior:
          'Pruning exclusively specified "active" field while leaving other layout nodes intact.',
        output: result,
      });

      expect(result).toEqual({
        id: 42,
        username: 'XalethorPrune',
      });
      expect(Object.prototype.hasOwnProperty.call(result, 'active')).toBe(
        false,
      );
    });

    it('🛡️ should handle an empty omit keys collection safely as an absolute pass-through copy schema walk', () => {
      const mockUser = { id: 77, username: 'UnchangedEntity', active: true };

      const result = transformXalor<'USER_TEST', 'omit'>({
        data: mockUser,
        keys: [],
      });

      logEngineTrace({
        enabled: TEST_LOGS.OMIT_MODE_TEST_TWO,
        mode: 'omit',
        operation: 'Empty Exclusion Constraint Evaluation',
        target: 'USER_TEST',
        behavior:
          'Safely copying all blueprint properties intact when zero keys are explicitly targeted for pruning.',
        output: result,
      });

      expect(result).toEqual({
        id: 77,
        username: 'UnchangedEntity',
        active: true,
      });
    });

    it('🛡️ should filter properties out across logical polymorphic variant branches smoothly', () => {
      const mockSuccessResponse = { status: 'success', trackingId: 'TX-100' };
      const mockFailedResponse = { status: 'failed', trackingId: 'TX-200' };

      const resultSuccess = transformXalor<'API_RESPONSE', 'omit'>({
        data: mockSuccessResponse,
        keys: ['status'],
      });

      const resultFailed = transformXalor<'API_RESPONSE', 'omit'>({
        data: mockFailedResponse,
        keys: ['status'],
      });

      logEngineTrace({
        enabled: TEST_LOGS.OMIT_MODE_TEST_THREE,
        mode: 'omit',
        operation: 'Polymorphic Union Branch Exclusion Pruning',
        target: 'API_RESPONSE',
        behavior:
          'Matching union literal routes and selectively scrubbing structural tokens.',
        output: { resultSuccess, resultFailed },
      });

      // Since status is discarded, outputs become structurally stripped objects
      expect(
        Object.prototype.hasOwnProperty.call(resultSuccess, 'status'),
      ).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(resultFailed, 'status')).toBe(
        false,
      );
    });

    it('🛡️ should drop an entire nested child collection array cleanly when specified at the root layer', () => {
      const mockOrder = {
        orderId: 'ORD-555',
        items: [
          { SKU: 'MOCK-A', quantity: 1 },
          { SKU: 'MOCK-B', quantity: 10 },
        ],
      };

      const result = transformXalor<'STORE_ORDER', 'omit'>({
        data: mockOrder,
        keys: ['items'],
      });

      logEngineTrace({
        enabled: TEST_LOGS.OMIT_MODE_TEST_FOUR,
        mode: 'omit',
        operation: 'Root Node Compound Field Exclusion',
        target: 'STORE_ORDER',
        behavior:
          'Pruning away the entire nested "items" collection completely from the output graph payload.',
        output: result,
      });

      expect(result).toEqual({
        orderId: 'ORD-555',
      });
      expect(Object.prototype.hasOwnProperty.call(result, 'items')).toBe(false);
    });

    it('🛡️ should recursively slide down multiple matrix tiers to prune fine-grained properties deep inside compound paths', () => {
      const mockComplexStore = {
        orderId: 'ORD-DEEP-9',
        items: [
          {
            SKU: 'NEXUS-7',
            quantity: 2,
            logistics: {
              warehouseCode: 'ZONE-NORTH',
              dimensions: { weight: 88.4, fragile: true },
            },
          },
          {
            SKU: 'NEXUS-8',
            quantity: 5,
            logistics: {
              warehouseCode: 'ZONE-SOUTH',
              dimensions: { weight: 12.1, fragile: false },
            },
          },
        ],
      };

      // ✔️ ADVANCED FEATURE ASSERTER: Deep Omit!
      // Here we keep everything, but explicitly prune ONLY the 'fragile' flag 3 layers deep!
      const result = transformXalor<'DEEPLY_NESTED_STORE', 'omit'>({
        data: mockComplexStore,
        keys: ['items.logistics.dimensions.fragile'],
      });

      logEngineTrace({
        enabled: TEST_LOGS.OMIT_MODE_TEST_FIVE,
        mode: 'omit',
        operation: 'Multi-Layer Compound Path Exclusion Pass',
        target: 'DEEPLY_NESTED_STORE',
        behavior:
          'Symmetrically traversing down structural collections to prune deep primitive options.',
        output: result,
      });

      expect(result).toEqual({
        orderId: 'ORD-DEEP-9',
        items: [
          {
            SKU: 'NEXUS-7',
            quantity: 2,
            logistics: {
              warehouseCode: 'ZONE-NORTH',
              dimensions: { weight: 88.4 }, // 💎 fragile is successfully erased!
            },
          },
          {
            SKU: 'NEXUS-8',
            quantity: 5,
            logistics: {
              warehouseCode: 'ZONE-SOUTH',
              dimensions: { weight: 12.1 }, // 💎 fragile is successfully erased!
            },
          },
        ],
      });

      // Confirm deep-nested child properties checks validate flawlessly
      expect(
        Object.prototype.hasOwnProperty.call(
          result.items[0].logistics.dimensions,
          'fragile',
        ),
      ).toBe(false);
      expect(
        Object.prototype.hasOwnProperty.call(
          result.items[1].logistics.dimensions,
          'fragile',
        ),
      ).toBe(false);

      // Symmetrically ensure siblings (like weight) are fully preserved intact!
      expect(
        Object.prototype.hasOwnProperty.call(
          result.items[0].logistics.dimensions,
          'weight',
        ),
      ).toBe(true);
    });
  });

  // //============================================================================================
  // //============================================================================================
  // // TRANSFORM XALOR API RENAME MODE
  // //============================================================================================
  // //============================================================================================
  // describe('Transform XALOR RENAME MODE', () => {});

  // //============================================================================================
  // //============================================================================================
  // // TRANSFORM XALOR API MERGE MODE
  // //============================================================================================
  // //============================================================================================
  // describe('Transform XALOR MERGE MODE', () => {});

  //   //============================================================================================
  //   //============================================================================================
  //   // TRANSFORM XALOR API FLATTEN MODE
  //   //============================================================================================
  //   //============================================================================================
  //   describe('Transform XALOR FLATTEN MODE', () => {});
});
