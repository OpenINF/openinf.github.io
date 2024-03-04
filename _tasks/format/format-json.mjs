import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = ['npx prettier --write {*.json,*.jsonc}'];



scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
