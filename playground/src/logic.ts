import { isSolid, getSolidErrors } from 'is-solid';
import type { User } from './types';
export function validateUser(data: unknown) {
  if (isSolid<'USER', User>(data)) {
    console.log('✅ Data is a valid USER');
    return true;
  }
  console.log('❌ Validation Failed:', getSolidErrors('USER'));
  return false;
}
