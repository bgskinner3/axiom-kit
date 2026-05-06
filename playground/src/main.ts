import './types';
import { validateUser } from './logic';

validateUser({ id: 'u1', age: '25' });
console.log('Playground active: Types registered.');
// import './types'; // Seeds the Vault
// import { processResponse } from './api';

// const mockPayload = {
//   username: 'solid_dev',
//   tags: ['typescript', 'miner'],
//   settings: {
//     theme: 'blue', // 🚨 ❌ Error: Not 'light' or 'dark'
//     notifications: true,
//   },
// };

// processResponse(mockPayload);
// import { isSolid, getSolid } from 'xalor';

// interface Category {
//   name: string;
//   subCategories: Category[];
// }

// // 1. Passive Registration
// isSolid<'CAT', Category>();

// // 2. Active Validation
// const data: Category = {
//   name: 'Electronics',
//   subCategories: [{ name: 'Phones', subCategories: [] }],
// };

// console.log('Validating CAT:', isSolid<'CAT', any>(data));
// console.log('Vault Metadata:', getSolid('CAT')?.area);
// import './types'; // 1. Seed the database
// import { processResponse } from './api';
// import { getSolid } from 'xalor';

// console.log('💎 SOLID PLAYGROUND: TEST RUN');
// console.log('----------------------------');

// // 2. Log Metadata - Verify the "Miner" worked
// const meta = getSolid('PROFILE');
// console.log('📂 Metadata Found:', !!meta);
// if (meta) {
//   console.log('📍 Mined Area:', meta.area);
//   console.log('🧩 Shape Kind:', meta.shape.kind);
// }

// console.log('\n🚀 Testing Valid Data:');
// processResponse({
//   username: 'solid_dev',
//   tags: ['ts'],
//   settings: { theme: 'dark', notifications: true },
// });

// console.log('\n🚨 Testing Corrupt Data:');
// processResponse({
//   username: 123, // Wrong type
//   settings: { theme: 'blue' }, // Wrong literal & missing notification
// });
