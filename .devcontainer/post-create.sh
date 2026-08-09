#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------
#
# Runs once, after the container is created.
#
# Two Node version managers are set up here on purpose, because they do
# different jobs and neither can do the other's:
#
#   nvm.fish  - what you use. `nvm use` with no arguments reads .nvmrc, and it
#               switches the version for your fish session only, which is what
#               you want from an interactive version switch.
#   the image's nvm - sets the container-wide baseline. The image puts
#               /usr/local/share/nvm/current/bin on the container's PATH and
#               sets NVM_SYMLINK_CURRENT, so `nvm use` here repoints a symlink
#               that every non-fish process follows: editor tasks, CI, agents.
#
# nvm.fish cannot serve that second role -- it prepends to fish's own PATH and
# keeps its versions under $XDG_DATA_HOME/nvm, so nothing outside fish sees it.
# The image's nvm cannot serve the first -- it is not a fish program.

set -euo pipefail

# These are pinned because the fisher bootstrap below is remote code being
# sourced, and a pin nothing watches is how a version ends up four years
# stale. The annotations let renovate track them; see customManagers in
# .renovaterc.json5.
# renovate: datasource=github-releases depName=jorgebucaran/fisher
readonly FISHER_VERSION=4.4.8
# renovate: datasource=github-releases depName=jorgebucaran/nvm.fish
readonly NVM_FISH_VERSION=2.2.17

# .nvmrc is what nvm.fish reads; engines.node is what pnpm enforces. Both files
# have to exist for their own tool, so the only thing to guard is that they say
# the same thing -- an exact version, since a floating alias like lts/krypton
# resolves to whatever the newest release in that line happens to be and will
# eventually stop matching the exact pin in package.json.
required="$(node -p 'require("./package.json").engines.node')"
declared="$(tr -d '[:space:]' < .nvmrc)"

if [ "${declared}" != "${required}" ]; then
  cat >&2 <<EOF
.nvmrc says "${declared}" but package.json requires exactly "${required}".

nvm.fish resolves \`nvm use\` from .nvmrc, so they have to agree or the version
you get in fish will be rejected by engine-strict.
EOF
  exit 1
fi

# ------------------------------------------------------------------------------
# Container-wide baseline, for everything that is not a fish session.
# ------------------------------------------------------------------------------

# Nothing below is silenced. nvm reports several failures through nvm_echo,
# which writes to stdout, so redirecting it away turns a diagnosable problem
# into a bare non-zero exit -- `nvm use` on a version that is not installed
# returns 3 and says why, but only if you let it speak.

echo "==> Node ${required} (image ships $(node -v))"

# Sourcing nvm.sh is allowed to fail. It auto-detects .nvmrc in the working
# directory and tries to activate that version as it loads; in a container
# where nothing is installed yet, that resolves to N/A and returns 3. Under
# `set -e` that killed this script before it reached the install below, with no
# message, because the explanation goes through nvm_echo to stdout.
# shellcheck source=/dev/null
. "${NVM_DIR}/nvm.sh" || true

if ! nvm install "${required}"; then
  echo "Failed to install Node ${required} via ${NVM_DIR}." >&2
  exit 1
fi

nvm alias default "${required}"
nvm use "${required}"

if [ "$(node -v)" != "v${required}" ]; then
  echo "Expected v${required} after nvm use, got $(node -v)." >&2
  exit 1
fi

echo "==> Dependencies"

# Corepack prompts before fetching the pinned pnpm, which fails where there is
# no terminal to answer it.
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable
pnpm install

# ------------------------------------------------------------------------------
# fish tooling
# ------------------------------------------------------------------------------

echo "==> fish tooling"

# The old base image shipped fisher; a stock image does not. The curl is
# fisher's own bootstrap: it defines the function in memory, which is then used
# to install fisher properly so it survives into later sessions. Both are
# pinned rather than tracking a branch, since this is remote code being sourced.
#
# nvm.fish comes from upstream. The OpenINF fork it used to come from is
# byte-identical to it -- zero commits ahead or behind -- so the fork bought
# nothing and cost a second source to keep watching.
#
# One `fisher install` for both, rather than one each, so this is a single pass.
fish -c "
  curl -fsSL https://raw.githubusercontent.com/jorgebucaran/fisher/${FISHER_VERSION}/functions/fisher.fish | source
  and fisher install jorgebucaran/fisher@${FISHER_VERSION} jorgebucaran/nvm.fish@${NVM_FISH_VERSION}
"

# Install the pinned version into nvm.fish's own store so a bare `nvm use`
# works immediately, and set nvm_default_version, which is what nvm.fish's
# conf.d reads to activate a version in new interactive sessions. `nvm use`
# alone would not do it: it sets a session variable, so it would apply to this
# one throwaway shell and nothing else.
fish -c "
  nvm install (cat .nvmrc)
  and set --universal nvm_default_version (cat .nvmrc)
" >/dev/null 2>&1 || true

# gpg needs its keyring to exist before commit signing works. VS Code forwards
# the host's gpg-agent, so no key material is created or copied here.
gpg --list-keys >/dev/null 2>&1 || true

cat <<EOF

Ready, on Node $(node -v).

  pnpm start   browser-sync dev server on http://localhost:3000
  pnpm build   production build into _site/
  pnpm test    the full verify suite

In fish, \`nvm use\` reads .nvmrc. Switching there affects that session only;
the container baseline stays on the version package.json pins.
EOF
