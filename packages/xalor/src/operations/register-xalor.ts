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
