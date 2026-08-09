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
# That copied path is also, almost always, a path this container's non-root
# user cannot create: a Mac's /Users/<user> or a Linux host's /home/<user>
# both live under a root-owned directory the container's `node` user has no
# write access to, so a bare `mkdir -p` on the host's literal path fails with
# EACCES regardless of host OS. So this retargets `user.signingkey`, in the
# container's own copy of the gitconfig only, at a path under $HOME that
# `node` actually owns, and writes the forwarded public key there instead of
# trying to recreate the host's path byte-for-byte.
#
# If the forwarded agent is holding exactly one identity, write it out so that
# path resolves. This can't sign with the wrong key even if it guessed wrong:
# the actual signature still goes through the agent, keyed by fingerprint, so
# a mismatched file just makes ssh-keygen report no matching identity instead
# of silently mis-signing.
if [ "$(git config --global gpg.format 2>/dev/null || true)" = "ssh" ]; then
  signingkey="$(git config --global user.signingkey 2>/dev/null || true)"
  if [ -n "${signingkey}" ]; then
    container_signingkey="${HOME}/.ssh/$(basename "${signingkey}")"
    if [ ! -f "${container_signingkey}" ]; then
      identities="$(ssh-add -L 2>/dev/null || true)"
      count="$(printf '%s\n' "${identities}" | grep -c '^ssh-' || true)"
      if [ "${count}" -eq 1 ]; then
        mkdir -p -m 700 "$(dirname "${container_signingkey}")"
        printf '%s\n' "${identities}" >"${container_signingkey}"
        chmod 644 "${container_signingkey}"
      else
        echo "==> Commit signing NOT ready: forwarded SSH agent has ${count} identities, need exactly 1 to write ${container_signingkey}" >&2
      fi
    fi
    if [ -f "${container_signingkey}" ]; then
      if [ "${signingkey}" != "${container_signingkey}" ]; then
        git config --global user.signingkey "${container_signingkey}"
      fi
      echo "==> Commit signing ready (${container_signingkey}, from forwarded SSH agent)"
    fi
  fi
fi
