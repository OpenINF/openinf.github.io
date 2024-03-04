module.exports = {
  scripts: {
    format: {
      all: 'for i in _tasks/format/*.mjs; do node "$i"; done',
      css: 'node _tasks/format/format-css.mjs',
      html: 'node _tasks/format/format-html.mjs',
      js: 'node _tasks/format/format-js.mjs',
      json: 'node _tasks/format/format-json.mjs',
      md: 'node _tasks/format/format-md.mjs',
      svg: 'node _tasks/format/format-svg.mjs',
      yaml: 'node _tasks/format/format-yaml.mjs',
    },
    test: 'nps verify.all',
    verify: {
      all: 'for i in _tasks/verify/*.mjs; do node "$i"; done',
      css: 'node _tasks/verify/verify-css.mjs',
      editorconfigCompliance:
        'node _tasks/verify/verify-editorconfig-compliance.mjs',
      html: 'node _tasks/verify/verify-html.mjs',
      js: 'node _tasks/verify/verify-js.mjs',
      json: 'node _tasks/verify/verify-json.mjs',
      md: 'node _tasks/verify/verify-md.mjs',
      svg: 'node _tasks/verify/verify-svg.mjs',
      yaml: 'node _tasks/verify/verify-yaml.mjs',
    },
  },
};
