import yarnpkgShell from '@yarnpkg/shell';
import vnu from 'vnu-jar';

const scripts = {
  'validate-html': `npx html-validate ./index.html`,
  'vnu-jar': `java -jar ${vnu} ./index.html`,
};

(async function() {
  process.exitCode = await yarnpkgShell.execute(scripts['validate-html']);
  process.exitCode = await yarnpkgShell.execute(scripts['vnu-jar']);
})();
