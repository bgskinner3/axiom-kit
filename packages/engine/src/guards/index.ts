// /**
//  * @utilType Guard
//  * @name isHexByteString
//  *@category Guards Core
//  * @description Factory that creates a guard to validate if a string is a valid hex byte string, optionally enforcing length.
//  * @link #ishexbytestring
//  * Example usage:
//  * ```ts
//  * isHexString("0a1b2c"); // true
//  * isHexString("0a1b2z"); // false (invalid character 'z')
//  * isHexString("0a1b2c", 6); // true
//  * isHexString("0a1b2c", 8); // false (length mismatch)
//  * ```
//  */
// export const isHexByteString = (
//   expectedLength?: number,
// ): TTypeGuard<THexByteString> => {
//   return (value: unknown): value is THexByteString => {
//     if (!isNonEmptyString(value)) return false;
//     if (value.length % 2 !== 0) return false;
//     if (!REGEX_CONSTANTS.hexString.test(value)) return false;
//     if (!isUndefined(expectedLength) && value.length !== expectedLength)
//       return false;
//     return true;
//   };
// };
