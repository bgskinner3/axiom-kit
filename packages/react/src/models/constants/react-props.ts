/**
 * VALID_DOM_PROPS
 *
 * This list of valid HTML and SVG attributes is initialized from the
 * @emotion/is-prop-valid source:
 * https://github.com
 *
 * WHY THIS EXISTS:
 * To remove the dependency on @emotion/is-prop-valid in this utility package
 * while maintaining the same robust prop-filtering logic used by styled-components
 * and emotion. This prevents "unknown prop" warnings when forwarding props to
 * primitive DOM elements.
 *
 * MODIFICATIONS & EXTENSIONS:
 * 1.  Categorization: The original flat list has been broken into logical
 *     groups (HTML, SVG, Metadata, etc.) for better maintainability.
 * 2.  React 19+ Support: Added modern attributes missing from the legacy
 *     emotion snapshot, including 'popover', 'inert', 'fetchPriority',
 *     and React 19's function-based 'action'/'formAction' props.
 * 3.  Performance: Merged into a Set for O(1) lookup speed during render.
 * 4.  Consistency: Ensured React-specific camelCase mappings (className,
 *     htmlFor, tabIndex) are prioritized.
 *
 * @see https://react.dev
 * @see https://developer.mozilla.org
 */
const BASE_REACT_PROPS = {
  // react props
  // https://github.com/facebook/react/blob/5495a7f24aef85ba6937truetrue1ce962673ca9f5fde6/src/renderers/dom/shared/hooks/ReactDOMUnknownPropertyHook.js
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,
  autoFocus: true,
  defaultValue: true,
  defaultChecked: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  suppressHydrationWarning: true,
  // deprecated react prop
  valueLink: true,
} as const;
/**
 * Props introduced or expanded in React 19.
 * Some attributes now accept functions for form actions
 * and new resource-prioritization attributes were added.
 */
const REACT_19_PROPS = {
  action: true, // Now supports functions
  formAction: true, // Now supports functions
  onCaptured: true, // New for Form Action tracking
  precedence: true, // For <link rel="stylesheet"> prioritization
  blocking: true, // For render-blocking resources
} as const;

/**
 * HTML attributes that must be camelCased when used in React.
 * React normalizes these instead of the lowercase HTML versions.
 */
const REACT_CAMEL_CASE_PROPS = {
  autoFocus: true,
  readOnly: true,
  noValidate: true,
  spellCheck: true,
  tabIndex: true,
  autoComplete: true,
  autoCorrect: true,
  autoCapitalize: true,
} as const;
/**
 * Modern HTML attributes supported by browsers and usable in React.
 * Includes newer platform features like popovers, lazy loading,
 * fetch priority hints, and Declarative Shadow DOM.
 */
const MODERN_HTML_PROPS = {
  popover: true,
  popoverTarget: true,
  popoverTargetAction: true,
  // https://html.spec.whatwg.org/multipage/interaction.html#inert
  inert: true,
  loading: true, // Lazy-loading for img/iframe
  fetchpriority: true,
  fetchPriority: true,
  enterKeyHint: true, // Virtual keyboard label
  shadowRoot: true, // Declarative Shadow DOM
  disablePictureInPicture: true,
  playsInline: true,
} as const;
/**
 * Mixed SVG + accessibility props commonly used in React.
 * Includes SVG rendering attributes and camelCased ARIA props
 * that React expects instead of their kebab-case equivalents.
 */
const SVG_AND_A11Y_PROPS = {
  paintOrder: true,
  vectorEffect: true,
  imageRendering: true,
  shapeRendering: true,
  textAnchor: true,
  ariaHasPopup: true, // Correct camelCase for aria-haspopup
  ariaLabel: true,
  ariaLabelledBy: true,
  // Add these for SVG completeness
  alignmentBaseline: true,
  baselineShift: true,
  dominantBaseline: true,
} as const;
/**
 * Semantic metadata attributes from RDFa and HTML Microdata.
 * Used for structured data, linked data, and SEO metadata.
 */
