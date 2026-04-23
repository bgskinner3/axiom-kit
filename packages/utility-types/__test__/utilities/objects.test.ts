// objects.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Objects Utilities Type Checks', () => {
  it('should pass all type assertions in objects.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup-object/index.test-d.ts'),
    );
  }, 10000);
});
