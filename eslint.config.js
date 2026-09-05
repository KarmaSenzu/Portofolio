import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Ignore motion, AnimatePresence (used as JSX namespaces like motion.div)
      // Ignore uppercase vars for constants
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^(motion|AnimatePresence|[A-Z_])',
        argsIgnorePattern: '^_'
      }],
      // Disable setState in effect warning - valid pattern for resetting state on dependency change
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
