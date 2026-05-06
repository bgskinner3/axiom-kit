// __tests__/engine/guard/is-solid.test.ts

describe('Guard IsSolid', () => {
  expect(true).toBe(true);
});

// MAYBE?
// import { isSolid, getSolid } from '../src';

// describe('Solid Transformation', () => {
//   it('should inject metadata into isSolid calls', () => {
//     type TestUser = { name: string };

//     // The transformer should inject the 2nd argument here
//     isSolid<'UNIT_TEST', TestUser>();

//     const metadata = getSolid('UNIT_TEST');

//     expect(metadata).toBeDefined();
//     expect(metadata?.key).toBe('UNIT_TEST');
//     expect(metadata?.shape.kind).toBe('object');
//   });
// });
/**
 * 
 * 
 * // import { isSolid, getSolid } from '../src';
// import { IS_SOLID_CONFIG_ITEMS } from '../src/models';

// describe('isSolid Bridge (Auto-Registration)', () => {
//   it('should register metadata in the vault when isSolid is called', () => {
//     const data = { id: '123', nested: { tester: 0 } };

//     // 1. Simulate what the Transformer would inject
//     const injectedMetadata = {
//       key: 'User',
//       area: 'test.ts',
//       version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//       shape: {
//         kind: 'object',
//         properties: { id: { kind: 'primitive', type: 'string' } },
//       },
//     };

//     // 2. Execute the "Ghost" function (now Solid)
//     // In real life, the transformer fills that 2nd argument for you.
//     const result = isSolid<'User', { id: string }>(
//       data,
//       injectedMetadata as any,
//     );

//     // 3. Verify the "Side Effect" (The Database)
//     const stored = getSolid('User');

//     expect(result).toBe(true);
//     expect(stored).toBeDefined();
//     expect(stored?.key).toBe('User');
//     expect(stored?.shape.kind).toBe('object');
//   });
//   it('should handle complex nested objects', () => {
//     const data = {
//       id: '123',
//       profile: { username: 'bgskinner' },
//     };

//     const metadata = {
//       key: 'UserProfile',
//       area: 'test.ts',
//       version: IS_SOLID_CONFIG_ITEMS.solidVersion,
//       shape: {
//         kind: 'object',
//         properties: {
//           id: { kind: 'primitive', type: 'string' },
//           profile: {
//             kind: 'object',
//             properties: {
//               username: { kind: 'primitive', type: 'string' },
//             },
//           },
//         },
//       },
//     };

//     const result = isSolid<'UserProfile', any>(data, metadata as any);
//     // const stored = getSolid('UserProfile');
//     // console.log(JSON.stringify(stored, null, 2));
//     expect(result).toBe(true);
//   });
// });

 */
/**
 *
 *
 *
 *
 *
 *
 * MORE ENGINE TESTS
 */
// __tests__/engine.test.ts
// import { validate } from '../src/validation';
// import { createInitialContext } from '../src/validation/context';

// describe('Solid Engine', () => {
//   it('should validate a simple primitive', () => {
//     const shape = { kind: 'primitive', type: 'string' } as const;
//     const ctx = createInitialContext();

//     expect(validate('hello', shape, ctx)).toBe(true);
//     expect(validate(123, shape, ctx)).toBe(false);
//   });

//   it('should report correct path for nested object errors', () => {
//     const shape = {
//       kind: 'object',
//       properties: {
//         id: {
//           shape: { kind: 'primitive', type: 'string' },
//           optional: false,
//           name: 'id',
//         },
//       },
//     } as any;

//     const ctx = createInitialContext();
//     validate({ id: 123 }, shape, ctx); // 🚨 Should fail (number vs string)

//     expect(ctx.errors[0].path).toBe('id');
//     expect(ctx.errors[0].received).toBe('123');
//   });
// });
/**
 *
 *
 *
 *
 *
 */

// import ts from 'typescript';
// import { reifyType } from '../transformer/reifiers';
// // import type { TSolidShape } from '../transformer/types';
// import { IS_SOLID_CONFIG_ITEMS } from '../src/models';

// beforeEach(() => {
//   // Clear the global vault before every single test
//   const globalObj = globalThis as any;
//   if (globalObj[IS_SOLID_CONFIG_ITEMS.solidVaultKey]) {
//     globalObj[IS_SOLID_CONFIG_ITEMS.solidVaultKey].clear();
//   }
// });

// describe('Solid Resolver (The Miner)', () => {
//   // Helper to create a "Live" TS environment for a string of code
//   function getTestType(code: string, interfaceName: string) {
//     const fileName = 'test.ts';

//     // 1. Create the Program with the code already inside
//     const host = ts.createCompilerHost({});
//     host.getSourceFile = (name) =>
//       name === fileName
//         ? ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest)
//         : undefined;

//     const program = ts.createProgram([fileName], { lib: ['esnext'] }, host);
//     const checker = program.getTypeChecker();
//     const sourceFile = program.getSourceFile(fileName);

//     // 2. Find the interface node
//     const node = sourceFile?.statements.find(
//       (s): s is ts.InterfaceDeclaration =>
//         ts.isInterfaceDeclaration(s) && s.name.text === interfaceName,
//     );

//     if (!node) throw new Error(`Could not find interface ${interfaceName}`);

//     return { type: checker.getTypeAtLocation(node), checker };
//   }

//   it('should resolve a basic object with primitives', () => {
//     const { type, checker } = getTestType(
//       `interface User { id: string; age: number; }`,
//       'User',
//     );

//     const shape = reifyType(type, checker);

//     expect(shape.kind).toBe('object');
//     if (shape.kind === 'object') {
//       expect(shape.properties.id).toEqual({
//         kind: 'primitive',
//         type: 'string',
//       });
//       expect(shape.properties.age).toEqual({
//         kind: 'primitive',
//         type: 'number',
//       });
//     }
//   });

//   it('should catch recursion and return a reference', () => {
//     const { type, checker } = getTestType(
//       `interface Node { next: Node; }`,
//       'Node',
//     );

//     const shape = reifyType(type, checker);

//     if (shape.kind === 'object') {
//       expect(shape.properties.next).toMatchObject({
//         kind: 'reference',
//         name: 'Node',
//       });
//     }
//   });
// });
