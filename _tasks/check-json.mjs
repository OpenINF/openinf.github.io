import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'lint:json': `prettier --check **/*.json`,
};

process.exitCode = await yarnpkgShell.execute(scripts['lint:json']);
