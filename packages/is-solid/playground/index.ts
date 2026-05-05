import { isSolid, getSolid } from 'is-solid';

type TUser = { id: string; name: string };

// 1. Seed the database (Miner check)
isSolid<'USER', TUser>();

// // 2. Validate data (Engine & Vault check)
// const data = { id: 1, name: 'Alice' }; // id is number, should fail
console.log('📍 Metadata Area:', getSolid('USER')?.area);
// if (!isSolid<'USER'>(data)) {
//   console.log('❌ Validation failed as expected');
//   console.log('📍 Metadata Area:', getSolid('USER')?.area);
// }
