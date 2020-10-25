import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'lint:js': `eslint --ext=.js,.mjs .`,
};

process.exitCode = await yarnpkgShell.execute(scripts['lint:json']);
