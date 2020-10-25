import yarnpkgShell from '@yarnpkg/shell';

process.exitCode = await yarnpkgShell.execute(`stylelint index.html`);
