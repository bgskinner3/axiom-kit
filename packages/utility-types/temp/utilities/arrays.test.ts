// __tests__/types/primitives/object.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Array Utilities Type Checks', () => {
  it('should pass all type assertions in arrays.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/arrays.test.ts'),
    );
  }, 10000);
});
