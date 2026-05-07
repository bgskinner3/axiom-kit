// import { XALOR_MESSAGE_HANDLER } from './msg';
/**
 *
 *
 *
 *
 */
// export class XalorAuditor {}

/**
 * 🕵️‍♂️ XALOR AUDITOR
 *
 * A high-performance state machine that tracks validation failures
 * across a type graph. It provides deterministic "Breadcrumb" paths
 * to pinpoint exactly where data deviates from the Solid Blueprint.
 */
/**
 EXAMLPE 


export class XalorAuditor {
  public readonly errors: TSolidError[] = [];
  public readonly startTime: number = Date.now();

  constructor(public readonly key: string) {}

   * 🚩 RECORD
   * Logs a specific deviation in the data. 
   * Always returns 'false' to allow for: return auditor.record(...)
  public record(
    path: string,
    expected: string | TSolidShape,
    received: unknown
  ): false {
    this.errors.push({
      key: this.key,
      path: path || '$',
      message: `Validation failed at ${path || 'root'}`,
      expected: serialize(expected),
      received: serialize(received),
      // 💎 Traceability: Points to the file:line that triggered the audit
      area: getCallerLocation({ preferredIndex: 4 }),
    });

    return false;
  }

   * 📦 DELIVER
   * Finalizes the audit and returns the full failure manifest.
  public deliver() {
    return {
      valid: this.errors.length === 0,
      count: this.errors.length,
      details: this.errors,
      duration: `${Date.now() - this.startTime}ms`,
      key: this.key,
    };
  }
}
 */
// src/validation/errors.ts
// import type { TValidationContext, TSolidShape } from '../models/types';
// import { serialize, getCallerLocation } from '../utils';
// /**
//  * Records a validation failure into the current context.
//  * Returns false to allow for: return reportError(...)
//  */
// export function reportError(
//   ctx: TValidationContext,
//   expected: string | TSolidShape,
//   received: unknown,
// ): false {
//   const caller = getCallerLocation({ preferredIndex: 4 });
//   ctx.errors.push({
//     key: ctx.currentKey || 'unknown',
//     path: ctx.path,
//     message: `Validation failed at ${ctx.path}`,
//     expected: serialize(expected),
//     received: serialize(received),
//     area: caller,
//   });
//   return false;
// }
// // XalorAuditor
