export const REGEX_COLOR_PATTERNS = {
  /**
   * **Hex Strict**
   *
   * Matches exactly 6 hexadecimal characters witt the '#' prefix.
   * @example `FF5733`
   * @pattern `^[0-9A-Fa-f]{6}$`
   */
  /* prettier-ignore */ hexStrict: '^#?[0-9A-Fa-f]{6}$',
  /**
   * **Hex Shorthand (Comprehensive)**
   *
   * Matches #rgb, #rgba, #rrggbb, and #rrggbbaa with optional '#' prefix.
   * @example `#FFF`, `#FF00AA`, `#000000FF`
   * @pattern `^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$`
   */
  /* prettier-ignore */ hexShorthand: '^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$',
  /**
   * **Hex Shorthand Only (3-digit)**
   *
   * Specifically for conversion logic targeting 3-digit hex codes.
   * @example `#ABC` -> `#AABBCC`
   * @pattern `^#?([a-f\d])([a-f\d])([a-f\d])$`
   */
  /* prettier-ignore */ hexShorthandOnly: '^#?([a-f\\d])([a-f\\d])([a-f\\d])$',
  /**
   * **Hex Full Only (6-digit)**
   *
   * Specifically captures the three 2-digit channels for R, G, and B.
   * @pattern `^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$`
   */
  /* prettier-ignore */ hexFullOnly: '^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$',
  /**
   * **RGB Format**
   *
   * Matches standard functional RGB notation.
   * @example `rgb(255, 0, 128)`
   * @pattern `^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$`
   */
  /* prettier-ignore */ rgbFormat: '^rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)$',
  /**
   * **RGBA Format**
   *
   * Matches functional RGBA notation including the alpha channel (0-1).
   * @example `rgba(255, 0, 0, 0.5)`
   * @pattern `^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$`
   */
  /* prettier-ignore */ rgbAFormat: '^rgba\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(0|1|0?\\.\\d+)\\s*\\)$',

  /* prettier-ignore */ colorHex: '^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$',
} as const;
