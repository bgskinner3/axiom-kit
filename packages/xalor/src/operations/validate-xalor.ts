import { XalethorService } from '../xalor-service';
import type {
  ISolidRegistry,
  TValidateXalorReturn,
  TTValidateStrategyEngine,
} from '../models/types';
import { buildValidationTools, markAsSolid } from '../utils';
import type {
  TTypeGuard,
  TXalorAuditReport,
  TValidateXalorModes,
} from '../../shared';
// --- OVERLOAD 1: THE GUARD ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'guard',
>(): TTypeGuard<ISolidRegistry[K]>;
// --- OVERLOAD 2: THE ASSERTION ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'assert',
>(data: unknown): asserts data is ISolidRegistry[K];
// --- OVERLOAD 3: THE PARSER ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'parse',
>(data: unknown): ISolidRegistry[K];
// --- OVERLOAD 4: THE ASYNC PARSER ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  _M extends 'parseAsync',
>(data: unknown): Promise<ISolidRegistry[K]>;
// --- OVERLOAD 5: THE AUDIT ---
export function validateXalor<
  _K extends keyof ISolidRegistry,
  _M extends 'audit',
>(data: unknown): TXalorAuditReport;
// --- IMPLEMENTATION ---
export function validateXalor<
  K extends keyof ISolidRegistry,
  M extends TValidateXalorModes,
>(injectedKey?: K, mode?: M, data?: unknown): TValidateXalorReturn<K, M> {
  if (!injectedKey || !mode) {
    throw new Error(
      `[xalor] 🚨 GATEWAY BLOCK: 'validateXalor' executed without compiled metadata properties.\n` +
        `Ensure your build-time transformer plugin is active.`,
    );
  }

  const VALIDATOR_MODES: TTValidateStrategyEngine<K> = {
    guard: (key) => {
      const { guard } = buildValidationTools(key);

      const runtimeGuard: TTypeGuard<ISolidRegistry[K]> = (
        v: unknown,
      ): v is ISolidRegistry[K] => {
        return guard(v) && markAsSolid<K, ISolidRegistry[K]>(v);
      };

      return runtimeGuard; // ✅ Compiles safely with zero assertions
    },

    assert: (key, val) => {
      const { assert } = buildValidationTools(key);
      return assert(val); // ✅ Compiles safely (returns void)
    },

    parse: (key, val) => {
      if (XalethorService.validateShape(val, key)) {
        if (markAsSolid<K, ISolidRegistry[K]>(val)) {
          return val;
        }
      }
      return XalethorService.panic(key);
    },

    parseAsync: async (key, val) => {
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

    audit: (key, val) => {
      const isValid = XalethorService.validateShape(val, key);
      const rawErrors = XalethorService.getKeyErrors(key);

      return XalethorService.auditReport(key, isValid, rawErrors);
    },
  } satisfies TTValidateStrategyEngine<K>;

  return VALIDATOR_MODES[mode](injectedKey, data);
}

/**
 * ============================================================================
 * 🛡️ VALIDATE XALOR API STRATEGY SPECIFICATIONS
 * ============================================================================
 *
 * I. TYPE GUARD CREATOR ('guard')
 * - WHAT IT DOES:
 *   Generates a reusable, standalone functional type-predicate checker closure.
 * - HOW IT WORKS:
 *   Extracts the pre-baked schema from memory and instantiates a high-utility
 *   `TTypeGuard<T>` mapping rule that outputs a primitive boolean.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   const isUser = validateXalor<'USER_TEST', 'guard'>();
 *   if (isUser(payload)) {
 *     console.log(payload.username); // Natively narrowed within branch scope!
 *   }
 *   ```
 *
 * ============================================================================
 * II. ASSERTION CONTROLLER ('assert')
 * - WHAT IT DOES:
 *   Acts as an inline hard-gate barrier that instantly halts thread execution.
 * - HOW IT WORKS:
 *   Evaluates input properties immediately. If any boundary laws are breached,
 *   it triggers a synchronous runtime crash exception; otherwise, it returns void.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   // mysteriously untyped incoming variable from API/Network
 *   const payload: unknown = getIncomingRequest();
 *   validateXalor<'USER_TEST', 'assert'>(payload);
 *   console.log(payload.id); // Completely narrowed downstream from the assertion gate!
 *   ```
 *
 * ============================================================================
 * III. SYNCHRONOUS PARSER ('parse')
 * - WHAT IT DOES:
 *   Validates and returns the clean verified object data payload inline.
 * - HOW IT WORKS:
 *   Fires a synchronous deep structural scan. On conformance success, it stamps
 *   nominal branding tags via `markAsSolid` and passes the pristine data back.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   const user = validateXalor<'USER_TEST', 'parse'>(rawData);
 *   // Returns fully typed 'ISolidRegistry["USER_TEST"]' object or panics immediately.
 *   ```
 *
 * ============================================================================
 * IV. ASYNC PARSER ('parseAsync')
 * - WHAT IT DOES:
 *   Validates structures asynchronously inside the event-loop macro/microtask pipeline.
 * - HOW IT WORKS:
 *   Wraps the validation pass cleanly within a `Promise<T>`. On failure, it fires
 *   an immediate catchable promise rejection, completely isolating microtask streams.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   const user = await validateXalor<'USER_TEST', 'parseAsync'>(networkData);
 *   ```
 *
 * ============================================================================
 * V. DIAGNOSTIC SOFT-AUDITOR ('audit')
 * - WHAT IT DOES:
 *   Provides programmatically inspectable summaries of structural type errors.
 * - HOW IT WORKS:
 *   Executes a quiet validation pass without panicking. It channels error tokens
 *   into a streaming generator, producing an immutable data audit report object.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   const report = validateXalor<'USER_TEST', 'audit'>(corruptedData);
 *   if (!report.valid) {
 *     report.issues.forEach(issue => console.log(`${issue.path}: ${issue.rule}`));
 *   }
 *   ```
 */
