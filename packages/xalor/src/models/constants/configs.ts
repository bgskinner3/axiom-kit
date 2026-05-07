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
} as const;
