import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = ['npx prettier --write "*.html"'];

console.log('\r\nAutoformatting all HTML files using Prettier\r\n');

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
