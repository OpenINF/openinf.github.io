/**
 * @file Dynamic Babel configuration.
 *
 * Notes:
 * 1. Plugins run before presets.
 * 2. Plugin ordering is first to last.
 * 3. Preset ordering is reversed (last to first).
 *
 * @author The OpenINF Authors & Friends
 * @module {ES6Module} .config/babel
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @see https://babeljs.io/docs/en/plugins#plugin-ordering
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { packageConfig } from 'shared/constants';

// -----------------------------------------------------------------------------
// Presets
// -----------------------------------------------------------------------------

const nodeDevelopmentPresets = [
  [
    // https://babeljs.io/docs/en/babel-preset-env
    '@babel/preset-env',
    {
      // Module transformations are unnecessary as Node is in ES module context.
      // Additionally, CommonJS cannot be treeshaken.
      modules: false,
      targets: {
        esmodules: false,
        node: true,
      },
      useBuiltIns: 'entry',
      corejs: packageConfig.dependencies['core-js'],
    },
  ],
];

const nodeProductionPresets = [
  [
    // https://babeljs.io/docs/en/babel-preset-env
    '@babel/preset-env',
    {
      // Module transformations are necessary as Node is in CommonJS context.
      // modules: false,
      // modules: '',
      targets: {
        esmodules: true,
        node: 'current',
      },
      loose: true,
      include: ['@babel/plugin-transform-classes'],
      // 'exclude': ['transform-es2015-typeof-symbol'],
      useBuiltIns: 'usage',
      corejs: {
        version: packageConfig.dependencies['core-js'],
        proposals: true,
      },
    },
  ],
];

// -----------------------------------------------------------------------------
// Plugins
// -----------------------------------------------------------------------------

const commonNodePlugins = [
  // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
  // [
  //   '@babel/plugin-proposal-class-properties',
  //   {
  //     'loose': true,
  //   },
  // ],
  // https://babeljs.io/docs/en/babel-plugin-syntax-import-meta
  '@babel/plugin-syntax-import-meta',
  // https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import
  '@babel/plugin-syntax-dynamic-import',
  // '@babel/plugin-proposal-object-rest-spread',
  'babel-plugin-dynamic-import-node-sync',
  // '@babel/plugin-transform-classes',
  // https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs
  [
    '@babel/plugin-transform-modules-commonjs',
    {
      allowTopLevelThis: false,
    },
  ],
];

const nodeDevelopmentPlugins = [
  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: { version: 3, proposals: true },
      helpers: true,
      regenerator: true,
      useESModules: false,
    },
  ],
];

const nodeProductionPlugins = [
  // https://babeljs.io/docs/en/babel-plugin-transform-runtime
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: { version: 3, proposals: true },
      helpers: true,
      regenerator: true,
      useESModules: true,
    },
  ],
];

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

const config = (api) => {
  // https://babeljs.io/docs/en/config-files#apienv
  const envName = api.env();

  // eslint-disable-next-line no-console
  console.log(`Babel was loaded with the '${envName}' environment.`);

  switch (envName) {
    case 'development':
      return {
        presets: nodeDevelopmentPresets,
        plugins: commonNodePlugins.concat(nodeDevelopmentPlugins),
        ignore: [],
      };
    case 'production':
      return {
        presets: nodeProductionPresets,
        plugins: commonNodePlugins.concat(nodeProductionPlugins),
        ignore: [],
      };
    default:
      return {
        presets: nodeDevelopmentPresets,
        plugins: commonNodePlugins.concat(nodeDevelopmentPlugins),
        ignore: [],
      };
  }
};

export default config;
