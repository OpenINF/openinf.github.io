import yarnpkgShell from '@yarnpkg/shell';

process.exitCode = await yarnpkgShell.execute(`npx ec -exclude 'LICENSE'`);
