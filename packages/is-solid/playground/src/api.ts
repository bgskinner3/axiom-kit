import { isSolid, getSolidErrors } from 'is-solid';

export function processResponse(data: unknown) {
  // ✨ Intellisense should work here for 'PROFILE' thanks to the Ghost layer
  if (isSolid<'PROFILE', any>(data)) {
    console.log('✅ API: Valid profile received for:', data.username);
    return true;
  }

  console.error('❌ API: Invalid data structure:', getSolidErrors('PROFILE'));
  return false;
}
