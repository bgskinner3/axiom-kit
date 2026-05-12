import type { TSolidShape } from './shared';

type TManifestShape = { area: string; filePath: string };
type TManifestVault = Record<string, TManifestShape>;

type TBluePrintVault = Record<string, TSolidShape>;

type TRegistryShape = { symbolName: string; typeName: string };

type TRegistryVault = Record<string, TRegistryShape>;

export type TTripleKV = {
  blueprints: TBluePrintVault;
  manifest: TManifestVault;
  registry: TRegistryVault;
  version: string;
};
