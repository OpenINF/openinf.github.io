/**
 * @file ESLint configuration (flat format).
 *
 * @author The OpenINF Authors & Friends
 * @module {type ES6Module} /eslint.config
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @see https://eslint.org/docs/latest/use/configure/plugins
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import globals from 'globals';
import markdown from 'eslint-plugin-markdown';
import eslintConfigBiome from 'eslint-config-biome';

import {FlatCompat} from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// Mimic CommonJS variables (as we are not in CommonJS context).
const __filename = import.meta.filename; // Current module's file name
const __dirname = import.meta.dirname; // Current module's directory name
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
	{languageOptions: {globals: globals.browser}},

	// other configs,
    eslintConfigBiome,
	...compat.extends('eslint-plugin-prettier'),

	// Applies to all JavaScript files
	{
		rules: {
			strict: 'error',
		},
	},

	// Applies to Markdown files
	{
		files: ['**/*.md'],
		plugins: {
			markdown,
		},
		processor: 'markdown/markdown',
	},

	// Applies only to JavaScript blocks inside of Markdown files
	{
		files: ['**/*.md/*.js'],
		rules: {
			strict: 'off',
		},
	},
];
