import { XalethorService } from '../xalor-service';
import type { ISolidRegistry } from '../models/types';
import { isMetaData } from '../utils';

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
// ## ⛏️ Category 1: Registration API (The Ingest Gates)

// **Role:**
// The declarative placeholders monitored by the build-time Miner. They contain zero runtime logic and are strictly used to safely feed the Vault.

// ### Current Implementations

// - `registerXalor<K, T>()`
//   Explicit interface mapping via generics.

// - `registerXalor<K>(data)`
//   Structural discovery via physical object type inference.

// ### Future Enterprise Additions

// - `registerXalorRemote(endpoint, options)`
//   Dynamic configuration placeholder telling the compiler to prepare for a runtime schema fetch from a centralized schema registry.

// - `registerXalorModule(plugin)`
//   Used to register third-party custom type reifiers or domain-specific type transformations at build time.
