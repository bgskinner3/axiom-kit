import { isSolid, getSolid } from 'is-solid';

interface Category {
  name: string;
  subCategories: Category[];
}

// 1. Passive Registration
isSolid<'CAT', Category>();

// 2. Active Validation
const data: Category = {
  name: 'Electronics',
  subCategories: [{ name: 'Phones', subCategories: [] }],
};

console.log('Validating CAT:', isSolid<'CAT', any>(data));
console.log('Vault Metadata:', getSolid('CAT')?.area);
