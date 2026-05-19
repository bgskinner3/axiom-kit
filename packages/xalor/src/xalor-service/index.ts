import type { TPersistParams, ISolidRegistry } from '../models/types';
import type { TSolidMetadata, TSolidError, TSolidBranded } from '../../shared';
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
  public static auditReport(
    targetKey: string,
    isValid: boolean,
    rawErrors: TSolidError[],
  ) {
    return XalethorVaultAuditor.compileAuditReport(
      targetKey,
      isValid,
      rawErrors,
    );
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
  ): TSolidBranded<K, ISolidRegistry[K]> {
    return XalethorVaultGenerator.getDefault(key);
  }
  public static produceMock<K extends keyof ISolidRegistry>(
    key: K,
  ): TSolidBranded<K, ISolidRegistry[K]> {
    return XalethorVaultGenerator.getMock(key);
  }
  public static produceClone<K extends keyof ISolidRegistry>(
    data: unknown,
    key: K,
  ): TSolidBranded<K, ISolidRegistry[K]> {
    return XalethorVaultGenerator.getClone(data, key);
  }
  public static produceCast<K extends keyof ISolidRegistry>(
    data: unknown,
    key: K,
  ): TSolidBranded<K, ISolidRegistry[K]> {
    return XalethorVaultGenerator.getCast(data, key);
  }
}

/**
 XalethorVaultArchive
 XalethorVaultAuditor
 XalethorVaultKeeper
 XalethorVaultValidator
 XalethorVaultGenerator
 */
