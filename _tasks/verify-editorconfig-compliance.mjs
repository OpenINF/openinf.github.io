import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'editorconfig-checker': `ec -exclude 'LICENSE'`,
};

process.exitCode = await yarnpkgShell.execute(scripts['editorconfig-checker']);
