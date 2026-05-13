import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TSolidBranded,
  TTypeGuard,
  TXalorAuditReport,
  TValidateXalorModes,
  TValidateXalorReturn,
  TTValidateStrategyEngine,
} from '../models/types';
import { buildValidationTools, markAsSolid } from '../utils';

// --- OVERLOAD 1: THE GUARD ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'guard',
>(data: unknown, injectedKey: K, mode: _M): TTypeGuard<ISolidRegistry[K]>;
// --- OVERLOAD 2: THE ASSERTION ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'assert',
>(data: unknown, injectedKey: K, mode: _M): asserts data is ISolidRegistry[K];
// --- OVERLOAD 3: THE PARSER ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'parse',
>(data: unknown, injectedKey: K, mode: _M): TSolidBranded<K, ISolidRegistry[K]>;
// --- OVERLOAD 4: THE ASYNC PARSER ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'parseAsync',
>(
  data: unknown,
  injectedKey: K,
  mode: _M,
): Promise<TSolidBranded<K, ISolidRegistry[K]>>;
// --- OVERLOAD 5: THE AUDIT ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'audit',
>(data: unknown, injectedKey: K, mode: _M): TXalorAuditReport;
// --- IMPLEMENTATION ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  M extends TValidateXalorModes,
>(data: unknown, injectedKey: K, mode: M): TValidateXalorReturn<K, M> {
  if (!injectedKey || !mode) {
    throw new Error(
      `[xalor] 🚨 GATEWAY BLOCK: 'validateXalor' executed without compiled metadata properties.\n` +
        `Ensure your build-time transformer plugin is active.`,
    );
  }

  const VALIDATOR_MODES: TTValidateStrategyEngine<K> = {
    guard: (_val, key) => {
      const { guard } = buildValidationTools(key);

      const runtimeGuard: TTypeGuard<ISolidRegistry[K]> = (
        v: unknown,
      ): v is ISolidRegistry[K] => {
        return guard(v) && markAsSolid<K, ISolidRegistry[K]>(v);
      };

      return runtimeGuard; // ✅ Compiles safely with zero assertions
    },

    assert: (val, key) => {
      const { assert } = buildValidationTools(key);
      return assert(val); // ✅ Compiles safely (returns void)
    },

    parse: (val, key) => {
      if (XalethorService.validateShape(val, key)) {
        if (markAsSolid<K, ISolidRegistry[K]>(val)) {
          return val;
        }
      }
      return XalethorService.panic(key);
    },

    parseAsync: async (val, key) => {
      return Promise.resolve(val).then((_val) => {
        if (XalethorService.validateShape(_val, key)) {
          if (markAsSolid<K, ISolidRegistry[K]>(_val)) return _val;
        }
        // 🎯 FIX: Direct rejection pipeline prevents uncaught microtask exceptions
        return Promise.reject(
          new Error(
            `[xalor] Async parser validation failed for blueprint key: ${key}`,
          ),
        );
      });
    },

    audit: (val, key) => {
      const isValid = XalethorService.validateShape(val, key);
      const rawErrors = XalethorService.getKeyErrors(key);

      return XalethorService.auditReport(isValid, rawErrors);
    },
  } satisfies TTValidateStrategyEngine<K>;

  return VALIDATOR_MODES[mode](data, injectedKey);
}

// ## 🛡️ Category 2: Validation API (The Bouncer Core)

// **Role:**
// The execution switches used to inspect, verify, and brand incoming payloads synchronously at runtime.

// ### Current Implementations

// ### Future Enterprise Additions

// - `isXalor({ mode: 'guardMany', data: unknown[] })`
//   High-throughput bulk validator that processes whole arrays using internal looping optimizations, returning a comprehensive validation ledger.

// - `isXalor({ mode: 'stream', pipeline })`
//   Node stream or Web stream transformer that performs chunk-by-chunk schema validation on incoming raw data packets (e.g., file uploads, server-sent events).
