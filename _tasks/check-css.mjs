import yarnpkgShell from '@yarnpkg/shell';

const scripts = {
  'stylelint': `npx stylelint ./index.html`,
};

(async function() {
  process.exitCode = await yarnpkgShell.execute(scripts['stylelint']);
})();
