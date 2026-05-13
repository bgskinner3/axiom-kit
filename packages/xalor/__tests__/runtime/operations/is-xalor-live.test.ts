// __tests__/engine/guard/is-solid.test.ts
/**
  pnpm run test -- __tests__/runtime/operations/is-xalor-live.test.ts
 */
// describe('Guard ISXalor', () => {
//   it('is a placeholder', () => {
//     expect(true).toBe(true);
//   });
// });

// import '@bgskinner2/xalor/generated';
import { registerXalor } from '@bgskinner2/xalor';
// import { isXalor } from '../../../../src/operations';
// import { Registry } from '../../../../src/vault';
// import type { TSolidMetadata } from '../../../../src/models/types';
import { XalethorService } from '../../../src/xalor-service';
// import { ISolidRegistry } from '@bgskinner2/xalor';
export interface User {
  id: number;
  name: string;
}
export interface UserTwo {
  id: number;
  name: string;
}
export type TFUCKKKKTT = {
  myLeftNut: number;
  myRightNut: string;
  additional: {
    id: number;
    name: string;
  };
};
export type TFUCKKK20 = {
  myLeftNut: number;
  myRightNut: string;
};
export type TTHISISBULL = {
  myNuts: string;
  helloWorld: {
    id: number;
  };
};
describe('Cache Generation Test', () => {
  test('Triggering the Bunker', () => {
    /**
     * 🚀 THIS IS THE KEY:
     * When the Miner sees this GENERIC call, it extracts the metadata.
     * Because 'isTest' is true, the Transformer will write this
     * to the .cache file the moment this file is compiled by ts-jest.
     */
    registerXalor<'USER_PERSIST_TEST', User>();
    registerXalor<'USER_TEST_2', UserTwo>();

    const userData = {
      id: 0,
      more: {
        name: 'BRENANN',
      },
    };
    registerXalor<'USER_TEST_4'>(userData);
    registerXalor<'TFUCKKKKTT', TFUCKKKKTT>();
    // isXalor<"">()
    // type TredeclareUSer2 = isXalor<'USER_PERSIST_TEST'>;
    // isXalor<"">();
    // const y = isXalor<'TFUCKKKKTT'>(undefined);
    // isXalor<'TFUCKKKKTT', TFUCKKKKTT>();
    // isXalor<''>();
    // isXalor<"">
    // isXalor<''>;
    // Check RAM
    expect(XalethorService.has('USER_PERSIST_TEST')).toBe(true);
    // expect(true).toBe(true);
  });
});
