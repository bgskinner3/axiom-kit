import type {
  TSolidMetadata,
  TPersistParams,
  ISolidRegistry,
  TSolidError,
} from '../models/types';
import { XalethorVaultKeeper } from './vault-keeper';
import { XalethorVaultValidator } from './vault-validator';
import { XalethorVaultAuditor } from './vault-auditor';
import { XalethorVaultArchive } from './vault-archive';
import { XalethorVaultGenerator } from './vault-generator';

export class XalethorService {
  // ============================================================
  // XalethorVaultKeeper
  // ============================================================
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
  // ============================================================
  // VALIDATOR
  // ============================================================
  public static validateShape(data: unknown, key: string): boolean {
    return XalethorVaultValidator.validateShape(data, key);
  }
  public static has(key: string): boolean {
    return XalethorVaultValidator.has(key);
  }
  // ============================================================
  // AUDITOR
  // ============================================================
  public static panic(key: string): never {
    return XalethorVaultAuditor.panic(key);
  }
  public static getKeyErrors(key: string): TSolidError[] {
    return XalethorVaultAuditor.getErrors(key);
  }
  public static auditReport(isValid: boolean, rawErrors: TSolidError[]) {
    return XalethorVaultAuditor.compileAuditReport(isValid, rawErrors);
  }
  // ============================================================
  // ARCHIVE
  // ============================================================
  public persist(params: TPersistParams): void {
    return XalethorVaultArchive.persist(params);
  }
  public hydrateFromGenesis(rootDir: string): void {
    return XalethorVaultArchive.hydrateFromGenesis(rootDir);
  }

  // ============================================================
  // GENERATOR
  // ============================================================
  public static produceDefault<K extends keyof ISolidRegistry>(
    key: K,
  ): ISolidRegistry[K] {
    return XalethorVaultGenerator.getDefault(key);
  }
}
// public static has(key: string): boolean {
//   return (
//     this.vault.blueprints.has(key) &&
//     this.vault.manifest.has(key) &&
//     this.vault.registry.has(key)
//   );
// }

// public static keys(): string[] {
//   // 💎 We filter to ensure every key returned has a complete Triple-KV graph
//   return Array.from(this.vault.blueprints.keys()).filter((key) =>
//     this.has(key),
//   );
// }

// /**
//  * 🏗️ GET DEFAULT
//  * Replaces Registry.getDefault.
//  * Directly queries the 'blueprints' vault for the structural logic.
//  */
// public static getDefault<T>(key: string): T {
//   const shape = this.vault.blueprints.get(key);
//   // this.errorWarnMessageTemp.ERROR
//   if (!shape) {
//     // 🚩 If missing, we use the Manifest to provide a better error message
//     const location = this.vault.manifest.get(key);
//     const errorMsg = location
//       ? 'this.errorMessageTemp.MISSING_VAULT_BLUEPRINT({ key, location })'
//       : 'this.errorMessageTemp.MISSING_VAULT_KEY({ key });';

//     throw new Error(errorMsg);
//   }

//   return produceDefault(shape) as T;
// }
/**
 XalethorVaultArchive
 XalethorVaultAuditor
 XalethorVaultKeeper
 XalethorVaultValidator
 XalethorVaultGenerator
 */
