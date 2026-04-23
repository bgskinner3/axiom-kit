import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
  {
    // 1. GLOBAL IGNORES
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'skeleton/**',
      'eslint.config.js',
      '**/jest.config.*',
      '**/tsup.config.ts',
    ],
  },
  // 2. BASE CONFIGS
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 3. CORE LOGIC & PARSER
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parserOptions: {
        // 🚀 THE FIX: Use a more resilient glob for monorepo tsconfigs
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      // 🚀 THE FIX: Use the specific plugin object
      prettier: prettierPlugin,
    },
    rules: {
      // 🚀 THE FIX: Combine Prettier plugin + Prettier config
      ...prettierConfig.rules,
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
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // 4. TEST OVERRIDES
    files: ['**/*.{test,spec}.ts', '**/__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
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
