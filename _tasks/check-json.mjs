import yarnpkgShell from '@yarnpkg/shell';

process.exitCode = await yarnpkgShell.execute(`eslint --ext=.json .`);
