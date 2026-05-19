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

/**
 * @name VALIDATE RUNTIME API
 * @description
 * Standardized polymorphic runtime gateway executing Category 2 (The Validation API Layer) operations.
 * Evaluates raw incoming physical data shapes instantly against precompiled Vault registry blueprints.
 *
 * DESIGN INVARIANTS:
 * - Satisfies Commandment IV (Operation Isolation) and Commandment VIII (Internal Efficiency).
 * - Coordinates parsing traps, asynchronous promises, assertion halts, and audit metrics reporting.
 * - Build-time generic parameters <"KEY", "mode"> are stripped and injected at indices 1 and 2 at compilation runtime.
 *
 * -------
 * @mode guard
 * @description
 * Generates a clean, stateless type predicate function. Performs sub-microsecond structural evaluation
 * passes over runtime payloads without mutative state updates, saving side-effects or panic halts.
 * @example
 * ```ts
 * const isUserValid = validateXalor<'User', 'guard'>();
 * if (isUserValid(rawPayload)) {
 *   // rawPayload is safely narrowed to ISolidRegistry['User'] within this block
 *   console.log(rawPayload.username);
 * }
 * ```
 * -------
 * @mode assert
 * @description
 * Hard control-flow boundary assertion check. Evaluates the active value graph against the blueprint shape.
 * If data verification matches, it refines the scope natively; otherwise, it crashes the threat track instantly.
 * @example
 * ```ts
 * validateXalor<'User', 'assert'>(rawPayload);
 * // Execution only proceeds beyond this line if rawPayload strictly satisfies the 'User' blueprint
 * console.log(rawPayload.email);
 * ```
 * -------
 * @mode parse
 * @description
 * Synchronous data parser gate. Verifies the input structure immediately. If parsing hits constraint errors,
 * it leverages the auditor to trigger a structural panic throw; if valid, it outputs the verified typed instance.
 * @example
 * ```ts
 * try {
 *   const clearUser = validateXalor<'User', 'parse'>(rawPayload);
 *   console.log(clearUser.id);
 * } catch (error) {
 *   console.error("Validation failed:", error.message);
 * }
 * ```
 * -------
 * @mode parseAsync
 * @description
 * Asynchronous micro-task queue parsing pipeline. Offloads nested collection parsing and recursive schema checks
 * down to the non-blocking engine loop, resolving an immutable typed result promise frame.
 * @example
 * ```ts
 * const verifiedUser = await validateXalor<'User', 'parseAsync'>(rawPayload);
 * console.log(verifiedUser.createdAt);
 * ```
 * -------
 * @mode audit
 * @description
 * Analytical structural diagnostics reporter. Runs a deep validation path evaluation pass, collecting telemetry records,
 * error trackers, and paths locations into an isolated auditing payload without throwing execution halts.
 * @example
 * ```ts
 * const report = validateXalor<'User', 'audit'>(rawPayload);
 * if (!report.isValid) {
 *   console.log(`Discovered ${report.errors.length} model mismatches:`, report.errors);
 * }
 * ```
 * -------
 * @see TTValidateStrategyEngine
 * @see XalethorVaultValidator
 */

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

      return runtimeGuard;
    },

    assert: (key, val) => {
      const { assert } = buildValidationTools(key);
      return assert(val);
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
