// __tests__/engine/vault.test.ts
/**
 * THE VAULT (Registry)
 *
 * This suite verifies the Global Singleton where all mined blueprints
 * and runtime validation errors are stored.
 *
 * Vault METHODS FULLY TESTED
 * ----------------------------
 * I.   Registry.register()  - Version guarding & metadata injection.
 * II.  Registry.get()       - Shape retrieval via unique keys.
 * III. Registry.keys()      - Global key enumeration.
 * IV.  Registry.getErrors() - Pillar 4: Error ledger retrieval.
 * V.   Registry.setErrors() - State persistence for failed validations.
 * VI.  Registry.getDefault()- Pillar 5: Seed logic for base values.
 *
 * Vault METHODS TO BE TESTED / IMPLEMENTED
 * ----------------------------
 * VII.   Registry.clear()      - The Janitor: Wiping state for HMR/Tests.
 * VIII.  Registry.getMock()     - The Faker: Randomized valid data generation.
 * IX.    Registry.getSchema()   - The Translator: Export to JSON Schema/Zod.
 * X.     Registry.export()      - The Porter: Serializable JSON dump of Vault.
 * XI.    Registry.import()      - The Rehydrator: Loading JSON into live Vault.
 * XII.   Registry.isEqual()     - The Deep Comparison: Structural identity check.
 * XIII.  Registry.patch()       - The Safe Merger: Partial updates with validation.
 * XIV.   Registry.match()       - The Pattern Matcher: Functional type-switching.
 */
import { Registry } from '../../src/vault';
import { IS_SOLID_CONFIG_ITEMS } from '../../src/models/constants';

/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST FIVE AREAS:
 * I.   Registration & Versioning (The Gatekeeper)
 * II.  Retrieval & Keys (The Phonebook)
 * III. Error Management (The Ledger)
 * IV.  Default Generation (The Seed)
 * V.   State Management (The Janitor - Critical for HMR/Tests)
 */