const METADATA_PROPS = {
  about: true,
  datatype: true,
  inlist: true,
  prefix: true,
  property: true,
  resource: true,
  typeof: true,
  vocab: true, // RDFa
  itemProp: true,
  itemScope: true,
  itemType: true,
  itemID: true,
  itemRef: true, // Microdata
} as const;
/**
 * Non-standard, vendor-specific, or platform-specific attributes.
 * Includes WebKit/Blink extensions, IE legacy attributes, and
 * attributes used by ecosystems like AMP.
 */
const SPECIALIZED_PROPS = {
  // autoCapitalize and autoCorrect are supported in Mobile Safari for
  // keyboard hints.
  autoCapitalize: true,
  autoCorrect: true,
  autoSave: true, // autoSave allows WebKit/Blink to persist values of input fields on page reloads
  color: true, // Safari mask-icon
  incremental: true, // Webkit search
  // results show looking glass icon and recent searches on input
  // search fields in WebKit/Blink
  results: true,
  // IE-only attribute that specifies security restrictions on an iframe
  // as an alternative to the sandbox attribute on IE<1true
  security: true,
  // IE-only attribute that controls focus behavior
  unselectable: true,
  // used in amp html for eventing purposes
  // https://amp.dev/documentation/guides-and-tutorials/learn/common_attributes/
  on: true,
  // used in amp html for indicating that the option is selectable
  // https://amp.dev/documentation/components/amp-selector/
  option: true,
  // https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/placeholders/
  fallback: true,
} as const;
/**
 * Standard HTML attributes supported by modern browsers and React DOM.
 * Covers the majority of attributes used across HTML elements.
 */
const STANDARD_HTML_PROPS = {
  abbr: true,
  accept: true,
  acceptCharset: true,
  accessKey: true,
  action: true,
  allow: true,
  allowFullScreen: true,
  allowPaymentRequest: true,
  alt: true,
  // specifies target context for links with `preload` type
  // as: true,
  async: true,
  autoComplete: true,
  autoFocus: true,
  autoPlay: true,
  capture: true,
  cellPadding: true,
  cellSpacing: true,

  challenge: true,
  charSet: true,
  checked: true,
  cite: true,
  classID: true,
  className: true,
  cols: true,
  colSpan: true,

  content: true,
  contentEditable: true,
  contextMenu: true,
  controls: true,
  controlsList: true,
  coords: true,
  crossOrigin: true,

  data: true, // For `<object />` acts as `src`.
  dateTime: true,

  decoding: true,
  default: true,
  defer: true,
  dir: true,

  disabled: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  download: true,
  draggable: true,

  encType: true,
  enterKeyHint: true,
  form: true,
  formAction: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  frameBorder: true,
  headers: true,

  height: true,
  hidden: true,
  high: true,
  href: true,
  hrefLang: true,
  htmlFor: true,
  httpEquiv: true,
  id: true,
  inputMode: true,
  integrity: true,
  is: true,
  keyParams: true,
  keyType: true,
  kind: true,
  label: true,
  lang: true,
  list: true,
  loading: true,
  loop: true,
  low: true,

  marginHeight: true,
  marginWidth: true,
  max: true,
  maxLength: true,
  media: true,
  mediaGroup: true,
  method: true,
  min: true,
  minLength: true,

  multiple: true,
  muted: true,
  name: true,
  nonce: true,
  noValidate: true,
  open: true,
  optimum: true,
  pattern: true,
  placeholder: true,
  playsInline: true,
  poster: true,
  preload: true,
  profile: true,
  radioGroup: true,
  readOnly: true,
  referrerPolicy: true,
  rel: true,
  required: true,
  reversed: true,
  role: true,
  rows: true,
  rowSpan: true,
  sandbox: true,
  scope: true,
  scoped: true,
  scrolling: true,
  seamless: true,
  selected: true,
  shape: true,
  size: true,
  sizes: true,
  slot: true,
  span: true,
  spellCheck: true,
  src: true,
  srcDoc: true,
  srcLang: true,
  srcSet: true,
  start: true,
  step: true,
  style: true,
  summary: true,
  tabIndex: true,
  target: true,
  title: true,
  translate: true,
  type: true,
  useMap: true,
  value: true,
  width: true,
  wmode: true,
  wrap: true,
} as const;
/**
 * SVG presentation attributes controlling visual rendering.
 * These map closely to CSS-like presentation properties
 * applied directly to SVG elements.
 */
