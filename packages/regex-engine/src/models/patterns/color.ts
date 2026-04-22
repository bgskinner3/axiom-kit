/**
 * **Hex Strict**
 *
 * Matches exactly 6 hexadecimal characters without the '#' prefix.
 * @example `FF5733`
 * @pattern `^[0-9A-Fa-f]{6}$`
 */
/* prettier-ignore */ const HEX_STRICT_STR = '^[0-9A-Fa-f]{6}$';

/**
 * **Hex Shorthand (Comprehensive)**
 *
 * Matches #rgb, #rgba, #rrggbb, and #rrggbbaa with optional '#' prefix.
 * @example `#FFF`, `#FF00AA`, `#000000FF`
 * @pattern `^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$`
 */
/* prettier-ignore */ const HEX_SHORTHAND_STR = '^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$';

/**
 * **Hex Shorthand Only (3-digit)**
 *
 * Specifically for conversion logic targeting 3-digit hex codes.
 * @example `#ABC` -> `#AABBCC`
 * @pattern `^#?([a-f\d])([a-f\d])([a-f\d])$`
 */
/* prettier-ignore */ const HEX_SHORTHAND_ONLY_STR = '^#?([a-f\\d])([a-f\\d])([a-f\\d])$';

/**
 * **Hex Full Only (6-digit)**
 *
 * Specifically captures the three 2-digit channels for R, G, and B.
 * @pattern `^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$`
 */
/* prettier-ignore */ const HEX_FULL_ONLY_STR = '^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$';

/**
 * **RGB Format**
 *
 * Matches standard functional RGB notation.
 * @example `rgb(255, 0, 128)`
 * @pattern `^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$`
 */
/* prettier-ignore */ const RGB_FORMAT_STR = '^rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)$';

/**
 * **RGBA Format**
 *
 * Matches functional RGBA notation including the alpha channel (0-1).
 * @example `rgba(255, 0, 0, 0.5)`
 * @pattern `^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$`
 */
/* prettier-ignore */ const RGBA_FORMAT_STR = '^rgba\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(0|1|0?\\.\\d+)\\s*\\)$';
export const REGEX_COLOR_PATTERNS = {
  hexStrict: HEX_STRICT_STR,
  hexShorthand: HEX_SHORTHAND_STR,
  hexShorthandOnly: HEX_SHORTHAND_ONLY_STR,
  hexFullOnly: HEX_FULL_ONLY_STR,
  rgbFormat: RGB_FORMAT_STR,
  rgbAFormat: RGBA_FORMAT_STR,
} as const;

// export const REGEX_COLOR_PATTERNS = {
//   // hexStrict: /^[0-9A-Fa-f]{6}$/,
//   // hexShorthand: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
//   hexStrict: /^[0-9A-Fa-f]{6}$/,
//   // Supports #rgb, #rgba, #rrggbb, #rrggbbaa
//   hexShorthand:
//     /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/,
//   // Specifically for the conversion logic you shared
//   hexShorthandOnly: /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
//   hexFullOnly: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,

//   rgbFormat: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
//   rgbaFormat:
//     /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/,
// } as const;
//  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i
// /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
