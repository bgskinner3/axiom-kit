import type { TTypeGuard } from '@axiom/utility-types';
import {isNonEmptyString, isString} from './primitives'

// /**
//  * @utilType Guard
//  * @name isJSONArrayString
//  *@category Guards Core
//  * @description Verifies if a string is a valid JSON-serialized array.
//  * @link #isjsonarraystring
//  */
// export const isJSONArrayString: TTypeGuard<TJSONArrayString> = (
//   value: unknown,
// ): value is TJSONArrayString => {
//   if (!isNonEmptyString(value)) return false;
//   try {
//     return Array.isArray(JSON.parse(value));
//   } catch {
//     return false;
//   }
// };
// /**
//  * @utilType Guard
//  * @name isJSONObjectString
//  *@category Guards Core
//  * @description Verifies if a string is a valid JSON-serialized object.
//  * @link #isjsonobjectstring
//  */
// export const isJSONObjectString: TTypeGuard<TJSONObjectString> = (
//   value: unknown,
// ): value is TJSONObjectString => {
//   if (!isNonEmptyString(value)) return false;
//   try {
//     const parsed = JSON.parse(value);
//     return (
//       typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
//     );
//   } catch {
//     return false;
//   }
// };

// /**
//  * @utilType Guard
//  * @name isHTMLString
//  *@category Guards Core
//  * @description Checks if a string contains HTML tags using regex detection.
//  * @link #ishtmlstring
//  */
// export const isHTMLString: TTypeGuard<string> = (
//   value: unknown,
// ): value is string => {
//   return isString(value) && REGEX_CONSTANTS.htmlDetection.test(value);
// };

// /**
//  * @utilType Guard
//  * @name isPhoneNumber
//  * @category Guards Core
//  * @description Validates a string against common US, EU, and generic phone number regex patterns.
//  * @link #isphonenumber
//  *
//  * ### 📘 Example Usage
//  * ```ts
//  * isPhoneNumber('+1-202-555-0101'); // true
//  * isPhoneNumber('06 12 34 56 78');    // true
//  * isPhoneNumber('123-abc');           // false
//  * ```
//  */
// export const isPhoneNumber: TTypeGuard<string> = (
//   value: unknown,
// ): value is string => {
//   if (!isNonEmptyString(value)) return false;

//   return [
//     REGEX_CONSTANTS.USPhoneNumber,
//     REGEX_CONSTANTS.EUPhoneNumber,
//     REGEX_CONSTANTS.genericPhoneNumber,
//   ].some((regex) => regex.test(value));
// };

// /**
//  * @utilType Guard
//  * @name isEmail
//  * @category Guards Core
//  * @description Validates if a string follows a standard email format using regex.
//  * @link #isemail

//  *
//  * ### 📘 Example Usage
//  * ```ts
//  * isEmail('hello@world.com'); // true
//  * isEmail('invalid-email@');   // false
//  * isEmail(12345);              // false
//  * ```
//  */
// export const isEmail: TTypeGuard<string> = (
//   value: unknown,
// ): value is string => {
//   return isString(value) && REGEX_CONSTANTS.emailRegex.test(value);
// };
