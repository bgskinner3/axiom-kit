import { isSolid, getSolid } from '../src';
import { IS_SOLID_CONFIG_ITEMS } from '../src/models';

describe('isSolid Bridge (Auto-Registration)', () => {
  it('should register metadata in the vault when isSolid is called', () => {
    const data = { id: '123', nested: { tester: 0 } };

    // 1. Simulate what the Transformer would inject
    const injectedMetadata = {
      key: 'User',
      area: 'test.ts',
      version: IS_SOLID_CONFIG_ITEMS.solidVersion,
      shape: {
        kind: 'object',
        properties: { id: { kind: 'primitive', type: 'string' } },
      },
    };

    // 2. Execute the "Ghost" function (now Solid)
    // In real life, the transformer fills that 2nd argument for you.
    const result = isSolid<'User', { id: string }>(
      data,
      injectedMetadata as any,
    );

    // 3. Verify the "Side Effect" (The Database)
    const stored = getSolid('User');

    expect(result).toBe(true);
    expect(stored).toBeDefined();
    expect(stored?.key).toBe('User');
    expect(stored?.shape.kind).toBe('object');
  });
  it('should handle complex nested objects', () => {
    const data = {
      id: '123',
      profile: { username: 'bgskinner' },
    };

    const metadata = {
      key: 'UserProfile',
      area: 'test.ts',
      version: IS_SOLID_CONFIG_ITEMS.solidVersion,
      shape: {
        kind: 'object',
        properties: {
          id: { kind: 'primitive', type: 'string' },
          profile: {
            kind: 'object',
            properties: {
              username: { kind: 'primitive', type: 'string' },
            },
          },
        },
      },
    };

    const result = isSolid<'UserProfile', any>(data, metadata as any);
    // const stored = getSolid('UserProfile');
    // console.log(JSON.stringify(stored, null, 2));
    expect(result).toBe(true);
  });
});
