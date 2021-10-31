import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = [`npx prettier --write {*.json,*.jsonc}`];

console.log('\r\nAutoformatting all JSON files using Prettier\r\n');

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
