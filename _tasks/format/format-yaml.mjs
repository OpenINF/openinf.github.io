import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = [`npx prettier --write {*.yml,*.yaml}`];

console.log('\r\nAutoformatting all YAML files using Prettier\r\n');

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
