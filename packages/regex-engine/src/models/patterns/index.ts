// import { REGEX_DATE_PATTERNS } from './date';
// import { REGEX_COLOR_PATTERNS } from './color';


// const PATTERN_SOURCE = {
//   ...REGEX_COLOR_PATTERNS,
//   ...REGEX_DATE_PATTERNS,
// } as const;

// export const REGEX_PRE_REGISTRY = createRegexRegistry(PATTERN_SOURCE);
// export type TPreRegistry = typeof REGEX_PRE_REGISTRY;
// export type TRegexKey = keyof typeof REGEX_PRE_REGISTRY
// // Type helper for the Class
// export type TPreRegistry = typeof REGEX_PRE_REGISTRY;

// export const REGEX_PARSER_PATTERNS = {
//   letterSeparator: /[^A-Za-z]+/g,
//   camelBoundary: /(?:^\w|[A-Z]|\b\w)/g,
//   kebabBoundary: /([a-z0-9])([A-Z])/g,
//   wordBoundary: /[^A-Za-z0-9]+/g,
//   whitespace: /\s+/g,
//   stackTrace: /^\s*at\s+/,
// } as const;

// export const REGEX_CASE_PATTERNS = {
//   camel: /^[a-z]+(?:[A-Z][a-z0-9]*)*$/,
//   kebab: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//   snake: /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
// } as const;
// export const REGEX_WEB_PATTERNS = {
//   email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
//   emailList: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?:\s*;\s*)?)*$/,
//   url: /^http(s)?:\/\/((\d+\.\d+\.\d+\.\d+)|(([\w-]+\.)+([a-z,A-Z][\w-]*)))(:[1-9][0-9]*)?(\/([\w-.\/:%+@&=]+[\w- .\/?:%+@&=]*)?)?(#(.*))?$/i,
//   imgSrc: /<img[^>]+src="([^">]+)"/i,
//   ipV4: /^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/,
//   fileImage: /([^\s]+(\.(?i)(jpg|png|gif|bmp))$)/,
// } as const;

// export const REGEX_PHONE_PATTERNS = {
//   us: /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
//   eu: /^\+?\d{1,4}[\s.-]?\d{2,4}([\s.-]?\d{2,4}){1,3}$/,
//   generic: /^\+?(\d[\d\s-().]{6,}\d)$/,
// } as const;

// const REGEX_CONSTANTS = {
//   camelCase: /^[a-z]+(?:[A-Z][a-z0-9]*)*$/,
//   kebabCase: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//   snakeCase: /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
//   hexString: /^[0-9a-fA-F]+$/,
//   hexColor: /^[0-9A-Fa-f]{6}$/,
//   letterSeparator: /[^A-Za-z]+/g,
//   camelCaseBoundary: /(?:^\w|[A-Z]|\b\w)/g,
//   kebabCaseBoundary: /([a-z0-9])([A-Z])/g,
//   whitespace: /\s+/g,
//   wordBoundarySplitter: /[^A-Za-z0-9]+/g,
//   USPhoneNumber: /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/,
//   EUPhoneNumber: /^\+?\d{1,4}[\s.-]?\d{2,4}([\s.-]?\d{2,4}){1,3}$/,
//   genericPhoneNumber: /^\+?(\d[\d\s-().]{6,}\d)$/,
//   genericEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//   emailRegex:
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
//   imageSrcRegex: /<img[^>]+src="([^">]+)"/i,
//   singleAlphabetChar: /^[a-zA-Z]$/,
//   // htmlDetection: new RegExp(
//   //   `<\\/?(${SAFE_HTML_TAGS.join('|')})\\b[^>]*>|&[a-z]+;`,
//   //   'i',
//   // ),
//   stackTracePrefix: /^\s*at\s+/,
// } as const;

// file extension
// ([^\s]+(\.(?i)(jpg|png|gif|bmp))$)

// ip address
// ^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.
// ([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$

// timeformat
// (1[012]|[1-9]):[0-5][0-9](\\s)?(?i)(am|pm)

// 24 hour format
// ([01]?[0-9]|2[0-3]):[0-5][0-9]

// Date Format (dd/mm/yyyy)
// (0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/((19|20)\\d\\d)

// [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}				//2003-08-06
// [A-Z][a-z][a-z] [0-9][0-9]*, [0-9]\{4\}				//Jan 3, 2003
// ^(\d{1,2})\/(\d{1,2})\/(\d{2}|(19|20)\d{2})$			//DD/MM/YY or DD/MM/YYYY or MM/DD/YY or MM/DD/YYYY

// html link regular expreesion ?
// add list ?

// url ?
// ^http(s)?:\/\/((\d+\.\d+\.\d+\.\d+)|(([\w-]+\.)+([a-z,A-Z][\w-]*)))(:[1-9][0-9]*)?(\/([\w-.\/:%+@&=]+[\w- .\/?:%+@&=]*)?)?(#(.*))?$/i

/**
 	^[\\w\\-]+(\\.[\\w\\-]+)*@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}$
	^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$ 
	^([\w\.*\-*]+@([\w]\.*\-*)+[a-zA-Z]{2,9}(\s*;\s*[\w\.*\-*]+@([\w]\.*\-*)+[a-zA-Z]{2,9})*)$	//List of semi-colon seperated email addresses
	^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$
 */

// new hex ?
// ^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$

/**
   export const whiteSpaceChars = [
  singleton('\f'),
  singleton('\n'),
  singleton('\r'),
  singleton('\t'),
  singleton('\v'),
  singleton('\u0020'),
  singleton('\u00a0'),
  singleton('\u1680'),
  charRange('\u2000', '\u200a'),
  singleton('\u2028'),
  singleton('\u2029'),
  singleton('\u202f'),
  singleton('\u205f'),
  singleton('\u3000'),
  singleton('\ufeff'),
].reduce(union)

   */

/**
 FINAL 
 */
/**
 * Matches all standard and Unicode whitespace characters.
 * Includes tabs, newlines, and non-breaking spaces.
 *
 * @pattern `[\f\n\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]`
 */
// export const WHITESPACE_REGEX_STR =
//   '[\\f\\n\\r\\t\\v\\u0020\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]';
// export const WHITESPACE_UNICODE_REGEX = /\p{White_Space}/u; // ??
// ///
// export const REGEX_PRE_REGISTRY = {
//   whitespace: WHITESPACE_REGEX_STR,
//   camel: /^[a-z]+(?:[A-Z][a-z0-9]*)*$/,
//   kebab: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
//   snake: /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
//   hexString: /^[0-9a-fA-F]+$/,
//   singleAlphabet: /^[a-zA-Z]$/,
// } as const;

// const test = REGEX_PRE_REGISTRY.whitespace;
