/**
 * @file Verify the runtime versions this project pins in several places agree.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-runtimes
 *
 * Each file exists for its own tool, so none of them can be removed in favour
 * of the others: .nvmrc is what nvm reads for a bare `nvm use`, `engines` is
 * what pnpm enforces and what setup-node is pointed at, and `packageManager`
 * is the version pnpm fetches to run as. What is left to guard is that they
 * say the same thing.
 *
 * post-create.sh already compares .nvmrc against `engines.node`, but it runs
 * when somebody builds the dev container and nowhere else. CI reads
 * package.json alone, so a change that moved one and not the other would pass
 * every check and then fail for the next person to open the container.
 */

import { readFile } from 'node:fs/promises';

/** What package.json says, of the fields this task compares. */
type Manifest = {
  engines?: { node?: string; pnpm?: string };
  packageManager?: string;
};

const manifest: Manifest = JSON.parse(await readFile('package.json', 'utf8'));
const nvmrc = (await readFile('.nvmrc', 'utf8')).trim();
const workspace = await readFile('pnpm-workspace.yaml', 'utf8');

/**
 * Whether pnpm is told to treat `engines` as a requirement rather than a
 * note. Read with a line match rather than a YAML parser because
 * pnpm-workspace.yaml is a flat settings file: the key is either at column
 * zero or it is not this setting. That reasoning does not extend to a nested
 * document, and `verify.workflows` parses its own for exactly that reason.
 *
 * The space after the colon is required, not tidiness. `engineStrict:true` is
 * not a mapping in YAML at all -- it parses as the string
 * `"engineStrict:true"` -- so a file saying that has the setting nowhere,
 * while a pattern tolerant of the missing space would report it present.
 * `\r?` is there so a checkout with CRLF endings reads the same.
 *
 * A trailing `# comment` is allowed, because YAML reads the value as `true`
 * either way and refusing it would fail the dev container's setup over a
 * note somebody left themselves.
 *
 * Column zero is required as well. YAML would accept a root mapping that
 * is indented, and this rejects one -- but accepting indentation would
 * equally accept `engineStrict:` nested under some other key, which sets
 * nothing. Of the two ways to be wrong, complaining about a file nobody
 * writes is the better one.
 */
const engineStrict = /^engineStrict:[ \t]+true[ \t]*(?:#.*)?\r?$/m.test(
  workspace
);
const node = manifest.engines?.node ?? '';
const pnpm = manifest.engines?.pnpm ?? '';

/**
 * `packageManager` is `pnpm@<version>` and may carry a `+sha…` integrity
 * suffix, which is not part of the version.
 */
const packaged =
  (manifest.packageManager ?? '').replace(/^pnpm@/, '').split('+')[0] ?? '';

const problems: string[] = [];

// An exact version, not a range: `engineStrict` turns `engines` into a
// requirement, and a range would let the two drift apart while still
// technically agreeing.
for (const [what, value] of [
  ['engines.node', node],
  ['engines.pnpm', pnpm],
]) {
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    problems.push(`${what} is "${value}"; it has to be an exact version`);
  }
}

// Everything below rests on this. Without it `engines` is advisory, the
// versions may disagree with what is actually installed, and a task that
// checked only that three files match would report success over a promise
// nothing keeps.
if (!engineStrict) {
  problems.push(
    'pnpm-workspace.yaml does not set `engineStrict: true`, so `engines` is a note rather than a requirement and nothing enforces these versions.'
  );
}

if (nvmrc !== node) {
  problems.push(
    `.nvmrc says "${nvmrc}" and engines.node says "${node}". nvm resolves a bare \`nvm use\` from .nvmrc, so the version it gives you would be refused by engine-strict.`
  );
}

if (packaged !== pnpm) {
  problems.push(
    `packageManager pins pnpm ${packaged} and engines.pnpm requires ${pnpm}. pnpm fetches the first and then holds itself to the second, so every install fails.`
  );
}

if (problems.length > 0) {
  console.error('The pinned runtime versions disagree:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`Node ${node} and pnpm ${pnpm}, pinned the same everywhere.`);
}
