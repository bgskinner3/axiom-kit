export type TSolidShape =
  | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
  | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
  | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
  | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidObjectRawShape> }
  | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
  | /* prettier-ignore */ { kind: 'reference'; name: string };

export type TSolidObjectRawShape = {
  shape: TSolidShape;
  optional: boolean;
  name: string;
};

export type TSolidMetadata = {
  key: string;
  area: string;
  version: string;
  shape: TSolidShape;
};

export type TSolidError = {
  key: string;
  /** The breadcrumb path to the failure (e.g., "settings.theme") */
  path: string;
  /** The human-readable issue */
  message: string;
  /** What the blueprint required */
  expected: string | TSolidShape;
  /** What the data actually contained */
  received: unknown;
  /** The file:line:char where this export type was defined processor */
  area?: string;
};

export type TSolidVaultMap = {
  /** The actual Type Database */
  items: Map<string, TSolidMetadata>;
  /** The Error Cache */
  errors: Map<string, TSolidError[]>;
};
declare const SolidBrand: unique symbol;
export type TSolid<K extends string, T> = T & {
  readonly [SolidBrand]: K;
};
