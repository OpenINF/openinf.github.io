import yarnpkgShell from '@yarnpkg/shell';
import vnu from 'vnu-jar';

const scripts = {
  'vnu-jar': `java -jar ${vnu} ./index.html`,
};

process.exitCode = await yarnpkgShell.execute(scripts['vnu-jar']);
