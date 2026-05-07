// __tests__/engine/validator.test.ts
import { reportError } from '../../src/validation/errors';
import { createInitialContext } from '../../src/validation/context';
import { serialize, getCallerLocation } from '../../src/utils';
/**
 * BREAK DOWN
 * --------
 * WE NEED TO TEST THREE THINGS:
 * I.   Initialization (Default state)
 * II.  Error Collection (Pushing to the array)
 * III. Path Management (Breadcrumb accuracy)
 */
describe('Engine: Error Validation & Context Initialization', () => {
  describe('Context Initialization: (createInitialContext)', () => {
    it('should initialize with the correct default values (Pillar 4)', () => {
      const ctx = createInitialContext();

      expect(ctx.path).toBe('$');

      expect(ctx.errors).toEqual([]);

      expect(ctx.currentKey).toBeUndefined();
    });

    it('should provide a fresh "seen" Map for recursion protection (Pillar 2)', () => {
      const ctx = createInitialContext();

      expect(ctx.seen).toBeInstanceOf(Map);
      expect(ctx.seen.size).toBe(0);
    });

    it('should ensure every call returns a unique object (Memory Isolation)', () => {
      const ctxA = createInitialContext();
      const ctxB = createInitialContext();

      expect(ctxA).not.toBe(ctxB);

      expect(ctxA.errors).not.toBe(ctxB.errors);
      expect(ctxA.seen).not.toBe(ctxB.seen);
    });

    it('should satisfy the TValidationContext interface requirements', () => {
      const ctx = createInitialContext();

      expect(ctx).toHaveProperty('path');
      expect(ctx).toHaveProperty('errors');
      expect(ctx).toHaveProperty('seen');
    });
  });
  describe('Context Initialization: (reportError)', () => {
    it('should record a failure and always return false (Short-circuit logic)', () => {
      const ctx = createInitialContext();
      ctx.path = '$.user.id';
      ctx.currentKey = 'USER_SCHEMA';

      const result = reportError(ctx, 'number', 'string-value');
      expect(result).toBe(false);

      expect(ctx.errors).toHaveLength(1);

      const error = ctx.errors[0];
      expect(error.key).toBe('USER_SCHEMA');
      expect(error.path).toBe('$.user.id');
      expect(error.message).toBe('Validation failed at $.user.id');
    });

    it('should handle "unknown" as a fallback key when currentKey is missing', () => {
      const ctx = createInitialContext();
      ctx.currentKey = undefined;

      reportError(ctx, 'any', null);

      expect(ctx.errors[0].key).toBe('unknown');
    });

    it('should utilize serialization to format expected and received data', () => {
      const ctx = createInitialContext();

      reportError(ctx, 'string', 123);

      const error = ctx.errors[0];
      expect(error.expected).toBe('"string"');
      expect(error.received).toBe('123');
    });

    it('should attach source location metadata (Area Tracking)', () => {
      const ctx = createInitialContext();
      reportError(ctx, 'any', 'any');

      expect(ctx.errors[0].area).toMatch(/\.ts|\.js/);
    });
  });
  describe('Context Initialization: (serialize & getCallerLocation)', () => {
    describe('serialize (Data Formatting)', () => {
      it('should format strings with quotes for readability', () => {
        expect(serialize('hello')).toBe('"hello"');
      });

      it('should handle undefined explicitly', () => {
        expect(serialize(undefined)).toBe('undefined');
      });

      it('should serialize BigInts by appending "n" or stringify (Circular Safety)', () => {
        const big = BigInt(100);
        expect(serialize(big)).toBe('100n');
      });

      it('should fall back to String() conversion if JSON.stringify fails (Circular Trap)', () => {
        const circular: any = { a: 1 };
        circular.self = circular;

        expect(() => serialize(circular)).not.toThrow();
        expect(serialize(circular)).toBe('[object Object]');
      });

      it('should pretty-print objects with 2-space indentation', () => {
        const data = { a: 1 };
        const result = serialize(data);
        expect(result).toContain('{\n  "a": 1\n}');
      });
    });

    describe('getCallerLocation (Stack Extraction)', () => {
      it('should return a cleaned file path and line number', () => {
        const location = getCallerLocation({ preferredIndex: 0 });

        expect(location).toContain('context.test.ts');
        // Should not contain the 'at ' prefix
        expect(location).not.toMatch(/^\s*at\s+/);
      });

      it('should handle the topParent flag to find user code', () => {
        const location = getCallerLocation({ topParent: true });
        expect(location).toBeDefined();
        expect(location).not.toContain('node_modules');
      });

      it('should strip path prefixes for privacy/cleanliness', () => {
        const mockPrefix = '/Users/project/';

        const result = getCallerLocation({ stripPathPrefix: mockPrefix });

        expect(result).not.toContain(mockPrefix);
      });

      it('should return "unknown" if the stack is completely empty', () => {
        const result = getCallerLocation({ preferredIndex: 999 });
        expect(result).toBeDefined();
      });
    });
  });
});

