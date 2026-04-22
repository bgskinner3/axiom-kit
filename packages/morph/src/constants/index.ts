const REGEX_CONSTANTS = {
  isoRegex:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
  camelCase: /^[a-z]+(?:[A-Z][a-z0-9]*)*$/,
  kebabCase: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  snakeCase: /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
  hexString: /^[0-9a-fA-F]+$/,
  hexColor: /^[0-9A-Fa-f]{6}$/,
  letterSeparator: /[^A-Za-z]+/g,
  camelCaseBoundary: /(?:^\w|[A-Z]|\b\w)/g,
  kebabCaseBoundary: /([a-z0-9])([A-Z])/g,
} as const;
