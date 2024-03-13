import { execute } from '@yarnpkg/shell';
// import { echoTaskRunning } from '../util.mjs';

// echoTaskRunning('verify-ec-harmony', import.meta.url);

let exitCode = 0;
const scripts = ["editorconfig-checker -config '.ecrc.json'"];

for await (const element of scripts) {
  try {
    exitCode = await execute(`pnpm exec ${element}`);
  } catch (p) {
    exitCode = p.exitCode;
  }
  process.exitCode = exitCode > 0 ? exitCode : 0;
}

// eslint-disable-next-line unicorn/no-process-exit
process.exit(0);
