/**
 * @file Compare vendored third-party files against what upstream serves.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/check-vendored
 *
 * Outside `verify/` on purpose, the way `verify-pull-request.mts` is: it
 * reaches the network, and every task in that directory runs on every pull
 * request. An upstream that is slow, moved or unreachable would fail changes
 * that have nothing to do with it.
 *
 * The exit code carries both answers at once, since one file drifting says
 * nothing about whether another was reachable: bit 1 is set when a copy has
 * drifted, bit 2 when one could not be compared. Drift is a thing to act on
 * and an upstream nobody can reach is not, so neither hides the other.
 */

import { readFile } from 'node:fs/promises';

/** One vendored file and where it comes from. */
type Vendored = {
  /** Where the copy lives, relative to the repository root. */
  file: string;
  /** What upstream serves, which the copy is expected to equal byte for byte. */
  upstream: string;
  /** Where to read about a change. */
  project: string;
};

/**
 * A copy here is upstream's bytes and nothing else. Anything this project
 * needs to say about a file goes beside it rather than inside it, so that
 * telling whether it has drifted stays a comparison rather than a judgement.
 */
const VENDORED: Vendored[] = [
  {
    file: '_assets/js/vendor/count.js',
    upstream: 'https://gc.zgo.at/count.js',
    project: 'https://github.com/arp242/goatcounter',
  },
];

/** How long to wait on an upstream before giving up, in milliseconds. */
const TIMEOUT = 30_000;

/** Bits of the exit code. Both can be set; neither masks the other. */
const MATCHED = 0;
const DRIFTED = 1;
const UNCHECKED = 2;

/**
 * Says what went wrong in a sentence rather than a stack trace.
 * @param {unknown} error Whatever was thrown.
 * @returns {string} Its message.
 */
const reasonOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Reports the first line each version differs at, since a whole diff of a
 * long file says less than where to start looking.
 * @param {string} ours What is in the repository.
 * @param {string} theirs What upstream serves.
 * @returns {string} A description of the first difference.
 */
function firstDifference(ours: string, theirs: string) {
  const a = ours.split('\n');
  const b = theirs.split('\n');

  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    if (a[index] !== b[index]) {
      return [
        `first differs at line ${index + 1}:`,
        `  ours:     ${a[index] ?? '(end of file)'}`,
        `  upstream: ${b[index] ?? '(end of file)'}`,
      ].join('\n');
    }
  }

  return 'the files differ in how they end';
}

const drifted: string[] = [];
const unchecked: string[] = [];

for (const { file, upstream, project } of VENDORED) {
  let ours: string;
  let theirs: string;

  try {
    ours = await readFile(file, 'utf8');
  } catch (error) {
    unchecked.push(`\`${file}\` could not be read: ${reasonOf(error)}`);
    continue;
  }

  try {
    const response = await fetch(upstream, {
      signal: AbortSignal.timeout(TIMEOUT),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    theirs = await response.text();
  } catch (error) {
    unchecked.push(`\`${file}\`: ${upstream} — ${reasonOf(error)}`);
    continue;
  }

  if (ours === theirs) {
    console.log(`\`${file}\` matches ${upstream}`);
    continue;
  }

  drifted.push(
    [
      `### \`${file}\``,
      '',
      `Upstream: ${upstream}`,
      `Project: ${project}`,
      '',
      `Ours is ${ours.length} bytes, upstream is ${theirs.length}.`,
      '',
      '```text',
      firstDifference(ours, theirs),
      '```',
      '',
      'To take what upstream serves:',
      '',
      '```bash',
      `curl -fsSL ${upstream} -o ${file}`,
      '```',
    ].join('\n')
  );
}

// Everything goes to stdout, including what went wrong: whatever runs this
// keeps only that, and a reason written anywhere else is a reason lost.
if (unchecked.length > 0) {
  console.log('');
  console.log('Could not be compared:');
  for (const problem of unchecked) console.log(`- ${problem}`);
}

if (drifted.length > 0) {
  console.log('');
  console.log(drifted.join('\n\n'));
}

process.exitCode =
  MATCHED |
  (drifted.length > 0 ? DRIFTED : MATCHED) |
  (unchecked.length > 0 ? UNCHECKED : MATCHED);
