// import { XALOR_MESSAGE_HANDLER } from './msg';
// import { XalethorVault } from '../xalor-vault';
import { ensureGlobalVault } from '../utils';
import type { TSolidError, TSolidVaultMap } from '../models/types';

/**
 * 🕵️‍♂️ XALETHOR AUDITOR
 *
 * The system's central inspector. It monitors the health of the
 * Triple-KV Archive and records validation failures in the Vault.
 */
class XalorAuditor {
  // private static get errorVault(): TSolidVaultMap['errors'] {
  //   return ensureGlobalVault().errors;
  // }
  // public static getErrors(key: string): TSolidError[] {
  //   return this.errorVault.get(key) ?? [];
  // }
  // public static clearErrors(key?: string): void {
  //   if (key) this.errorVault.delete(key);
  //   if (!key) this.errorVault.clear();
  // }
  // /**
  //  * Internal: Sets the errors for a specific key in the errors map.
  //  */
  // public static setErrors(key: string, errors: TSolidError[]): void {
  //   this.errorVault.set(key, errors);
  // }
  // public static record(error: TSolidError): void {
  //   const currentErrors = this.getErrors(error.key);
  //   currentErrors.push(error);
  //   this.setErrors(error.key, currentErrors);
  // }
  // /**
  //  * 📑 SCAN (Dev Tool)
  //  * Diagnostic table showing the health of the Triple-KV Archive.
  //  */
  // // public static scan(): void {
  // //   const keys = XalethorVault.keys();
  // //   if (keys.length === 0) {
  // //     console.log('\n[xalor-audit] 📭 The Archive is empty.\n');
  // //     return;
  // //   }
  // //   const inventory = keys.map((key) => ({
  // //     /* prettier-ignore */ 'Key 🔑': key,
  // //     /* prettier-ignore */ 'Symbol 🆔': XalethorVault.vaultArchive('registry', key) || '⚠️ MISSING',
  // //     /* prettier-ignore */ 'Location 📍': XalethorVault.vaultArchive('manifest', key) || '⚠️ UNKNOWN',
  // //     /* prettier-ignore */ 'Kind 🏗️': XalethorVault.vaultArchive('blueprint', key)?.kind || '❌ BROKEN',
  // //   }));
  // //   console.log('\n--- 🏛️ XALETHOR ARCHIVE AUDIT ---');
  // //   console.table(inventory);
  // // }
  // /**
  //  * 📑 SCAN (Diagnostic Tool)
  //  *
  //  * Performs a physical inspection of the Triple-KV Archive.
  //  * Prints a high-definition table of all solidified types.
  //  */
  // public static scan(): void {
  //   // 💎 We use our XalethorVault keys to get the truth
  //   const keys = XalethorVault.keys();
  //   if (keys.length === 0) {
  //     console.log('\n[xalor-audit] 📭 The Archive is currently empty.\n');
  //     return;
  //   }
  //   const inventory = keys.map((key) => {
  //     // 📍 Using your resolve logic for the GPS Coordinates
  //     const location = XalethorVault.vaultArchive('manifest', key);
  //     const symbol = XalethorVault.vaultArchive('registry', key);
  //     const blueprint = XalethorVault.vaultArchive('blueprint', key);
  //     return {
  //       'Key 🔑': key,
  //       'Symbol 🆔': symbol || '⚠️ UNKNOWN',
  //       'Location 📍': location || '⚠️ UNKNOWN',
  //       'Kind 🏗️': blueprint?.kind || '❌ BROKEN',
  //     };
  //   });
  //   console.log('\n--- 🏛️ XALETHOR ARCHIVE AUDIT ---');
  //   console.table(inventory);
  //   console.log(`Total Solidified: ${keys.length}\n`);
  // }
  // /**
  //  * 🔍 DIAGNOSE (Dev Tool)
  //  * Prints active runtime errors for a specific key.
  //  */
  // public static diagnose(key: string): void {
  //   const errors = this.getErrors(key);
  //   if (errors.length === 0) {
  //     console.log(`[xalor-audit] No active errors for key: ${key}`);
  //     return;
  //   }
  //   console.warn(`\n--- 🕵️‍♂️ DISCREPANCY REPORT: ${key} ---`);
  //   console.table(errors);
  // }
}

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

/**
 *
 * Retrieves the last validation error(s) for a specific key.
 */
// public static getErrors(key: string): TSolidError[] {
//   return getGlobalVault()?.errors.get(key) ?? [];
// }

// /**
//  * Internal: Sets the errors for a specific key in the errors map.
//  */
// public static setErrors(key: string, errors: TSolidError[]): void {
//   const vault = ensureGlobalVault();
//   vault.errors.set(key, errors);
// }
// // XalorAuditor
// TEMP
export * from './msg';

/**
 I. registration phase 
    - inilized via xalor<>() ... whcih the triggers the utulization of our transformaer ...
     gathering the type, location , name, symbol and so on...
     THOUGHT: our transformer shoudl have the TRUEshape of the individual types... 
     -  
 */
