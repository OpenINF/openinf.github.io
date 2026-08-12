/**
 * @file Verify only the files meant to be run are marked executable.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-file-modes
 */

import { execFileSync } from 'node:child_process';
import { open } from 'node:fs/promises';

// The mode git records, rather than the mode on disk: that is what other
// clones receive, and it is the only one a checkout on a filesystem without
// permission bits still reports faithfully.
const tracked = execFileSync('git', ['ls-files', '--stage', '-z'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)
  .map((entry) => {
    const [mode] = entry.split(' ');

    return { mode, path: entry.slice(entry.indexOf('\t') + 1) };
  });

/**
 * Reads the first two bytes, which is all it takes to know whether a file
 * expects to be run as a program.
 * @param {string} path The file to inspect.
 * @returns {Promise<boolean>} Whether the file opens with `#!`.
 */
const hasShebang = async (path: string) => {
  const file = await open(path);

  try {
    const { buffer, bytesRead } = await file.read(Buffer.alloc(2), 0, 2, 0);

    return bytesRead === 2 && buffer.toString('latin1') === '#!';
  } finally {
    await file.close();
  }
};

const offenders: string[] = [];

for (const { mode, path } of tracked) {
  // Symlinks (120000) and submodules (160000) carry neither the bit nor a
  // shebang to read, so only the two regular-file modes are of interest.
  if (mode !== '100755' && mode !== '100644') continue;

  const executable = mode === '100755';
  const runnable = await hasShebang(path);

  if (executable && !runnable) {
    offenders.push(`  ${path} is executable but has no \`#!\` line`);
  } else if (runnable && !executable) {
    offenders.push(`  ${path} opens with \`#!\` but is not executable`);
  }
}

if (offenders.length > 0) {
  console.error(
    `File modes disagree with what the files are:\n${offenders.join('\n')}\n\n` +
      'Run `chmod +x` or `chmod -x` to settle it. Nothing else in the ' +
      'pipeline looks at modes, which is how 23 files came to claim they ' +
      'were programs.'
  );
  process.exitCode = 1;
}
