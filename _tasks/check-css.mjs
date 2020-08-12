import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'stylelint': `npx stylelint ./index.html`,
};

process.exitCode = await yarnpkgShell.execute(scripts['stylelint']);
