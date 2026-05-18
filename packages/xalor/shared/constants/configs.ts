/**
 * 🔑 CORE GLOBAL KEYS
 *
 * Defines the fundamental identifiers used to anchor the Xalor engine.
 * This includes the singleton key for the Global Vault and the
 * current versioning used to prevent schema mismatches across
 * different build environments.
 */
const SOLID_GLOBAL_KEYS = {
  solidVaultKey: '__SOLID_VAULT__',
  solidVersion: '1.0.0',
  //
  solidBrandKey: '__xalorBrand',
} as const;

/**
 * 🛰️ AMBIENT EMITTER CONFIGURATION
 *
 * Orchestrates the generation of the "Ghost Layer" (.d.ts) database.
 * These settings control where the IntelliSense Bridge is built,
 * how it identifies the parent module, and which linting rules
 * are suppressed to ensure a seamless developer experience.
 */
const SOLID_EMITTER_KEYS = {
  targetDir: './node_modules/.cache/xalor',
  fileName: 'solid-env.d.ts',
  moduleName: '@bgskinner2/xalor',
  banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */`,
  eslintDisabled: [
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-explicit-any',
  ],
  imports: [
    "import type { TSolidMetadata, ISolidRegistry, ISolidIdentity } from '@bgskinner2/xalor';",
  ],
} as const;

/**
 * 🗺️ XALOR PATHS
 *
 * Centralizes the physical locations for the Xalethor Engine.
 * This ensures the Miner and the Archive are always synchronized.
 */
export const XALOR_PATHS = {
  /** The "Genesis Bunker" for persistence across builds */
  cacheDir: 'node_modules/.cache/xalor',

  /** The serialized snapshot of the Triple-KV Vault */
  vaultFile: 'vault-snapshot.json',

  /** The IDE Bridge destination (The Ghost Layer) */
  // bridgeDir: 'src/.xalor',
  bridgeDir: 'node_modules/.cache/xalor',

  /** The filename for the ambient declarations */
  bridgeFile: 'solid-env.d.ts',
} as const;

/**
 * ⚖️ REIFY DEPTH & SIZE LIMITS
 *
 * PURPOSE:
 * Implements the "Atomic Cut" strategy to prevent the "Pyramid of Doom."
 * These constants act as the physical laws for the Build-Time Miner.
 *
 * ROLE:
 * 1. PERSISTENCE: Ensures JSON blueprints remain small enough for rapid I/O.
 * 2. PERFORMANCE: Caps recursion depth to protect the Runtime Engine's stack.
 * 3. SECURITY: Mitigates "Billion Laughs" style memory exhaustion attacks.
 *
 * @law maxDepth - Forces a 'reference' chop once nesting exceeds this level.
 * @law maxStringLength - Guards against "URL Shutdown" scenarios.
 */
const REIFY_DEPTH_LENGTH_SIZE_LIMITS = {
  maxDepth: 10,
  maxStringLength: 4096,
  maxObjectProperties: 200,
  maxUnionVariants: 50,
  autoChop: true,
} as const;

/**
 * 🌍 MASTER GLOBAL CONFIGURATION
 *
 * The unified source of truth for the entire Xalor ecosystem.
 * This object flattens the individual key groups into a single,
 * immutable configuration object used by the Miner, the Emitter,
 * and the Runtime Engine.
 */
export const IS_SOLID_CONFIG_ITEMS = {
  ...SOLID_GLOBAL_KEYS,
  // EMITTER I>E DATAASE FILE BUILD
  emitter: {
    ...SOLID_EMITTER_KEYS,
  },
  lifeCyclePaths: {
    ...XALOR_PATHS,
  },
  reifyLimit: {
    ...REIFY_DEPTH_LENGTH_SIZE_LIMITS,
  },
} as const;

/**
 * SENTRY_TRIGGER_NAMES
 *
 * ROLE:
 * The primary identifier matrix used by the compiler's static analysis layer.
 * These string literals represent the exact public API macro entry points.
 *
 * STRATEGY:
 * - High-Velocity Screening: Used by the Scout Pass (`shouldProcessFile`) to
 *   perform rapid string token scans before running recursive AST visitors.
 * - Toolchain Synchronization: Ensures that any module invoking these runtime
 *   functions is intercepted, mined, and compiled into the CAS database cache.
 */
export const SENTRY_TRIGGER_NAMES = [
  'registerXalor',
  // 'validateXalor',
  'generateXalor',
] as const;
