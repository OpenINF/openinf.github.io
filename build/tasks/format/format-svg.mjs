import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = ['npx prettier --write "*.svg"'];

console.log('\r\nAutoformatting all SVG files using Prettier\r\n');

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
