'use strict';

const { concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    format: {
      all: 'for i in _tasks/format/*.mjs; do node "$i"; done',
      css: 'node build/tasks/format/format-css.mjs',
      html: 'node build/tasks/format/format-html.mjs',
      js: 'node build/tasks/format/format-js.mjs',
      json: 'node build/tasks/format/format-json.mjs',
      md: 'node build/tasks/format/format-md.mjs',
      svg: 'node build/tasks/format/format-svg.mjs',
      yaml: 'node build/tasks/format/format-yaml.mjs',
    },
    test: 'nps verify.all',
    verify: {
      all: 'for i in _tasks/verify/*.mjs; do node "$i"; done',
      css: 'node build/tasks/verify/verify-css.mjs',
      html: 'node build/tasks/verify/verify-html.mjs',
      js: 'node build/tasks/verify/verify-js.mjs',
      json: 'node build/tasks/verify/verify-json.mjs',
      md: 'node build/tasks/verify/verify-md.mjs',
      svg: 'node build/tasks/verify/verify-svg.mjs',
      validForEC: 'node build/tasks/verify/verify-valid-for-ec.mjs',
      validForSC: 'node build/tasks/verify/verify-valid-for-sc.mjs',
      yaml: 'node build/tasks/verify/verify-yaml.mjs',
    },

    // TODO(DerekNonGeneric):
    // learn more about NPS Utils here: https://npm.im/nps-utils
    validate: NPSUtils.concurrent.nps('lint', 'test', 'build'),
  },
};
