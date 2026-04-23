// unions.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Unions Utilities Type Checks', () => {
  it('should pass all type assertions in unions.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/unions.test.ts'),
    );
  }, 10000);
});
