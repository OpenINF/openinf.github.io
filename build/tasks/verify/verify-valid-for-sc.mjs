const spawn = require('cross-spawn');

const result = await spawn('shellcheck', { stdio: 'inherit' });

process.exitCode = result;
