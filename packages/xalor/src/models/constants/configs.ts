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
  sentryTriggers: ['isXalor'],
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
  targetDir: './dist',
  fileName: 'solid-env.d.ts',
  // TODO: PUT BACK
  moduleName: process.env.NODE_ENV !== 'test' ? '.' : '@bgskinner2/xalor',
  banner: `/** 💎 SOLIDIFIED TYPE DATABASE (AUTO-GENERATED) */`,
  eslintDisabled: [
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-explicit-any',
  ],
  imports: [
    "import type { TSolid, TSolidMetadata, ISolidRegistry, ISolidIdentity } from './index';",
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
  bridgeDir: 'src/.xalor',

  /** The filename for the ambient declarations */
  bridgeFile: 'solid-env.d.ts',
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
} as const;
