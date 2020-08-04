import yarnpkgShell from '@yarnpkg/shell';
import vnu from 'vnu-jar';

const scripts = {
  'vnu-jar': `java -jar ${vnu} --svg ./logo.svg`,
};

(async function() {
  process.exitCode = await yarnpkgShell.execute(scripts['vnu-jar']);
})();
