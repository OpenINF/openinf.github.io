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

readonly FISHER_VERSION=4.4.8

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

# shellcheck source=/dev/null
. "${NVM_DIR}/nvm.sh"
nvm install "${required}" >/dev/null
nvm alias default "${required}" >/dev/null
nvm use "${required}" >/dev/null

corepack enable
pnpm install

# ------------------------------------------------------------------------------
# fish tooling
# ------------------------------------------------------------------------------

# The old base image shipped fisher; a stock image does not. Pinned rather than
# tracking main, since this is a remote script being sourced.
fish -c "
  curl -fsSL https://raw.githubusercontent.com/jorgebucaran/fisher/${FISHER_VERSION}/functions/fisher.fish | source
  and fisher install jorgebucaran/fisher@${FISHER_VERSION}
  and fisher install OpenINF/openinf-nvm.fish
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

To sign commits: git config --global commit.gpgsign true
EOF