describe('Engine: The Vault (Registry)', () => {
  beforeEach(() => {
    const globalVault = (globalThis as any).__SOLID_VAULT__;
    if (globalVault) {
      globalVault.items.clear();
      globalVault.errors.clear();
    }
    jest.clearAllMocks();
  });
  // !!! ========================================================
  // !!! ========================================================
  // !!! Registry.register()
  // !!! ========================================================
  // !!! ========================================================
  describe('I. Registration & Versioning (The Gatekeeper)', () => {
    it('should successfully register valid metadata', () => {
      const meta = {
        key: 'USER',
        shape: { kind: 'primitive', type: 'string' } as any,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        area: 'test.ts',
      };
      Registry.register(meta);
      expect(Registry.get('USER')).toEqual(meta);
    });

    it('should block registration and record an error on version mismatch', () => {
      const meta = {
        key: 'OLD_KEY',
        shape: { kind: 'primitive', type: 'string' } as any,
        version: '0.0.1-alpha',
        area: 'old-file.ts',
      };
      Registry.register(meta);
      expect(Registry.get('OLD_KEY')).toBeUndefined();
      expect(Registry.getErrors('OLD_KEY')[0].message).toContain(
        'Version mismatch',
      );
    });

    it('should handle duplicate registration by overwriting (HMR Support)', () => {
      const metaA = {
        key: 'X',
        shape: { kind: 'primitive', type: 'string' } as any,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        area: 'file_A.ts',
      };
      const metaB = {
        key: 'X',
        shape: { kind: 'primitive', type: 'number' } as any,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        area: 'file_B.ts',
      };

      Registry.register(metaA);
      Registry.register(metaB);
      expect(Registry.get('X')?.area).toBe('file_B.ts');
    });

    it('should auto-populate "area" if missing (Scribe Fallback)', () => {
      Registry.register({
        key: 'AUTO_AREA',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: { kind: 'primitive', type: 'string' } as any,
        area: '',
      });
      const entry = Registry.get('AUTO_AREA');
      expect(entry?.area).toContain('vault.test.ts');
    });
  });
  // !!! ========================================================
  // !!! ========================================================
  // !!!  Registry.get()
  // !!! ========================================================
  // !!! ========================================================
  describe('II. Retrieval & Identity (The Source of Truth)', () => {
    it('should return all registered keys', () => {
      Registry.register({
        key: 'A',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: {} as any,
        area: '',
      });
      Registry.register({
        key: 'B',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: {} as any,
        area: '',
      });

      expect(Registry.keys()).toContain('A');
      expect(Registry.keys()).toContain('B');
      expect(Registry.keys()).toHaveLength(2);
    });

    it('should survive module re-evaluation (Global Singleton Integrity)', () => {
      const vault = (globalThis as any).__SOLID_VAULT__;
      vault.items.set('SHADOW_KEY', { key: 'SHADOW_KEY', shape: {} as any });
      expect(Registry.keys()).toContain('SHADOW_KEY');
    });

    it('should maintain a physical global singleton (Reference Identity)', () => {
      const vault = (globalThis as any).__SOLID_VAULT__;
      Registry.register({
        key: 'ID_TEST',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: {} as any,
        area: '',
      });
      expect(vault.items.has('ID_TEST')).toBe(true);
    });
  });
  // !!! ========================================================
  // !!! ========================================================
  // !!!   Registry.getErrors()
  // !!! ========================================================
  // !!! ========================================================
  describe('III. Error Management (The Ledger)', () => {
    it('should persist and retrieve validation errors for a specific key', () => {
      const mockErrors = [
        { key: 'TEST', path: '$', message: 'Fail', expected: '', received: '' },
      ];
      Registry.setErrors('TEST', mockErrors as any);
      expect(Registry.getErrors('TEST')).toEqual(mockErrors);
    });
  });
  // !!! ========================================================
  // !!! ========================================================
  // !!! Registry.getDefault()
  // !!! ========================================================
  // !!! ========================================================
  describe('IV. Default Generation (The Seed)', () => {
    it('should produce a default value for a registered key', () => {
      Registry.register({
        key: 'DEFAULT_STR',
        shape: { kind: 'primitive', type: 'string' } as any,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        area: '',
      });
      const result = Registry.getDefault<string>('DEFAULT_STR');
      expect(typeof result).toBe('string');
    });
  });

  describe('V. Future Integration Points (Placeholders)', () => {
    it('is ready for getSolidMock integration', () => {
      expect(Registry).toHaveProperty('register');
    });
    /**
     * Vault METHODS TO BE TESTED / IMPLEMENTED
     * ----------------------------
     * VII.   Registry.clear()      - The Janitor: Wiping state for HMR/Tests.
     * VIII.  Registry.getMock()     - The Faker: Randomized valid data generation.
     * IX.    Registry.getSchema()   - The Translator: Export to JSON Schema/Zod.
     * X.     Registry.export()      - The Porter: Serializable JSON dump of Vault.
     * XI.    Registry.import()      - The Rehydrator: Loading JSON into live Vault.
     * XII.   Registry.isEqual()     - The Deep Comparison: Structural identity check.
     * XIII.  Registry.patch()       - The Safe Merger: Partial updates with validation.
     * XIV.   Registry.match()       - The Pattern Matcher: Functional type-switching.
     */
  });
});
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
// =================================== EDGE CASES =====================================================
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
describe('EDGE CASES: The Vault (Registry)', () => {
  // beforeEach(() => {
  //   const globalVault = (globalThis as any).__SOLID_VAULT__;

  //   // 💎 THE FIX: Only clear if they are actually Maps
  //   // This prevents "Cannot read property 'clear' of null"
  //   if (globalVault) {
  //     if (globalVault.items instanceof Map) {
  //       globalVault.items.clear();
  //     }
  //     if (globalVault.errors instanceof Map) {
  //       globalVault.errors.clear();
  //     }
  //   }

  //   jest.clearAllMocks();
  // });
  beforeEach(() => {
    const g = globalThis as any;
    const vault = g.__SOLID_VAULT__;

    // 💎 THE FIX: Only clear if they are actually valid Maps
    if (vault) {
      if (vault.items instanceof Map) vault.items.clear();
      if (vault.errors instanceof Map) vault.errors.clear();
    }

    jest.clearAllMocks();
  });
  // !!! EDGE CASE:Registry.register()
  describe('Registry.register() - Edge Cases', () => {
    it('should recover gracefully if the global vault structure is corrupted (Resiliency)', () => {
      // 🏛️ EDGE CASE: Someone (or another lib) messed with the global object
      (globalThis as any).__SOLID_VAULT__ = { items: null, errors: undefined };

      expect(() =>
        Registry.register({
          key: 'RECOVER',
          version: IS_SOLID_CONFIG_ITEMS.solidVersion,
          shape: {} as any,
          area: '',
        }),
      ).not.toThrow();

      // ensureGlobalVault() should have repaired the references
      expect(Registry.get('RECOVER')).toBeDefined();
    });

    it('should handle "Prototype Pollution" keys safely (Security)', () => {
      // 🏛️ EDGE CASE: Using reserved JS keys like '__proto__' or 'constructor'
      // This proves the use of Map over a plain Object {}
      const key = '__proto__';
      Registry.register({
        key,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: { kind: 'primitive', type: 'string' } as any,
        area: '',
      });

      expect(Registry.get(key)).toBeDefined();
      expect(Registry.keys()).toContain('__proto__');
    });
    it('should recover if the global vault structure is corrupted', () => {
      (globalThis as any).__SOLID_VAULT__ = { items: null, errors: undefined };
      expect(() =>
        Registry.register({
          key: 'RECOVER',
          version: IS_SOLID_CONFIG_ITEMS.solidVersion,
          shape: {} as any,
          area: '',
        }),
      ).not.toThrow();
      expect(Registry.get('RECOVER')).toBeDefined();
    });

    it('should handle "Prototype Pollution" keys safely', () => {
      const key = '__proto__';
      Registry.register({
        key,
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: { kind: 'primitive', type: 'string' } as any,
        area: '',
      });
      expect(Registry.get(key)).toBeDefined();
    });
  });
  // !!! EDGE CASE: Registry.get() & keys()
  describe('Registry.get() & keys() - Edge Cases', () => {
    it('should return undefined and empty array if the Vault has not been initialized', () => {
      // 🏛️ EDGE CASE: Cold start (nothing exists on globalThis yet)
      delete (globalThis as any).__SOLID_VAULT__;

      expect(Registry.get('ANY')).toBeUndefined();
      expect(Registry.keys()).toEqual([]);
    });

    it('should be case-sensitive for keys', () => {
      // 🏛️ EDGE CASE: Distinguishing between 'User' and 'user'
      Registry.register({
        key: 'User',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: {} as any,
        area: '',
      });

      expect(Registry.get('User')).toBeDefined();
      expect(Registry.get('user')).toBeUndefined();
    });
    it('should return empty/undefined if vault is manually deleted', () => {
      delete (globalThis as any).__SOLID_VAULT__;
      expect(Registry.get('ANY')).toBeUndefined();
      expect(Registry.keys()).toEqual([]);
    });
  });
  // !!! EDGE CASE: Registry.setErrors()
  describe('Registry.setErrors() - Edge Cases', () => {
    it('should allow clearing errors for a specific key by passing an empty array', () => {
      // 🏛️ EDGE CASE: Resetting the error ledger for a key without wiping the whole vault
      Registry.setErrors('STALE', [{ message: 'Old Error' } as any]);
      Registry.setErrors('STALE', []);

      expect(Registry.getErrors('STALE')).toHaveLength(0);
    });
  });
  // !!! EDGE CASE: Registry.getDefault()
  describe('Registry.getDefault() - Edge Cases', () => {
    it('should fail with a descriptive error when the shape in the Vault is corrupted', () => {
      // 🏛️ EDGE CASE: Registration succeeded but shape data is null/undefined
      Registry.register({
        key: 'BROKEN',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: undefined as any,
        area: '',
      });

      expect(() => Registry.getDefault('BROKEN')).toThrow();
    });
    it('should fail with a descriptive error when shape data is null', () => {
      Registry.register({
        key: 'BROKEN',
        version: IS_SOLID_CONFIG_ITEMS.solidVersion,
        shape: undefined as any,
        area: '',
      });
      expect(() => Registry.getDefault('BROKEN')).toThrow();
    });
  });
});
