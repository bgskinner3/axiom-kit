// __tests__/runtime/api/transform-xalor.test.ts
import { transformXalor } from '../../../../src/operations';
import { TEST_SHAPE_REGISTRY } from '../../../utils/constants';
import { seedTestVault, logEngineTrace } from '../../../utils';

const TEST_LOGS = {
  PICK_MODE_TEST_ONE: false,
  PICK_MODE_TEST_TWO: false,
  PICK_MODE_TEST_THREE: false,
  PICK_MODE_TEST_FOUR: false,
  PICK_MODE_TEST_FIVE: false,
} as const;

/**
 pnpm run test -- __tests__/runtime/api/transform-xalor/pick-mode.test.ts
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
  }
}
// pick, omit, rename, merge, flatten
describe('Runtime Generator API', () => {
  beforeAll(() => {
    // Seed your mock blueprint registry definitions flatly straight into RAM memory
    seedTestVault('USER_TEST', TEST_SHAPE_REGISTRY.STANDARD_USER);
    seedTestVault('API_RESPONSE', TEST_SHAPE_REGISTRY.UNION_RESPONSE);
    seedTestVault('STORE_ORDER', TEST_SHAPE_REGISTRY.COMPLEX_ORDER);
  });
  //============================================================================================
  //============================================================================================
  // TRANSFORM XALOR API PICK MODE
  //============================================================================================
  //============================================================================================
  describe('Transform XALOR PICK MODE', () => {
    it('🛡️ should successfully retain only requested fields from a primitive/flat object payload', () => {
      const mockUser = {
        id: 42,
        username: 'XalethorDev',
        active: true,
        extraRogueProperty: 'malicious_injection_payload', // Should be cleanly sliced away
      };

      // Emulate the precompiled build-time parameter macro extraction injection pass
      const result = transformXalor<'USER_TEST', 'pick'>({
        data: mockUser,
        keys: ['id', 'username'],
      });
      logEngineTrace({
        enabled: TEST_LOGS.PICK_MODE_TEST_ONE,
        mode: 'pick',
        operation: 'Selective Field Retention Pass',
        target: 'USER_TEST',
        behavior:
          'Retaining explicitly requested keys ["id", "username"] while pruning unlisted fields.',
        output: result,
      });

      expect(result).toEqual({
        id: 42,
        username: 'XalethorDev',
      });
      expect(Object.prototype.hasOwnProperty.call(result, 'active')).toBe(
        false,
      );
      expect(
        Object.prototype.hasOwnProperty.call(result, 'extraRogueProperty'),
      ).toBe(false);
    });

    it('🛡️ should preserve the prototype configuration mapping layers while peeling fields away', () => {
      class UserModel {
        id = 101;
        username = 'ProtoUser';
        active = false;
        greet() {
          return 'Hello';
        }
      }

      const userInstance = new UserModel();

      const result = transformXalor<'USER_TEST', 'pick'>({
        data: userInstance,
        keys: ['username', 'active'],
      });
      logEngineTrace({
        enabled: TEST_LOGS.PICK_MODE_TEST_TWO,
        mode: 'pick',
        operation: 'Class Instance Properties Slicing',
        target: 'USER_TEST',
        behavior:
          'Preserving native class prototype layers while cleanly removing unlisted parameters.',
        output: result,
      });
      expect(result).toEqual({
        username: 'ProtoUser',
        active: false,
      });
      expect(Object.prototype.hasOwnProperty.call(result, 'id')).toBe(false);
      // Verify that class prototypes match up exactly through Object.create(proto) checks
      expect(Object.getPrototypeOf(result)).toBe(UserModel.prototype);
    });

    it('🛡️ should handle empty selection keys safely and return an absolute zero-property schema shell object', () => {
      const mockUser = { id: 99, username: 'Ghost', active: true };

      const result = transformXalor<'USER_TEST', 'pick'>({
        data: mockUser,
        keys: [],
      });
      logEngineTrace({
        enabled: TEST_LOGS.PICK_MODE_TEST_THREE,
        mode: 'pick',
        operation: 'Empty Target Extraction Pass',
        target: 'USER_TEST',
        behavior:
          'Safely evaluating an empty selection array to return a pristine zero-property shell object.',
        output: result,
      });
      expect(result).toEqual({});
      expect(Object.keys(result).length).toBe(0);
    });

    it('🛡️ should handle polymorphic union shapes quietly and filter fields matching the fitting variant path', () => {
      const mockSuccessResponse = { status: 'success', extraNoise: 12345 };
      const mockLiteralResponse = {
        status: 500,
        extraNoise: 'fatal_server_break',
      };

      const resultSuccess = transformXalor<'API_RESPONSE', 'pick'>({
        data: mockSuccessResponse,
        keys: ['status'],
      });

      const resultLiteral = transformXalor<'API_RESPONSE', 'pick'>({
        data: mockLiteralResponse,
        keys: ['status'],
      });
      logEngineTrace({
        enabled: TEST_LOGS.PICK_MODE_TEST_FOUR,
        mode: 'pick',
        operation: 'Polymorphic Union Branch Slicing',
        target: 'API_RESPONSE',
        behavior:
          'Dynamically matching the valid union branch and slicing unlisted variables from both schemas.',
        output: { resultSuccess, resultLiteral },
      });
      expect(resultSuccess).toEqual({ status: 'success' });
      expect(resultLiteral).toEqual({ status: 500 });
      expect(
        Object.prototype.hasOwnProperty.call(resultSuccess, 'extraNoise'),
      ).toBe(false);
      expect(
        Object.prototype.hasOwnProperty.call(resultLiteral, 'extraNoise'),
      ).toBe(false);
    });

    it('🛡️ should successfully retain only deep-nested properties requested via advanced dot-notation paths', () => {
      const mockOrder = {
        orderId: 'ORD-2026',
        items: [
          { SKU: 'AAA', quantity: 5, rogueTag: 'noise_one' },
          { SKU: 'BBB', quantity: 12, rogueTag: 'noise_two' },
        ],
        extraNoiseField: 'root_clutter_to_be_removed',
      };

      // ✔️ NEW ADVANCED FEATURE ENFORCED!
      // Here we explicitly pick the 'orderId' and ONLY the 'SKU' property inside your child collection!
      const result = transformXalor<'STORE_ORDER', 'pick'>({
        data: mockOrder,
        keys: ['orderId', 'items.SKU'],
      });

      logEngineTrace({
        enabled: TEST_LOGS.PICK_MODE_TEST_FIVE,
        mode: 'pick',
        operation: 'Advanced Dot-Notation Deep Slicing Pass',
        target: 'STORE_ORDER',
        behavior:
          'Pruning nested collection fields ("quantity") dynamically on the stack trace frame via path parsing.',
        output: result,
      });

      expect(result).toEqual({
        orderId: 'ORD-2026',
        items: [
          { SKU: 'AAA' }, // 💎 'quantity' and 'rogueTag' are successfully sliced away!
          { SKU: 'BBB' }, // 💎 'quantity' and 'rogueTag' are successfully sliced away!
        ],
      });
    });
  });

  // //============================================================================================
  // //============================================================================================
  // // TRANSFORM XALOR API OMIT MODE
  // //============================================================================================
  // //============================================================================================
  // describe('Transform XALOR OMIT MODE', () => {});

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
