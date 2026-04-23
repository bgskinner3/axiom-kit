export const REGEX_DATE_PATTERNS = {
  /**
   *  @example `2023-10-27T10:30:00Z`
   * @description
   * Matches a full ISO 8601 date-time string (e.g., `2023-10-27T10:30:00Z`).
   * Supports optional milliseconds and time zone offsets.
   *
   * @pattern
   * `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$`
   */
  /* prettier-ignore */ isoDate: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$',
  /**
   * **Dashed YMD**
   *
   * Matches a standard ISO-style date without time.
   * @example `2003-08-06`
   * @pattern `^\d{4}-\d{2}-\d{2}$`
   */
  /* prettier-ignore */ dashedYMDDate: '^\\d{4}-\\d{2}-\\d{2}$',
  /**
   * **Slashed (Flexible)**
   *
   * Matches dates using forward slashes. Supports 1-2 digit days/months
   * and 2 or 4 digit years.
   * @example `12/31/99` or `1/1/2024`
   * @pattern `^(\d{1,2})\/(\d{1,2})\/(\d{2}|(19|20)\d{2})$`
   */
  /* prettier-ignore */ slashedDate: '^(\\d{1,2})\\/(\\d{1,2})\\/(\\d{2}|(19|20)\\d{2})$',
  /**
   * **Slashed DMY (Strict)**
   *
   * Specifically matches Day/Month/Year format with 4-digit years (1900-2099).
   * @example `31/12/2023`
   * @pattern `^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\d\d)$`
   */
  /* prettier-ignore */ slashedDMYDate: '^(0?[1-9]|[12][0-9]|3[01])\\/(0?[1-9]|1[012])\\/((19|20)\\d\\d)$',
  /**
   * **Short Month**
   *
   * Matches dates with abbreviated month names.
   * @example `Jan 3, 2003`
   * @pattern `^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$`
   */
  /* prettier-ignore */ shortMonthDate: '^[A-Z][a-z]{2}\\s\\d{1,2},\\s\\d{4}$',
  /**
   * **Time 12-Hour**
   *
   * Matches 12-hour clock format with optional space before AM/PM.
   * @example `12:59 PM` or `9:00am`
   * @pattern `^(1[012]|[1-9]):[0-5][0-9](\s)?[aApP][mM]$`
   */
  /* prettier-ignore */ time12hDate: '^(1[012]|[1-9]):[0-5][0-9](\\s)?[aApP][mM]$',
  /**
   * **Time 24-Hour**
   *
   * Matches military/24-hour clock format.
   * @example `23:59` or `08:00`
   * @pattern `^([01]?[0-9]|2[0-3]):[0-5][0-9]$`
   */
  /* prettier-ignore */ time24hDate: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
} as const;