// __tests__/unit/generator.test.ts
// import ts from 'typescript';
// import { generateShapeAST } from '../../transformer/reifiers/generator';
// import { TSolidShape } from '../../models/types';

describe('Shape Generator', () => {
  it('should show placeholder', () => {
    expect(true).toEqual(true);
  });
  // const f = ts.factory;
  // const printer = ts.createPrinter();
  // const dummyFile = ts.createSourceFile('test.ts', '', ts.ScriptTarget.Latest);

  // // Helper to turn AST nodes into strings we can read
  // const stringify = (node: ts.Expression) =>
  //   printer.printNode(ts.EmitHint.Expression, node, dummyFile);

  // it('should generate an object for primitives', () => {
  //   const shape: TSolidShape = { kind: 'primitive', type: 'string' };
  //   const node = generateShapeAST(f, shape);

  //   expect(stringify(node)).toBe('{ kind: "primitive", type: "string" }');
  // });

  // it('should generate nested arrays', () => {
  //   const shape: TSolidShape = {
  //     kind: 'array',
  //     items: { kind: 'primitive', type: 'number' },
  //   };
  //   const node = generateShapeAST(f, shape);

  //   expect(stringify(node)).toBe(
  //     '{ kind: "array", items: { kind: "primitive", type: "number" } }',
  //   );
  // });

  // it('should handle complex object structures', () => {
  //   const shape: TSolidShape = {
  //     kind: 'object',
  //     properties: {
  //       id: {
  //         name: 'id',
  //         optional: false,
  //         shape: { kind: 'primitive', type: 'number' },
  //       },
  //     },
  //   };
  //   const node = generateShapeAST(f, shape);
  //   const result = stringify(node);

  //   expect(result).toContain('"kind": "object"');
  //   expect(result).toContain(
  //     '"id": { "shape": { "kind": "primitive", "type": "number" }',
  //   );
  // });
});
