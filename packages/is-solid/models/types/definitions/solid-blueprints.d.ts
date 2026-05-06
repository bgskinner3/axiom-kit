// models/types/definitions/solid-blueprints.d.ts
/**
 *  THE AMBIENT BLUEPRINTS
 * These are the serialized structures stored in the Vault.
 * They are global so they can be accessed by the Miner and the Engine.
 */
declare global {
  /**
   * BLUEPRINT (TSolidShape)
   *
   * A strict discriminated union representing the serialized "Solid" state of a TypeScript type.
   * This is the core data structure stored in the Ambient Type Database (The Vault).
   *
   * It allows the Runtime Engine to perform deep validation without access to
   * the original TypeScript source code or the Compiler API.
   */
  type TSolidShape =
    | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
    | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
    | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
    | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
    | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
    | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidObjectRawShape> }
    | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
    | /* prettier-ignore */ { kind: 'reference'; name: string };

  type TSolidObjectRawShape = {
    shape: TSolidShape;
    optional: boolean;
    name: string;
  };

  type TSolidMetadata = {
    key: string;
    area: string;
    version: string;
    shape: TSolidShape;
  };

  type TSolidError = {
    key: string;
    /** The breadcrumb path to the failure (e.g., "settings.theme") */
    path: string;
    /** The human-readable issue */
    message: string;
    /** What the blueprint required */
    expected: string | TSolidShape;
    /** What the data actually contained */
    received: unknown;
    /** The file:line:char where this type was defined processor */
    area?: string;
  };

  type TSolidVaultMap = {
    /** The actual Type Database */
    items: Map<string, TSolidMetadata>;
    /** The Error Cache */
    errors: Map<string, TSolidError[]>;
  };
  /** The Singleton on globalThis */
  var __SOLID_VAULT__: TSolidVaultMap | undefined;
}
export {};
