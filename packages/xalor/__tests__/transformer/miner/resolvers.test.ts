import ts from 'typescript';
import {
  markAsPure,
  syncVault,
  // getSpatialIdentity,
} from '../../../transformer/miner/resolvers';
import * as path from 'path';
import type { TVaultSyncPayload } from '../../../src/models/types';
describe('Visitor Actions', () => {
  describe('markAsPure', () => {
    it('should inject @__PURE__ comment into nodes', () => {
      const f = ts.factory;
      const node = f.createIdentifier('test');
      const pureNode = markAsPure(node);

      const printer = ts.createPrinter();
      const result = printer.printNode(
        ts.EmitHint.Unspecified,
        pureNode,
        ts.createSourceFile('t.ts', '', ts.ScriptTarget.Latest),
      );
      expect(result).toContain('/** @__PURE__ */');
    });
  });
  describe('syncVault', () => {
    it('should normalize file paths and store payloads correctly', () => {
      const registry = new Map<string, TVaultSyncPayload>();
      const payload: TVaultSyncPayload = {
        key: 'USER',
        filePath: path.join(process.cwd(), 'src/user.ts'), // Absolute path
        symbolName: 'User',
        area: 'src/user.ts:1:1',
        typeName: '{ id: number }',
        shape: { kind: 'primitive', type: 'unknown' },
        version: '1.0.0',
      };

      syncVault({ registry, payload });

      const entry = registry.get('USER');
      expect(entry).toBeDefined();
      // 🛡️ Verify Path Normalization (Relative for Bunker portability)
      expect(entry?.filePath).toBe('src/user.ts');
    });
  });

  // describe('getSpatialIdentity', () => {
  //   // Note: Testing this requires a real TS Program/SourceFile
  //   it('should correctly resolve area and type names', () => {
  //     const sourceText = `export type User = { id: number };`;
  //     const sourceFile = ts.createSourceFile(
  //       'test.ts',
  //       sourceText,
  //       ts.ScriptTarget.Latest,
  //       true,
  //     );

  //     // We simulate the node at the "User" declaration
  //     const node = sourceFile.statements[0] as ts.TypeAliasDeclaration;

  //     // In a real test, we would provide the actual TypeChecker.
  //     // For this unit test, we mock the checker's print results.
  //     const mockChecker = {
  //       getSymbolAtLocation: jest.fn(),
  //       typeToString: jest.fn().mockReturnValue('{ id: number }'),
  //     } as any;

  //     const mockType = {
  //       aliasSymbol: { getName: () => 'User' },
  //     } as any;

  //     const identity = getSpatialIdentity({
  //       node,
  //       sourceFile,
  //       shapeType: mockType,
  //       checker: mockChecker,
  //     });
  //     console.log(identity, '\n\n\n\n\n');
  //     expect(identity.symbolName).toBe('User');
  //     expect(identity.area).toContain('test.ts:1:1');
  //   });
  // });
});
