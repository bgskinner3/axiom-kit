import { ensureGlobalVault, RULE_MATCHERS_MAPPER } from '../utils';
import type {
  TSolidError,
  TSolidVaultMap,
  TXalorAuditReport,
  TXalorIssue,
  TXalorRuleKind,
} from '../models/types';
import { isString } from '../utils/guards';

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
  public static compileAuditReport(
    isValid: boolean,
    rawErrors: TSolidError[],
  ): TXalorAuditReport {
    if (isValid) return { valid: true, issues: [] };

    const issues: TXalorIssue[] = rawErrors.map((err) => {
      const msg = err.message?.toLowerCase() || '';

      const matched = RULE_MATCHERS_MAPPER.find(([keywords]) =>
        keywords.some((keyword) => msg.includes(keyword)),
      );

      // 3. Fallback evaluation via nullish coalescing
      const rule: TXalorRuleKind = matched ? matched[1] : 'primitive_mismatch';

      return {
        path: err.path || '$.',
        expected: isString(err.expected)
          ? err.expected
          : JSON.stringify(err.expected),
        received: isString(err.received)
          ? err.received
          : JSON.stringify(err.received),
        rule,
      };
    });

    return { valid: false, issues };
  }
}
