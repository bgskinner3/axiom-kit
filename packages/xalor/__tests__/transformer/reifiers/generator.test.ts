// __tests__/transformer/reifiers/generator.test.ts
import ts from 'typescript';
import { generateShapeAST } from '../../../transformer/reifiers/generator';
import type { TSolidShape } from '../../../src/models/types';
describe('Shape Generator (AST Emission)', () => {
  const f = ts.factory;
  const printer = ts.createPrinter();
  const dummyFile = ts.createSourceFile('test.ts', '', ts.ScriptTarget.Latest);

  // Helper to convert the AST node into a readable string
  const render = (node: ts.Expression) =>
    printer.printNode(ts.EmitHint.Expression, node, dummyFile);

  it('should generate a primitive shape object', () => {
    const shape: TSolidShape = { kind: 'primitive', type: 'string' };
    const result = render(generateShapeAST(f, shape));

    expect(result).toBe('{ kind: "primitive", type: "string" }');
  });

  it('should generate a complex union (The Boolean Reality)', () => {
    const shape: TSolidShape = {
      kind: 'union',
      values: [
        { kind: 'literal', value: false },
        { kind: 'literal', value: true },
      ],
    };
    const result = render(generateShapeAST(f, shape));

    expect(result).toContain('kind: "union"');
    expect(result).toContain('value: false');
    expect(result).toContain('value: true');
  });

  it('should generate an object with properties', () => {
    const shape: TSolidShape = {
      kind: 'object',
      properties: {
        id: {
          name: 'id',
          optional: false,
          shape: { kind: 'primitive', type: 'number' },
        },
      },
    };
    const result = render(generateShapeAST(f, shape));

    // Check for correct key-value injection
    expect(result).toContain(
      '"id": { shape: { kind: "primitive", type: "number" }',
    );
    expect(result).toContain('optional: false');
    expect(result).toContain('name: "id"');
  });
  /**
   * Array Nesting Case
   * !!!  Verify that the recursive call correctly handles the items property.
   */
  it('should generate a nested array shape', () => {
    const shape: TSolidShape = {
      kind: 'array',
      items: { kind: 'primitive', type: 'string' },
    };
    const result = render(generateShapeAST(f, shape));

    expect(result).toBe(
      '{ kind: "array", items: { kind: "primitive", type: "string" } }',
    );
  });
  /**
   * Branded Identity Case
   * !!! Verify the name (string literal) and base (recursive) are generated correctly.
   */
  it('should generate a branded shape', () => {
    const shape: TSolidShape = {
      kind: 'branded',
      name: 'UserId',
      base: { kind: 'primitive', type: 'string' },
    };
    const result = render(generateShapeAST(f, shape));

    expect(result).toContain('kind: "branded"');
    expect(result).toContain('name: "UserId"');
    expect(result).toContain('base: { kind: "primitive", type: "string" }');
  });
  /**
   * Intersection "Parts" Case
   * !!! Verify that the parts array is correctly emitted as an AST array literal.
   */
  it('should generate an intersection shape with multiple parts', () => {
    const shape: TSolidShape = {
      kind: 'intersection',
      parts: [
        {
          kind: 'object',
          properties: {
            a: {
              name: 'a',
              optional: false,
              shape: { kind: 'primitive', type: 'string' },
            },
          },
        },
        {
          kind: 'object',
          properties: {
            b: {
              name: 'b',
              optional: false,
              shape: { kind: 'primitive', type: 'number' },
            },
          },
        },
      ],
    };
    const result = render(generateShapeAST(f, shape));

    expect(result).toContain('kind: "intersection"');
    expect(result).toContain('parts: ['); // Verify it created an array literal
  });
  /**
   * Reference Case (Circular Safety)
   * !!! Ensure that circular references turn into simple name-based pointers.
   */
  it('should generate a reference shape for circular types', () => {
    const shape: TSolidShape = { kind: 'reference', name: 'INode' };
    const result = render(generateShapeAST(f, shape));

    expect(result).toBe('{ kind: "reference", name: "INode" }');
  });
});
// // __tests__/unit/refiy-types.test.ts
// import { reifyType } from '../../../transformer/reifiers/reify-type';
// import { reifyTypeContext } from '../../utils';
// // NOTE: ** IMPORTANT** Wakes up the side-effect registry before testing
// import '../../../transformer/reifiers/registry/index';

// describe('ReifyType Orchestrator (The Dispatcher)', () => {
//   it('should fall through to "unknown" when no reifiers match', () => {
//     // 'any' is the ultimate wildcard that reifiers usually skip
//     const { type, checker } = reifyTypeContext('type T = any;');
//     const result = reifyType(type, checker);

//     expect(result).toEqual({ kind: 'primitive', type: 'unknown' });
//   });

//   it('should correctly orchestrate the "next" recursion (Depth Check)', () => {
//     // This tests if reifyType correctly passes the 'next' baton
//     // from an Object to a Primitive.
//     const { type, checker } = reifyTypeContext('interface T { id: string }');
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('object');
//     // Verify the recursive result of the 'id' property
//     expect(result.properties.id.shape).toEqual({
//       kind: 'primitive',
//       type: 'string',
//     });
//   });

//   it('should maintain the "seen" set to prevent stack overflow', () => {
//     // This is the CRITICAL safety test.
//     const { type, checker } = reifyTypeContext(`
//       interface Node {
//         val: number;
//         child: Node;
//       }
//     `);

//     // If the orchestrator doesn't pass 'seen' correctly,
//     // this call will throw "Maximum call stack size exceeded"
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('object');
//     expect(result.properties.child.shape.kind).toBe('reference');
//     expect(result.properties.child.shape.name).toBe('Node');
//   });

//   it('should respect reifier priority (The Intersection/Branded Conflict)', () => {
//     // Proves that 'branded' reifier (if registered first) wins over 'intersection'
//     const { type, checker } = reifyTypeContext(`
//       type Brand = string & { __brand: "ID" };
//     `);
//     const result = reifyType(type, checker);

//     expect(result.kind).toBe('branded');
//   });

//   it('should handle deeply nested arrays and objects combined', () => {
//     const { type, checker } = reifyTypeContext(
//       'type T = { items: string[] }[];',
//     );
//     const result = reifyType(type, checker) as any;

//     expect(result.kind).toBe('array');
//     expect(result.items.kind).toBe('object');
//     expect(result.items.properties.items.shape.kind).toBe('array');
//     expect(result.items.properties.items.shape.items.type).toBe('string');
//   });
// });
