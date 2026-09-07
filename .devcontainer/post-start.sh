#!/usr/bin/env bash
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------
#
# Runs on every attach. Agent forwarding is per-session, so anything depending
# on SSH_AUTH_SOCK belongs here rather than in post-create.sh.

set -uo pipefail

# VS Code forwards the agent but never copies key files in, so a signingkey
# path inherited from the host's gitconfig names a file that does not exist
# here and `git commit -S` fails on it. Recreating that path is not an option
# either -- /Users/<user> and /home/<user> sit under root-owned directories the
# `node` user cannot write. So point user.signingkey, in this container only,
# at a path under $HOME and write the forwarded public key there.
#
# A wrong guess cannot mis-sign: the signature goes through the agent by
# fingerprint, so a stale file yields "no matching identity" rather than
# someone else's signature.
if [ "$(git config --global gpg.format 2>/dev/null || true)" = "ssh" ]; then
  signingkey="$(git config --global user.signingkey 2>/dev/null || true)"
  if [ -n "${signingkey}" ]; then
    container_signingkey="${HOME}/.ssh/$(basename "${signingkey}")"

    # Every attach, not just when the file is absent: the forwarded identity
    # can change between sessions, so an existing file proves nothing.
    identities="$(ssh-add -L 2>/dev/null || true)"

    # Matched by key type. `^ssh-` misses ECDSA and security keys; counting
    # non-blank lines instead would read "The agent has no identities." as an
    # identity and write that sentence out as the key.
    count="$(printf '%s\n' "${identities}" |
      grep -cE '^(ssh-(rsa|dss|ed25519)|ecdsa-sha2-nistp[0-9]+|sk-(ssh-ed25519|ecdsa-sha2-nistp[0-9]+)@openssh\.com) ' ||
      true)"

    if [ "${count}" -eq 1 ]; then
      # Split because -m applies only to the deepest directory (SC2174), and
      # unconditional because ssh refuses a world-writable ~/.ssh.
      mkdir -p "$(dirname "${container_signingkey}")"
      chmod 700 "$(dirname "${container_signingkey}")"
      printf '%s\n' "${identities}" >"${container_signingkey}"
      chmod 644 "${container_signingkey}"

      if [ "${signingkey}" != "${container_signingkey}" ]; then
        git config --global user.signingkey "${container_signingkey}"
      fi

      # Without an allowed-signers file the verifier cannot run at all, and
      # `git log --show-signature` answers "No signature" for commits that are
      # in fact signed -- which reads as a signing problem and sends you back
      # to settings that were right all along.
      email="$(git config --global user.email 2>/dev/null || true)"
      if [ -n "${email}" ]; then
        allowed_signers="${HOME}/.ssh/allowed_signers"
        # Fields 1 and 2 only; the grammar has no slot for ssh-add's trailing
        # comment.
        printf '%s %s\n' "${email}" \
          "$(awk '{print $1, $2}' "${container_signingkey}")" \
          >"${allowed_signers}"
        git config --global gpg.ssh.allowedSignersFile "${allowed_signers}"
      else
        echo "==> Signature verification NOT configured: no user.email to attribute ${container_signingkey} to" >&2
      fi

      echo "==> Commit signing ready (${container_signingkey}, from forwarded SSH agent)"
    else
      echo "==> Commit signing NOT ready: forwarded SSH agent has ${count} identities, need exactly 1 to write ${container_signingkey}" >&2

      # Kept, not deleted: it cannot mis-sign, and one attach that raced the
      # agent socket should not discard a working setup.
      if [ -f "${container_signingkey}" ]; then
        echo "==>   ${container_signingkey} is from an earlier session and was NOT re-verified; signing works only if that same agent is forwarded again" >&2
      fi
    fi
  fi
fi