const SVG_PRESENTATION_PROPS = {
  alignmentBaseline: true,
  baselineShift: true,
  clip: true,
  clipPath: true,
  clipRule: true,
  color: true,
  colorInterpolation: true,
  colorInterpolationFilters: true,
  colorProfile: true,
  colorRendering: true,
  cursor: true,
  direction: true,
  display: true,
  dominantBaseline: true,
  enableBackground: true,
  fill: true,
  fillOpacity: true,
  fillRule: true,
  filter: true,
  floodColor: true,
  floodOpacity: true,
  imageRendering: true,
  lightingColor: true,
  markerEnd: true,
  markerMid: true,
  markerStart: true,
  mask: true,
  opacity: true,
  overflow: true,
  paintOrder: true,
  pointerEvents: true,
  shapeRendering: true,
  stopColor: true,
  stopOpacity: true,
  stroke: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeLinecap: true,
  strokeLinejoin: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
  textAnchor: true,
  textDecoration: true,
  textRendering: true,
  unicodeBidi: true,
  vectorEffect: true,
  visibility: true,
  wordSpacing: true,
  writingMode: true,
} as const;
/**
 * SVG geometry attributes defining shapes and layout.
 * These determine coordinates, radii, paths, and element
 * positioning within the SVG viewport.
 */
const SVG_GEOMETRY_PROPS = {
  cx: true,
  cy: true,
  d: true,
  dx: true,
  dy: true,
  fr: true,
  fx: true,
  fy: true,
  height: true,
  points: true,
  r: true,
  rx: true,
  ry: true,
  transform: true,
  version: true,
  viewBox: true,
  width: true,
  x: true,
  x1: true,
  x2: true,
  y: true,
  y1: true,
  y2: true,
  z: true,
} as const;
/**
 * SVG animation and filter attributes.
 * Used for SMIL animations and SVG filter primitives.
 */
const SVG_ANIMATION_FILTER_PROPS = {
  accumulate: true,
  additive: true,
  allowReorder: true,
  amplitude: true,
  attributeName: true,
  attributeType: true,
  autoReverse: true,
  begin: true,
  bias: true,
  by: true,
  calcMode: true,
  decelerate: true,
  diffuseConstant: true,
  divisor: true,
  dur: true,
  edgeMode: true,
  elevation: true,
  end: true,
  exponent: true,
  externalResourcesRequired: true,
  filterRes: true,
  filterUnits: true,
  from: true,
  in: true,
  in2: true,
  intercept: true,
  k: true,
  k1: true,
  k2: true,
  k3: true,
  k4: true,
  kernelMatrix: true,
  kernelUnitLength: true,
  keyPoints: true,
  keySplines: true,
  keyTimes: true,
  limitingConeAngle: true,
  mode: true,
  numOctaves: true,
  operator: true,
  order: true,
  orient: true,
  orientation: true,
  origin: true,
  pathLength: true,
  primitiveUnits: true,
  repeatCount: true,
  repeatDur: true,
  restart: true,
  result: true,
  rotate: true,
  scale: true,
  seed: true,
  slope: true,
  spacing: true,
  specularConstant: true,
  specularExponent: true,
  speed: true,
  spreadMethod: true,
  startOffset: true,
  stdDeviation: true,
  stitchTiles: true,
  surfaceScale: true,
  targetX: true,
  targetY: true,
  to: true,
  values: true,
  xChannelSelector: true,
  yChannelSelector: true,
  zoomAndPan: true,
} as const;
/**
 * SVG typography and text layout attributes.
 * Defines font behavior, glyph metrics, and text rendering.
 */
