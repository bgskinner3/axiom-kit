/**
 * 💎 TSOLID SHAPE
 *
 * ROLE:
 * The recursive structural blueprint of a TypeScript type.
 *
 * STRATEGY:
 * A tagged union used by the Validator Engine to perform
 * structural checks at runtime.
 */
export type TSolidShape =
  | /* prettier-ignore */ { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'bigint' | 'unknown'; }
  | /* prettier-ignore */ { kind: 'literal'; value: string | number | boolean }
  | /* prettier-ignore */ { kind: 'union'; values: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'intersection'; parts: TSolidShape[] }
  | /* prettier-ignore */ { kind: 'branded'; name: string; base: TSolidShape }
  | /* prettier-ignore */ { kind: 'object'; properties: Record<string, TSolidObjectRawShape> }
  | /* prettier-ignore */ { kind: 'array'; items: TSolidShape }
  | /* prettier-ignore */ { kind: 'reference'; name: string };

/**
 * 📦 TSOLID OBJECT RAW SHAPE
 *
 * Represents a single property within an object blueprint,
 * including its optionality status.
 */
export type TSolidObjectRawShape = {
  shape: TSolidShape;
  optional: boolean;
  name: string;
};
