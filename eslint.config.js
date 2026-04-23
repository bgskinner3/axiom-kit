import js from '@eslint/js';
import tseslint from 'typescript-eslint'; 
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    // 1. GLOBAL IGNORES (Necessary for Monorepo performance)
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', 'skeleton/**'],
  },
  // 2. BASE CONFIGS
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 3. CORE LOGIC & PARSER (The Merged Engine)
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parserOptions: {
        // Fix: Allows ESLint to see into every sub-package
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        // Your custom explicit globals from the original
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // YOUR ORIGINAL UNUSED-VARS LOGIC
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_', 
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        },
      ],
    },
  },
  {
    // 4. TEST OVERRIDES (From your original)
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'object-curly-spacing': ['error', 'always', { objectsInObjects: true }],
    },
  }
);


// export default tseslint.config(
//   {
//     // 1. Unified Ignores
//     ignores: [
//       '**/node_modules/**',
//       '**/dist/**',
//       '**/coverage/**',
//       'skeleton/**',
//     ],
//   },
//   js.configs.recommended,
//   ...tseslint.configs.recommended,
//   {
//     // 2. Global Logic & Parser Settings
//     files: ['**/*.ts', '**/*.tsx', '**/*.js'],
//     languageOptions: {
//       parserOptions: {
//         // 🚀 THE FIX: This finds the tsconfig in the nearest parent folder
//         project: ['./tsconfig.json', './packages/*/tsconfig.json'],
//         tsconfigRootDir: import.meta.dirname,
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//         ...globals.jest,
//       },
//     },
//     plugins: {
//       prettier: prettier,
//     },
//     rules: {
//       'prettier/prettier': 'error',
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         {
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^_',
//         },
//       ],
//     },
//   },
//   {
//     // 3. Specialized rules for Solid-Core/Transformers
//     files: ['packages/transformer/**/*.ts'], // Updated path
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'warn',
//     },
//   },
//   {
//     // 4. Test Overrides
//     files: ['**/*.test.ts', '**/*.spec.ts'],
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off',
//     },
//   },
// );
