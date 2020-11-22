import yarnpkgShell from '@yarnpkg/shell';

process.exitCode = await yarnpkgShell.execute(`npx stylelint index.html`);