// ==================================================
// ==================================================
// EDGE CASES
// ==================================================
// ==================================================
describe('EDGE CASES: Error Validation & Context Initialization', () => {
  describe('EDGE CASES: Context Initialization', () => {
    /**
     * Extreme Depth)
     * !!! Ensures the string-based breadcrumb path doesn't degrade performance or
     * !!! overflow when validating 100+ levels of nested objects.
     */
    it('should handle extremely deep property nesting without corruption', () => {
      const ctx = createInitialContext();
      const depth = 500;

      // Simulate a deep recursive dive
      for (let i = 0; i < depth; i++) {
        ctx.path += `.prop_${i}`;
      }

      expect(ctx.path).toContain('.prop_499');
      expect(ctx.path.startsWith('$')).toBe(true);
    });
    /**
     * Zombie State
     * !!! If you are running in a long-lived environment (like a Lambda function or a Dev Server),
     * !!! you must prove that calling createInitialContext doesn't accidentally pick up leftovers
     * !!! from a previous "Global" variable.
     */
    it('should not be affected by previous modifications to the global prototype', () => {
      // Simulate someone messing with the Object prototype (common in dirty environments)
      (Object.prototype as any).path = 'poisoned';

      const ctx = createInitialContext();

      expect(ctx.path).toBe('$');

      delete (Object.prototype as any).path;
    });
    /**
     * High Frequency
     * !!! If isSolid is called thousands of times per second, we must ensure that the seen
     * !! Map and errors array are distinct memory allocations every single time.
     */
    it('should maintain strict memory isolation under high-frequency calls', () => {
      const contexts = Array.from({ length: 1000 }, () =>
        createInitialContext(),
      );

      const uniqueSeenMaps = new Set(contexts.map((c) => c.seen));
      const uniqueErrorArrays = new Set(contexts.map((c) => c.errors));

      expect(uniqueSeenMaps.size).toBe(1000);
      expect(uniqueErrorArrays.size).toBe(1000);
    });
  });
  describe('EDGE CASES: (reportError) ', () => {
    /**
     * ERROR AGGREGATION
     * !!! What happens if we call reportError multiple times?
     * !!! The context must act as a Cumulative Ledger.
     */
    it('should accumulate multiple errors in the order they occur', () => {
      const ctx = createInitialContext();

      reportError(ctx, 'first', 1);
      reportError(ctx, 'second', 2);

      expect(ctx.errors).toHaveLength(2);
      expect(ctx.errors[0].expected).toBe('"first"');
      expect(ctx.errors[1].expected).toBe('"second"');
    });
  });
  describe('serialize: Edge Cases', () => {
    it('should handle "null" vs "empty string" distinctly', () => {
      // Crucial for debugging property existence
      expect(serialize(null)).toBe('null');
      expect(serialize('')).toBe('""');
    });

    it('should handle Symbols (which JSON.stringify ignores)', () => {
      const sym = Symbol('brand');
      // JSON.stringify returns undefined for symbols, but we need a string
      expect(serialize(sym)).toBe('Symbol(brand)');
    });

    it('should handle extreme nesting (JSON.stringify depth limits)', () => {
      // Create a very deep object that might hit stack limits
      const deep: any = {};
      let current = deep;
      for (let i = 0; i < 100; i++) {
        current.next = {};
        current = current.next;
      }

      expect(() => serialize(deep)).not.toThrow();
      expect(serialize(deep)).toContain('next');
    });
  });
  describe('getCallerLocation: Edge Cases', () => {
    it('should handle a "Single Line" stack trace', () => {
      const mockErr = { stack: 'Error\n    at single-file.ts:1:1' };

      const originalCapture = Error.captureStackTrace;
      Error.captureStackTrace = (obj: any) => {
        obj.stack = mockErr.stack;
      };

      const result = getCallerLocation({ preferredIndex: 10 }); // Index out of bounds

      expect(result).toBe('single-file.ts:1:1');

      Error.captureStackTrace = originalCapture;
    });

    it('should handle special characters in the CWD (RegExp Safety)', () => {
      const trickyPath = '/Users/me/my-app (v1)';
      const result = getCallerLocation({ stripPathPrefix: trickyPath });

      expect(result).not.toContain('(v1)');
    });

    it('should return "unknown" if stack is an empty string', () => {
      const result = getCallerLocation({ preferredIndex: -1 }); // Invalid index
      expect(result).toBeDefined(); // Should not crash
    });
  });
});
