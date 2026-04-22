import { RegexEngine } from '../src';

// describe('RegexEngine Core', () => {
//   let engine: RegexEngine;

//   beforeEach(() => {
//     engine = new RegexEngine();
//   });

//   it('should validate an isoDate correctly', () => {
//     const valid = '2024-04-22T10:00:00Z';
//     // Accessing .isoDate (which is a branded string getter)
//     expect(engine.is('isoDate', valid)).toBe(true);
//   });

//   it('should fail on invalid date format', () => {
//     expect(engine.is('isoDate', '04-22-2024')).toBe(false);
//   });

//   it('should allow runtime registration of new patterns', () => {
//     engine.register('LegacyId', '^ID_\\d+$');

//     // Test the new pattern
//     expect(engine.is('LegacyId' as any, 'ID_99')).toBe(true);

//     // Verify it exists in the list
//     expect(engine.list()).toContain('LegacyId');
//   });
// });
