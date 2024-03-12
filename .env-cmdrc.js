'use strict';

/* eslint-disable
   no-global-assign,
   no-native-reassign,
   @typescript-eslint/no-var-requires */

require = require('esm')(module /* , options */);
module.exports = require('./.config/env-cmd').default;
