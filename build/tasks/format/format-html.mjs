import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = ['npx prettier --write "*.html"'];

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
