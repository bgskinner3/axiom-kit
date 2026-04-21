/**
 *  @example `2023-10-27T10:30:00Z`
 * @description
 * Matches a full ISO 8601 date-time string (e.g., `2023-10-27T10:30:00Z`).
 * Supports optional milliseconds and time zone offsets.
 *
 * @pattern
 * `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$`
 */
/* prettier-ignore */ const ISO_REGEX_DATE = '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$'

/**
 * **Dashed YMD**
 *
 * Matches a standard ISO-style date without time.
 * @example `2003-08-06`
 * @pattern `^\d{4}-\d{2}-\d{2}$`
 */
/* prettier-ignore */ const DASHED_YMD_STR = '^\\d{4}-\\d{2}-\\d{2}$';
/**
 * **Slashed (Flexible)**
 *
 * Matches dates using forward slashes. Supports 1-2 digit days/months
 * and 2 or 4 digit years.
 * @example `12/31/99` or `1/1/2024`
 * @pattern `^(\d{1,2})\/(\d{1,2})\/(\d{2}|(19|20)\d{2})$`
 */
/* prettier-ignore */ const SLASHED_STR = '^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{2}|(19|20)\\d{2})$';
/**
 * **Slashed DMY (Strict)**
 *
 * Specifically matches Day/Month/Year format with 4-digit years (1900-2099).
 * @example `31/12/2023`
 * @pattern `^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\d\d)$`
 */
/* prettier-ignore */ const SLASHED_DMY_STR = '^(0?[1-9]|[12][0-9]|3[01])\\/(0?[1-9]|1[012])\\/((19|20)\\d\\d)$';
/**
 * **Short Month**
 *
 * Matches dates with abbreviated month names.
 * @example `Jan 3, 2003`
 * @pattern `^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$`
 */
/* prettier-ignore */ const SHORT_MONTH_STR = '^[A-Z][a-z]{2}\\s\\d{1,2},\\s\\d{4}$';
/**
 * **Time 12-Hour**
 *
 * Matches 12-hour clock format with optional space before AM/PM.
 * @example `12:59 PM` or `9:00am`
 * @pattern `^(1[012]|[1-9]):[0-5][0-9](\s)?[aApP][mM]$`
 */
/* prettier-ignore */ const TIME_12H_STR = '^(1[012]|[1-9]):[0-5][0-9](\\s)?[aApP][mM]$';

/**
 * **Time 24-Hour**
 *
 * Matches military/24-hour clock format.
 * @example `23:59` or `08:00`
 * @pattern `^([01]?[0-9]|2[0-3]):[0-5][0-9]$`
 */
/* prettier-ignore */ const TIME_24H_STR = '^([01]?[0-9]|2[0-3]):[0-5][0-9]$';

export const REGEX_DATE_PATTERNS = {
  isoDate: ISO_REGEX_DATE,
  dashedYMDDate: DASHED_YMD_STR,
  slashedDate: SLASHED_STR,
  slashedDMYDate: SLASHED_DMY_STR,
  shortMonthDate: SHORT_MONTH_STR,
  time12hDate: TIME_12H_STR,
  time24hDate: TIME_24H_STR,
} as const;
/**
 export const REGEX_DATE_PATTERNS = {
  iso: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
  dashedYMD: /^\d{4}-\d{2}-\d{2}$/, // 2003-08-06
  slashed: /^(\d{1,2})\/(\d{1,2})\/(\d{2}|(19|20)\d{2})$/, // DD/MM/YY or MM/DD/YYYY
  slashedDMY: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\d\d)$/,
  shortMonth: /^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/, // Jan 3, 2003
  time12h: /^(1[012]|[1-9]):[0-5][0-9](\s)?[aApP][mM]$/,
  time24h: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;
 */
