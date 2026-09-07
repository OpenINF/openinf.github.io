#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------
#
# Runs once, after the container is created.
#
# Both version managers are here deliberately. nvm.fish switches a fish session
# only; the image's nvm repoints the `current` symlink on PATH, which is what
# editor tasks, CI and agents follow. Neither can do the other's job.

set -euo pipefail

# Commits, not tags: this is remote code piped into a shell, and a tag can be
# moved. Written as the workflows pin actions -- immutable ref, version as a
# trailing comment nothing reads. Renovate moves both; see .renovaterc.json5.
# renovate: datasource=github-tags depName=jorgebucaran/fisher
readonly FISHER_COMMIT=a04308be92daa6cfecdbb0ca58b1e8508664cff2 # 4.4.8
# renovate: datasource=github-tags depName=jorgebucaran/nvm.fish
readonly NVM_FISH_COMMIT=abd3002b6d2d578d484a5aea94dd1517dded6d42 # 2.2.17

# Each file exists for its own tool -- .nvmrc for nvm.fish, engines.node for
# pnpm -- so all that is left to guard is that they agree. The rule lives in
# `verify.runtimes`, which the checks run too: stated twice it would be two
# rules, and the one nobody runs is the one that rots. It reads only what node
# ships with, so it works here, before anything is installed.
node build/tasks/verify/verify-runtimes.mts || exit 1

required="$(node -p 'require("./package.json").engines.node')"

echo "==> Node ${required} (image ships $(node -v))"

# nvm speaks through nvm_echo, which writes to stdout, so nothing below is
# silenced -- redirecting it away turns a diagnosable failure into a bare exit
# code. Sourcing may fail: nvm.sh activates .nvmrc as it loads, which resolves
# to N/A before anything is installed and returns 3.
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

# No corepack: node is unbundling it, and pnpm installs the `packageManager`
# version itself.
pnpm install

echo "==> fish tooling"

# The curl defines fisher in memory just long enough to install itself
# properly.
#
# stdin is closed because postCreateCommand leaves it open on a pipe that never
# delivers, and fisher fetches in background jobs and then `wait`s -- with no
# job control, a child that reads that pipe stops and the wait never returns.
# It hung container creation for ten minutes at 0% CPU; at /dev/null the same
# install takes 0.7s. The curl is bounded so a stalled connection cannot
# imitate that.
fish -c "
  curl -fsSL --connect-timeout 10 --max-time 120 https://raw.githubusercontent.com/jorgebucaran/fisher/${FISHER_COMMIT}/functions/fisher.fish | source
  and fisher install jorgebucaran/fisher@${FISHER_COMMIT} jorgebucaran/nvm.fish@${NVM_FISH_COMMIT}
" </dev/null

# nvm_default_version is what nvm.fish's conf.d reads for new sessions; `nvm
# use` alone would set a variable in this throwaway shell.
#
# Non-fatal: it only duplicates, for fish, a version the container already has.
# But it has to say so, or `nvm use` is broken there with nothing to explain
# why.
if ! fish -c "
  nvm install (cat .nvmrc)
  and set --universal nvm_default_version (cat .nvmrc)
" </dev/null >/dev/null 2>&1; then
  echo "==> WARNING: nvm.fish could not preinstall ${required}." >&2
  echo "==>   Node is $(node -v) everywhere outside fish; only a bare" >&2
  echo "==>   \`nvm use\` there is affected. Run \`nvm install\` to repair." >&2
fi

# Signing wants the keyring to exist. VS Code forwards the host's agent, so no
# key material is created here.
gpg --list-keys >/dev/null 2>&1 || true

cat <<EOF

Ready, on Node $(node -v).

  pnpm start   Eleventy dev server on http://localhost:3000
  pnpm build   production build into _site/
  pnpm test    the verify suite (nps verify.all)

In fish, \`nvm use\` reads .nvmrc, for that session only.
EOF
