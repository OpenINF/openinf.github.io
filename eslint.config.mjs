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

import path from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import pluginJs from '@eslint/js';

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
	{languageOptions: {globals: globals.browser}},
	...compat.extends('xo'),
];
