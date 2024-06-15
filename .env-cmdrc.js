// biome-ignore lint/suspicious/noGlobalAssign: <explanation>
require = require('esm')(module /* , options */);
module.exports = require('./.config/env-cmd').default;
