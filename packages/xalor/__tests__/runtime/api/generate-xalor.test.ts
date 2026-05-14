// __tests__/runtime/api/generate-xalor.test.ts
import { generateXalor } from '../../../src/operations';
import { TEST_SHAPE_REGISTRY } from '../../utils/constants';
import { seedTestVault } from '../../utils';
/**
 pnpm run test -- __tests__/runtime/api/generate-xalor.test.ts
 */
declare module '../../../src/models/types' {
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
  }
}
describe('Runtime Generator API', () => {
  beforeAll(() => {
    seedTestVault('USER_TEST', TEST_SHAPE_REGISTRY.STANDARD_USER);
    seedTestVault('API_RESPONSE', TEST_SHAPE_REGISTRY.UNION_RESPONSE);
    seedTestVault('STORE_ORDER', TEST_SHAPE_REGISTRY.COMPLEX_ORDER);
  });
  it('🎯 should accurately generate a pristine default data skeleton from a standard user blueprint', () => {
    // 1. Fire the Category 2 API Switchboard
    const result = generateXalor('USER_TEST', 'default');

    // 2. Linear Structural Assertions
    // Verifies that primitive types map flawlessly to their zero-state defaults
    expect(result).toBeDefined();
    expect(result).toEqual({
      id: 0,
      username: '',
      active: false,
    });

    // 3. Strict Nominal Brand Tag Verification
    expect(result).toHaveProperty('__solidBrand', 'USER_TEST');
  });
});
