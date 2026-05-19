// __tests__/runtime/api/transform-xalor/flatten-mode.test.ts
// import { transformXalor } from '../../../../src/operations';
import { TEST_SHAPE_REGISTRY } from '../../../utils/constants';
import { seedTestVault } from '../../../utils';
// //logEngineTrace
// const TEST_LOGS = {
//   OMIT_MODE_TEST_ONE: false,
//   OMIT_MODE_TEST_TWO: false,
//   OMIT_MODE_TEST_THREE: false,
//   OMIT_MODE_TEST_FOUR: false,
//   OMIT_MODE_TEST_FIVE: true,
// } as const;

/**
 pnpm run test -- __tests__/runtime/api/transform-xalor/flatten-mode.test.ts
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
  // TRANSFORM XALOR API FLATTEN MODE
  //============================================================================================
  //============================================================================================
  describe('Transform XALOR FLATTEN MODE', () => {
    it('is a placeholder', () => {
      expect(true).toBe(true);
    });
  });
});
