// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

const config = (api) => {
	// https://babeljs.io/docs/en/config-files#apienv
	const envName = api.env();
  
	// eslint-disable-next-line no-console
	console.log(`Babel was loaded with the "${envName}" environment.`);
  
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
