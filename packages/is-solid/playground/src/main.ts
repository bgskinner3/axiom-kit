import './types'; // Seeds the Vault
import { processResponse } from './api';

const mockPayload = {
  username: 'solid_dev',
  tags: ['typescript', 'miner'],
  settings: {
    theme: 'blue', // 🚨 ❌ Error: Not 'light' or 'dark'
    notifications: true,
  },
};

processResponse(mockPayload);
// import { isSolid, getSolid } from 'is-solid';

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
