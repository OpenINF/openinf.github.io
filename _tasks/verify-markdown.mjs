import yarnpkgShell from '@yarnpkg/shell';

const scripts = [
  `eslint --ext=.md .`, // validate & style-check JS code blocks
  `remark -qf .`, // check Markdown style
];

scripts.forEach(async (v, i) => {
  await yarnpkgShell.execute(scripts[i]);
});
