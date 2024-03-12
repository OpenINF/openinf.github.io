
nodeProductionOptions = nodeProductionOptions.join(' ');
nodeDevelopmentOptions = nodeDevelopmentOptions.join(' ');

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

export default {
  'development': {
    // Development
    // https://github.com/visionmedia/debug#environment-variables
    'DEBUG': '*',
    // https://www.dynatrace.com/news/blog/the-drastic-effects-of-omitting-node-env-in-your-express-js-applications/
    // https://dzone.com/articles/what-you-should-know-about-node-env
    'NODE_ENV': 'development',
    // https://nodejs.org/api/all.html#cli_node_options_options
    'NODE_OPTIONS': nodeDevelopmentOptions,
  },
  'production': {
    // Production
    // https://github.com/visionmedia/debug#environment-variables
    'DEBUG': false,
    // https://nodejs.org/en/docs/guides/simple-profiling/
    // https://webpack.js.org/guides/environment-variables/
    'NODE_ENV': 'production',
    // https://nodejs.org/api/all.html#cli_node_options_options
    'NODE_OPTIONS': nodeProductionOptions,
  },
};
