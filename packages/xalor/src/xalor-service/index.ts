import type { TSolidMetadata, TPersistParams } from '../models/types';
import { XalethorVaultKeeper } from './vault-keeper';
import { XalethorVaultValidator } from './vault-validator';
import { XalethorVaultAuditor } from './vault-auditor';
import { XalethorVaultArchive } from './vault-archive';

export class XalethorService {
  public static solidify(raw: TSolidMetadata): void {
    XalethorVaultKeeper.solidify(raw);
  }
  public static blueprintVault(key: string) {
    return XalethorVaultKeeper.peek('blueprint', key);
  }
  public static manifestVault(key: string) {
    return XalethorVaultKeeper.peek('manifest', key);
  }
  public static registryVault(key: string) {
    return XalethorVaultKeeper.peek('registry', key);
  }
  public static inspectMetaData(key: string) {
    return XalethorVaultKeeper.resolve(key);
  }
  // VALIDATOR
  public static validateShape(data: unknown, key: string) {
    return XalethorVaultValidator.validateShape(data, key);
  }

  // AUDITOR
  public static panic(key: string): never {
    return XalethorVaultAuditor.panic(key);
  }

  // Archive
  public persist(params: TPersistParams): void {
    return XalethorVaultArchive.persist(params);
  }
  public hydrateFromGenesis(rootDir: string): void {
    return XalethorVaultArchive.hydrateFromGenesis(rootDir);
  }
}
