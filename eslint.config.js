import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
  {
    // 1. Unified Ignores
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**', 'skeleton/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 2. Global Logic & Parser Settings
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parserOptions: {
        // 🚀 THE FIX: This finds the tsconfig in the nearest parent folder
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
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { 
          argsIgnorePattern: '^_', 
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_' 
        },
      ],
    },
  },
  {
    // 3. Specialized rules for Solid-Core/Transformers
    files: ['packages/transformer/**/*.ts'], // Updated path
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // 4. Test Overrides
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
