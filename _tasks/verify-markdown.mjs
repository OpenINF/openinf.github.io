import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = [
  `npx eslint --ext=.md .`, // validate & style-check JS code blocks
  `npx remark -qf .`, // check Markdown style
];

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
