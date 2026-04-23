// async.test.ts
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('Async Utilities Type Checks', () => {
  it('should pass all type assertions in async.test-d.ts', async () => {
    await expectTypeTestsToPassAsync(
      path.join(__dirname, 'test-setup/async.test.ts'),
    );
  }, 10000);
});
