import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import markdown from '@eslint/markdown';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const flatCompat = new FlatCompat();

export default tseslint.config(
    {
        ignores: [
            'dist',
            'coverage',
            'node_modules',
            '*.log',
            'vite.config.ts',
            'tailwind.config.js',
            'postcss.config.js',
        ],
    },

    // --- Basis-Konfiguration für TypeScript & JavaScript ---
    {
        files: ['src/**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2022,
            globals: globals.browser,
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        extends: [
            js.configs.recommended,
            importPlugin.flatConfigs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
        ],
        settings: {
            'import/resolver': { typescript: {} },
        },
        rules: {
            'no-irregular-whitespace': 'off',
            ...eslintConfigPrettier.rules,
        },
    },

    // --- React-spezifische Regeln nur für TSX ---
    {
        files: ['src/**/*.{tsx,jsx}'],
        extends: [
            ...fixupConfigRules(flatCompat.extends('plugin:react/recommended')),
            ...fixupConfigRules(flatCompat.extends('plugin:react/jsx-runtime')),
        ],
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    // --- Markdown Linting nur für .md ---
    {
        files: ['**/*.md'],
        extends: [...markdown.configs.recommended],
        rules: {
            'markdown/no-multiple-h1': 'off',
        },
    },
);
