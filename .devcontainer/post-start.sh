#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------
#
# Runs on every container start/attach, not just the first. Agent forwarding
# is per-session -- VS Code opens a fresh SSH_AUTH_SOCK each time it attaches
# -- so anything that depends on it belongs here rather than in
# post-create.sh, which never runs again after the container is built.

set -uo pipefail

# Under gpg.format=ssh, `git commit -S` shells out to
# `ssh-keygen -Y sign -f <user.signingkey> ...`, which reads that file for the
# public key and then asks the running agent (SSH_AUTH_SOCK) to sign with the
# matching private key. VS Code forwards the agent itself but, per
# https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials,
# never copies key files into the container -- so a signingkey path copied
# verbatim from the host's gitconfig points at a file that has never existed
# here, and signing fails with "Couldn't load public key ...: No such file or
# directory" no matter how many times post-create.sh's `commit.gpgsign true`
# hint is followed.
#
# If the forwarded agent is holding exactly one identity, write it out so that
# path resolves. This can't sign with the wrong key even if it guessed wrong:
# the actual signature still goes through the agent, keyed by fingerprint, so
# a mismatched file just makes ssh-keygen report no matching identity instead
# of silently mis-signing.
if [ "$(git config --global gpg.format 2>/dev/null || true)" = "ssh" ]; then
  signingkey="$(git config --global user.signingkey 2>/dev/null || true)"
  if [ -n "${signingkey}" ] && [ ! -f "${signingkey}" ]; then
    identities="$(ssh-add -L 2>/dev/null || true)"
    count="$(printf '%s\n' "${identities}" | grep -c '^ssh-' || true)"
    if [ "${count}" -eq 1 ]; then
      mkdir -p -m 700 "$(dirname "${signingkey}")"
      printf '%s\n' "${identities}" >"${signingkey}"
      chmod 644 "${signingkey}"
      echo "==> Commit signing ready (${signingkey}, from forwarded SSH agent)"
    else
      echo "==> Commit signing NOT ready: forwarded SSH agent has ${count} identities, need exactly 1 to write ${signingkey}" >&2
    fi
  fi
fi