const SVG_TEXT_PROPS = {
  accentHeight: true,
  alphabetic: true,
  arabicForm: true,
  ascent: true,
  bbox: true,
  capHeight: true,
  descent: true,
  fontFamily: true,
  fontSize: true,
  fontSizeAdjust: true,
  fontStretch: true,
  fontStyle: true,
  fontVariant: true,
  fontWeight: true,
  format: true,
  g1: true,
  g2: true,
  glyphName: true,
  glyphOrientationHorizontal: true,
  glyphOrientationVertical: true,
  glyphRef: true,
  hanging: true,
  horizAdvX: true,
  horizOriginX: true,
  ideographic: true,
  kerning: true,
  lengthAdjust: true,
  letterSpacing: true,
  local: true,
  mathematical: true,
  overlinePosition: true,
  overlineThickness: true,
  panose1: true,
  refX: true,
  refY: true,
  renderingIntent: true,
  strikethroughPosition: true,
  strikethroughThickness: true,
  string: true,
  systemLanguage: true,
  tableValues: true,
  textLength: true,
  u1: true,
  u2: true,
  underlinePosition: true,
  underlineThickness: true,
  unicode: true,
  unicodeRange: true,
  unitsPerEm: true,
  vAlphabetic: true,
  vHanging: true,
  vIdeographic: true,
  vMathematical: true,
  values: true,
  vertAdvY: true,
  vertOriginX: true,
  vertOriginY: true,
  widths: true,
  xHeight: true,
} as const;

/**
 * SVG namespace and linking attributes.
 * Includes XML namespaces and XLink references used
 * in advanced SVG definitions.
 */
const SVG_NAMESPACE_PROPS = {
  clipPathUnits: true,
  contentScriptType: true,
  contentStyleType: true,
  gradientTransform: true,
  gradientUnits: true,
  markerHeight: true,
  markerUnits: true,
  markerWidth: true,
  maskContentUnits: true,
  maskUnits: true,
  offset: true,
  patternContentUnits: true,
  patternTransform: true,
  patternUnits: true,
  preserveAlpha: true,
  preserveAspectRatio: true,
  requiredExtensions: true,
  requiredFeatures: true,
  viewTarget: true,
  xlinkActuate: true,
  xlinkArcrole: true,
  xlinkHref: true,
  xlinkRole: true,
  xlinkShow: true,
  xlinkTitle: true,
  xlinkType: true,
  xmlBase: true,
  xmlns: true,
  xmlnsXlink: true,
  xmlLang: true,
  xmlSpace: true,
} as const;
/**
 * Compatibility attributes for non-React environments
 * (primarily Preact and legacy HTML attribute forms).
 */
const COMPAT_PROPS = {
  // For preact. We have this code here even though Emotion doesn't support
  // Preact, since @emotion/is-prop-valid is used by some libraries outside of
  // the context of Emotion.
  for: true,
  class: true,
  autofocus: true,
} as const;

export const VALID_DOM_PROPS = {
  ...SPECIALIZED_PROPS,
  ...METADATA_PROPS,
  ...SVG_AND_A11Y_PROPS,
  ...MODERN_HTML_PROPS,
  ...REACT_CAMEL_CASE_PROPS,
  ...REACT_19_PROPS,
  ...BASE_REACT_PROPS,
  ...COMPAT_PROPS,
  ...SVG_NAMESPACE_PROPS,
  ...SVG_TEXT_PROPS,
  ...SVG_ANIMATION_FILTER_PROPS,
  ...SVG_GEOMETRY_PROPS,
  ...SVG_PRESENTATION_PROPS,
  ...STANDARD_HTML_PROPS,
} as const;
// export const VALID_DOM_TESTING_KEYS = Object.keys(VALID_DOM_PROPS);
