import yarnpkgShell from '@yarnpkg/shell';
import vnu from 'vnu-jar';

process.exitCode = await yarnpkgShell.execute(`java -jar ${vnu} index.html`);
