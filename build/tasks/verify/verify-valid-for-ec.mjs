import spawn from 'cross-spawn';

const result = await spawn('npx ec', { stdio: 'inherit' });

process.exitCode = result;
