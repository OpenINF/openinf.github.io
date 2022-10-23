import yarnpkgShell from '@yarnpkg/shell';

let code = 0;
const scripts = [
  "find . -type d \\( -name node_modules -o -name vendor \\) -prune -false -o -name '*.yml' -o -name '*.yaml' | xargs bundle exec yaml-lint", // validate
  'npx prettier -c {*.yml,*.yaml}', // style-check
];

scripts.forEach(async (v, i) => {
  code = await yarnpkgShell.execute(scripts[i]);
  process.exitCode = code > 0 ? code : 0;
});
