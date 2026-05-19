import { XalethorService } from '../xalor-service';
import type { ISolidRegistry } from '../models/types';
import { isMetaData } from '../../shared';

export function registerXalor<
  _K extends keyof ISolidRegistry | (string & {}),
  _T,
>(): void;
/** II. REGISTRATION: Via Data Inference (Argument) */
export function registerXalor<_K extends keyof ISolidRegistry | (string & {})>(
  data: unknown,
): void;
export function registerXalor(params?: unknown): void {
  /**
   * THE GHOST CHECK
   *
   * If the Transformer ran correctly, 'params' is no longer the 'data' object.
   * It has been rewritten into a TSolidMetadata object.
   */
  if (isMetaData(params)) {
    return XalethorService.solidify(params);
  }

  /**
   * 💨 BAILOUT
   * If this code is reached in Production and 'isMetaData' is false:
   * 1. The Transformer was not configured.
   * 2. This file was skipped by the Scout.
   * 3. We are in a 'Volatile' environment.
   */
  return;
}

/**
 * ============================================================================
 * 🧬 REGISTER XALOR API STRATEGY SPECIFICATIONS
 * ============================================================================
 *
 * I. DECLARATIVE TYPE REGISTRATION (Overload 1)
 * - WHAT IT DOES:
 *   Establishes an authoritative type blueprint inside the global bunker database.
 * - HOW IT WORKS:
 *   The build-time transformer intercepts the generic `<'KEY', Type>` slots,
 *   deeply mines the hidden structural layout nodes, and compiles a comprehensive
 *   JSON metadata object. This blueprint object literal is injected directly back into
 *   the physical parameter slot of this function call.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   interface IUser { id: number; username: string; }
 *   registerXalor<'USER_PROFILE', IUser>();
 *   // Compiles completely away to an inline metadata registration payload argument pass!
 *   ```
 *
 * ============================================================================
 * II. RUNTIME DATA INFERENCE REGISTRATION (Overload 2)
 * - WHAT IT DOES:
 *   Registers and solidifies a blueprint graph derived directly from an existing runtime object.
 * - HOW IT WORKS:
 *   The compiler's target extractor sniffs the first physical parameter variable passed by
 *   the developer. It resolves its matching type footprint via the compiler's TypeChecker
 *   and flushes the reified schema tree out to disk, replacing the raw object variable argument
 *   with the pre-baked metadata envelop block.
 * - HOW TO USE:
 *   @example
 *   ```ts
 *   const devConfig = { environment: 'production', clusterNodes: [1, 2, 3] };
 *   registerXalor<'APP_CONFIG'>(devConfig);
 *   // Captures the shape of devConfig at build time and transforms the code parameters inline.
 *   ```
 */
