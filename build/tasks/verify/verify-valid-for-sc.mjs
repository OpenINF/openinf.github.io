import spawn from 'cross-spawn';

const result = await spawn('shellcheck', ['tools/devcontainer/*.fish'], {
  stdio: 'inherit',
});

process.exitCode = result.exitCode;
