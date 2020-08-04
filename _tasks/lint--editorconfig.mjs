import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'editorconfig-checker': `ec -exclude 'LICENSE'`,
};

(async function() {
  process.exitCode = await yarnpkgShell.execute(scripts['editorconfig-checker']);
})();
