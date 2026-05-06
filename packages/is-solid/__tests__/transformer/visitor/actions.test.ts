import ts from 'typescript';
import {
  updateRegistry,
  markAsPure,
} from '../../../transformer/visitor/actions';

describe('Visitor Actions', () => {
  describe('updateRegistry', () => {
    it('should throw error on key collision between different files', () => {
      const registry = new Map([['USER', 'file-a.ts|IUser']]);

      expect(() =>
        updateRegistry(registry, 'USER', 'file-b.ts', 'NewUser'),
      ).toThrow(
        '[is-solid] Collision: Key "USER" is already defined in file-a.ts',
      );
    });

    it('should allow updates from the same file', () => {
      const registry = new Map([['USER', 'file-a.ts|IUser']]);
      expect(() =>
        updateRegistry(registry, 'USER', 'file-a.ts', 'IUser'),
      ).not.toThrow();
    });
  });

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
});
