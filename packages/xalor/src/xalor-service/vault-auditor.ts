import { ensureGlobalVault, yieldFiltered } from '../utils';
import type {
  TSolidError,
  TSolidVaultMap,
  TXalorAuditReport,
  TXalorIssue,
  TXalorRuleKind,
} from '../../shared';
import { RULE_KEYWORDS_MAP } from '../mappers';
import {
  isString,
  isObject,
  isKeyInObject,
  isNull,
  isDefined,
} from '../../shared';

/**
 * XALETHOR VAULT AUDITOR
 *
 * ROLE:
 * The "Detective" and Communication Hub. It monitors system health
 * and translates raw binary failures into human-readable GPS reports.
 *
 * WHAT GOES HERE:
 * - Error recording and state management.
 * - Terminal formatting with Double-GPS (Origin vs. Failure) links.
 * - The 'panic' mechanism for throwing meaningful assertions.
 *
 * WHAT DOES NOT GO HERE:
 * - NO Validation execution (Detectives don't catch criminals, they report).
 * - NO Type extraction or Miner logic.
 * - NO Shape generation.
 */
export class XalethorVaultAuditor {
  private static get errorVault(): TSolidVaultMap['errors'] {
    return ensureGlobalVault().errors;
  }

  public static getErrors(key: string): TSolidError[] {
    return this.errorVault.get(key) ?? [];
  }
  public static clearErrors(key?: string): void {
    if (key) this.errorVault.delete(key);
    if (!key) this.errorVault.clear();
  }
  /**
   * Internal: Sets the errors for a specific key in the errors map.
   */
  public static setErrors(key: string, errors: TSolidError[]): void {
    this.errorVault.set(key, errors);
  }

  public static record(error: TSolidError): void {
    const currentErrors = this.getErrors(error.key);
    currentErrors.push(error);
    this.setErrors(error.key, currentErrors);
  }
  public static formatReport(key: string): string {
    const errors = this.getErrors(key);
    if (errors.length === 0) return '';

    const header = `\n[xalor] 🛑 SOLIDITY BREAK: "${key}"\n`;

    const body = errors
      .map((err) => {
        // We pull the 'origin' which we stored during validation
        const origin =
          typeof err.origin === 'object' ? err.origin.area : err.origin;

        return [
          `  ❌ Path: $.${err.path}`,
          `     Expected: ${err.expected}`,
          `     Received: ${JSON.stringify(err.received)}`,
          `     📍 Origin: ${origin || 'unknown'}`,
          `     ⚡ Failed: ${err.area || 'unknown'}`,
        ].join('\n');
      })
      .join('\n\n');

    return `${header}${body}\n`;
  }
  public static panic(key: string, customMessage?: string): never {
    const report = this.formatReport(key);

    // 🛡️ If the engine didn't produce a report, create a System Panic message
    const finalMessage =
      report ||
      `[xalor] 🚨 ${customMessage || 'Assertion failure'} for key: ${key}`;

    this.clearErrors(key);
    throw new Error(finalMessage);
  }

  /**
   * 🌀 PRIVATE STREAMING GENERATOR WORKER
   *
   * ROLE:
   * Translates individual raw validation errors into strict audit categories.
   *
   * STRATEGY:
   * We apply a two-phase Sanitize-and-Filter Interception pattern:
   * - Phase 1: We use a regex string-replacement layer up-front to strip all stringification characters and
   *   normalize the token (`cleanReceivedRaw`). This lets us catch the `'missing'` token case-insensitively
   *   and instantly force `missing_property`, bypassing the catch-all primitive fallbacks.
   * - Phase 2: We expand our object schema refiner to look for the outer `.kind` and `.type` labels directly,
   *   allowing us to unpack primitive metadata graphs cleanly across all nested tracks without escaping quotes.
   */
  private static *processStreamingIssues(
    rawErrors: readonly TSolidError[],
    targetKey: string,
  ): Generator<TXalorIssue> {
    // 🛡️ TYPE PREDICATE CLOSURE: Safely isolate boundaries to our specific model key
    const matchesTargetKey = (err: TSolidError): err is TSolidError => {
      return !isNull(err) && isDefined(err) && err.key === targetKey;
    };

    // Stream filtered elements one by one across the generator pipeline thread
    const targetedErrorsStream = yieldFiltered(rawErrors, matchesTargetKey);

    for (const errorRecord of targetedErrorsStream) {
      const messageText = errorRecord.message?.toLowerCase() || '';
      const cleanReceivedRaw = isString(errorRecord.received)
        ? errorRecord.received.replace(/["']/g, '').trim().toLowerCase()
        : '';
      let resolvedRule: TXalorRuleKind = 'primitive_mismatch';

      if (
        cleanReceivedRaw === 'missing' ||
        messageText.includes('missing') ||
        messageText.includes('required')
      ) {
        resolvedRule = 'missing_property';
      } else {
        // O(1) Inverted object lookups match keyword rules instantly
        for (const keyword of Object.keys(RULE_KEYWORDS_MAP)) {
          if (messageText.includes(keyword)) {
            resolvedRule =
              RULE_KEYWORDS_MAP[keyword as keyof typeof RULE_KEYWORDS_MAP];
            break;
          }
        }
      }

      // Sanitize expected parameters down to clean strings without 'as' casts
      let expectedString = '';

      if (isString(errorRecord.expected)) {
        expectedString = errorRecord.expected.replace(/["']/g, '');
      } else if (isObject(errorRecord.expected)) {
        const expObj = errorRecord.expected as Record<string, unknown>;

        // ✔️ FIX: Trace down layers recursively if the error object houses nested primitive wrappers
        if (expObj.kind === 'primitive' && isString(expObj.type)) {
          expectedString = expObj.type;
        } else if (
          isKeyInObject('type')(errorRecord.expected) &&
          isString(errorRecord.expected.type)
        ) {
          expectedString = errorRecord.expected.type;
        } else if (isKeyInObject('value')(errorRecord.expected)) {
          expectedString = String(errorRecord.expected.value);
        } else {
          expectedString = JSON.stringify(errorRecord.expected);
        }
      }

      // Sanitize received parameters down to clean strings
      const receivedString =
        errorRecord.received === 'missing'
          ? 'undefined' // Converts internal token strings to standard engine printouts
          : isString(errorRecord.received)
            ? errorRecord.received
            : JSON.stringify(errorRecord.received);

      // Yield the structured payload directly down the stack evaluation path
      yield {
        path: errorRecord.path || '$.',
        expected: expectedString,
        received: receivedString,
        rule: resolvedRule,
      };
    }
  }
  /**
   * 🛰️ PUBLIC REPORT ENGINE COMPILER
   *
   * STRATEGY:
   * Materializes the lazy private generator stream cleanly at the absolute final edge line
   * using `Array.from()` to preserve maximum internal iteration efficiency.
   */
  public static compileAuditReport(
    targetKey: string,
    isValid: boolean,
    rawErrors: readonly TSolidError[],
  ): TXalorAuditReport {
    // 1. Direct short-circuit optimization for conforming data models
    if (isValid || !rawErrors || rawErrors.length === 0) {
      return { valid: true, issues: [] };
    }

    // 2. Stream and collect issues natively using our private generator method
    const issues = Array.from(
      this.processStreamingIssues(rawErrors, targetKey),
    );

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
