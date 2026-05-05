import { isSolid, getSolidErrors } from 'is-solid';

export function processResponse(data: unknown) {
  if (isSolid<'PROFILE', unknown>(data)) {
    console.log('✅ Success: Profile is Solid');
    return true;
  }

  const errors = getSolidErrors('PROFILE');
  console.log(`❌ Validation Failed (${errors.length} errors):`);

  errors.forEach((err, i) => {
    console.log(`  [${i + 1}] PATH: ${err.path}`);
    console.log(`      ISSUE: ${err.message}`);
    console.log(`      DATA:  ${err.received}`);
  });

  return false;
}
