// import { XALOR_MESSAGE_HANDLER } from './msg';
/**
 *
 *
 *
 *
 */
// export class XalorAuditor {}
/**
 EXAMLPE 


 class SolidAudit {
  public readonly errors: TSolidError[] = [];
  public readonly startTime: number = Date.now();

  constructor(public readonly key: string) {}


  public record(
    path: string, 
    expected: any, 
    received: any
  ): false {
    this.errors.push({
      key: this.key,
      path,
      message: SOLID_MESSAGES.TYPE_MISMATCH(path, expected, received),
      expected: serialize(expected),
      received: serialize(received),
      area: getCallerLocation({ preferredIndex: 4 }),
    });
    return false;
  }

  public deliver() {
    return {
      valid: this.errors.length === 0,
      count: this.errors.length,
      details: this.errors,
      duration: Date.now() - this.startTime
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
