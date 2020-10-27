import yarnpkgShell from '@yarnpkg/shell';

const scripts = [
  `eslint --ext=.json .`, // validate
  `prettier -c {*.json,.*.json}`, // style-check
];

scripts.forEach(async (v, i) => {
  await yarnpkgShell.execute(scripts[i]);
});
