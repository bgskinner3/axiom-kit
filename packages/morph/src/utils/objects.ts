import { ObjectUtils, ArrayUtils } from '@axiom/core';
import { capitalizeString } from './strings';
/**
 * @utilType util
 * @name generateKeyMap
 * @category Object Transformers
 * @description Creates a typed mapping of original keys to transformed strings using a prefix/suffix pattern.
 * @link #generatekeymap
 *
 *
 * ### 📘 Example
 *
 * ```ts
 * const map = generateKeyMap({
 *   keys: ['name', 'email'] as const,
 *   prefix: 'get',
 *   suffix: 'Value',
 * });
 *
 * // Result:
 * // {
 * //   name: "getNameValue",
 * //   email: "getEmailValue"
 * // }
 * ```
 *
 * ---
 */
export const generateKeyMap = <
  K extends string,
  P extends string | undefined = undefined,
  S extends string = string,
>(data: {
  keys: readonly K[];
  prefix?: P;
  suffix: S;
}) => {
  const { keys, prefix, suffix } = data;

  const entries = ArrayUtils.map(keys, (key) => {
    const camel = prefix
      ? `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}${suffix}`
      : `${key.charAt(0).toLowerCase() + key.slice(1)}${suffix}`;

    return [key, camel] as [
      K,
      P extends string ? `${P}${Capitalize<K>}${S}` : `${K}${S}`,
    ];
  });

  return ObjectUtils.fromEntries(entries) satisfies Record<
    K,
    P extends string ? `${P}${Capitalize<K>}${S}` : `${K}${S}`
  >;
};
/**
 * @utilType util
 * @name toKeyByField
 * @category Object Transformers
 * @description Normalizes an array of objects into a record keyed by a specific field.
 * @link #tokeybyfield
 *
 * ---
 *
 * ### 📘 Example
 *
 * ```ts
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 *
 * const map = toKeyByField(users, 'id');
 *
 * // Result:
 * // {
 * //   1: { name: 'Alice' },
 * //   2: { name: 'Bob' }
 * // }
 * ```
 */
export const toKeyByField = <
  RowType extends Record<Key, string | number | symbol>,
  Key extends keyof RowType,
>(
  rows: RowType[],
  keyField: Key,
): Record<RowType[Key], Omit<RowType, Key>> => {
  return ObjectUtils.fromEntries<RowType[Key], Omit<RowType, Key>>(
    ArrayUtils.map(rows, (row) => {
      const key: RowType[Key] = row[keyField];
      const { [keyField]: _, ...rest } = row;
      return [key, rest] satisfies [RowType[Key], Omit<RowType, Key>];
    }),
  ) satisfies Record<RowType[Key], Omit<RowType, Key>>;
};
/**
 * @utilType util
 * @name capitalizeArray
 * @category Object Transformers
 * @description Capitalizes the first letter of every string in an array.
 * @link #capitalizearray
 * ---
 *
 * ### 📘 Example
 *
 * ```ts
 * capitalizeArray(['name', 'email']);
 *
 * // Result:
 * // ['Name', 'Email']
 * ```
 */
export const capitalizeArray = <T extends string>(
  arr: readonly T[],
): Capitalize<T>[] => ArrayUtils.map(arr, capitalizeString);
/**
 * @utilType util
 * @name capitalizedKeys
 * @category Object Transformers
 * @description Extracts and capitalizes an object's keys, filtering for those starting with letters.
 * @link #capitalizedkeys
 * ---
 *
 * ### 📘 Example
 *
 * ```ts
 * const user = {
 *   id: 1,
 *   name: 'Alice',
 * };
 *
 * capitalizedKeys(user);
 *
 * // Result:
 * // ['Id', 'Name']
 * ```
 */
export const capitalizedKeys = <T extends Record<string, unknown>>(
  obj: T,
): Capitalize<keyof T & string>[] =>
  capitalizeArray(
    ObjectUtils.keys(obj)
      .map(String) // Convert all keys to string
      .filter((key) => /^[A-Za-z]/.test(key)),
  );
