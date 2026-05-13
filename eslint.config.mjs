// @ts-check
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist*/**', 'node_modules/**'] },

  // Base
  js.configs.recommended,

  // Language options — all files are Node.js CommonJS
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // preload.js runs in the renderer process — needs browser globals
  {
    files: ['electron/preload.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  // Project rules
  {
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-useless-assignment': 'off',
    },
  },

  // Prettier — must be last
  prettierConfig,
];
