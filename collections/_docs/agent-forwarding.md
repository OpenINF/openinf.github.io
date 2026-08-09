---
title: OpenINF Next-Gen Guidance on Agent Forwarding
category: contributing
permalink: /docs/dev/internals/contributing/agent-forwarding/
relevant_urls:
  - https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials
  - https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification
toc: true
draft: true
---

Core OpenINF members who sign their commits or tags need a couple of things
forwarded from the host into the devcontainer: a running SSH or GPG agent, and,
for SSH-format signing, a public key file. This guide covers how that forwarding
works today and what to do when it doesn't.

The devcontainer changed substantially in [#1775][]: it no longer runs its own
`sshd` on a forwarded port, and there is no more `vscode` user or manual
`RemoteForward` tunnel to configure. Everything below reflects that container.
If you find instructions elsewhere -- including an old revision of this file --
mentioning port 2222 or a `gpgtunnel` SSH host, they predate that change and no
longer apply.

## How forwarding works here

VS Code (and compatible tools like the Dev Containers CLI) forwards your
_running_ SSH agent into the container automatically; no devcontainer.json
configuration is required for it. What it does **not** do is copy any key
material in -- not the private key, and, for SSH-format signing, not even the
public key file. See VS Code's own docs on [sharing Git credentials][] for the
authoritative description.

That gap matters because of how the two signing formats differ:

- **`gpg.format=openpgp`** (classic GPG): the forwarded agent alone is enough.
  `gpg` talks to the agent socket and never needs a local copy of anything.
  `post-create.sh` runs `gpg --list-keys` once so the container's keyring files
  exist; beyond that, there is nothing this repo needs to do.
- **`gpg.format=ssh`**: Git shells out to
  `ssh-keygen -Y sign -f <user.signingkey> ...`. That `-f` argument is a **file
  path**, and `user.signingkey` in a gitconfig copied from your host points at a
  host path (typically `~/.ssh/id_ed25519.pub`) that has never existed in the
  container. The forwarded agent doesn't help until that file exists.

`.devcontainer/post-start.sh` closes that second gap. It runs on every container
**start/attach**, unlike `post-create.sh`, which only ever runs once, when the
container is first built -- too early, since the forwarded agent socket is a
fresh, per-session thing set up on each attach. If `gpg.format` is `ssh` and the
forwarded agent is holding exactly one identity, `post-start.sh` writes that
public key out to `user.signingkey`'s path. It deliberately does nothing if the
agent has zero identities (nothing to write) or more than one (no reliable way
to know which one you mean) -- watch its output on attach to see which case
you're in.

Either way, the actual cryptographic signing still happens on the host, via the
forwarded agent. No private key material is ever copied into the container.

## Setting up SSH-format signing (recommended)

Recommended because it's the less fiddly of the two to get working across host
and container, not because any tool requires it.

Note that GitHub Desktop has no commit-signing setting of its own and no key of
its own. It shells out to Git and inherits whatever `git config` says, so the
steps below are the entire setup whether you commit from Desktop or from a
terminal. A "Verified" badge on GitHub is _not_ evidence that local signing is
configured: commits made or squash-merged through github.com are signed
server-side with GitHub's own web-flow key, which looks identical on the site
and involves nothing on your machine.

1. Make sure the key you want to sign with is loaded into your platform's SSH
   agent:

   ```console
   ssh-add -l
   ```

   If it isn't listed, add it. On macOS, add `--apple-use-keychain` so it
   survives a reboot instead of needing `ssh-add` again every session:

   ```console
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

2. Point Git at it. Run this **on the host**, in a host terminal -- the
   container gets its own copy of `~/.gitconfig` at build time, so running it
   inside the container configures only the container and silently leaves the
   Mac unchanged:

   ```console
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/id_ed25519.pub
   git config --global commit.gpgsign true
   ```

3. Reopen or rebuild the devcontainer and watch `post-start.sh`'s output on
   attach. `Commit signing ready` means the public key was found in the
   forwarded agent and written into the container. Anything else means the agent
   forwarded into _this_ session doesn't have exactly one identity -- check
   `ssh-add -l` on the host first.

Use an ordinary `ssh-keygen`-generated key pair here. Keys that exist only
inside a Secure Enclave or an external agent, with no public key file on disk,
are a poor fit: `user.signingkey` has to name a real path, on the host and in
the container both.

To confirm signing is actually working locally rather than assuming it, commit
and then check that the object really carries a signature:

```console
git cat-file commit HEAD | head -20
```

A locally signed commit has a `gpgsig` header (`BEGIN SSH SIGNATURE` for this
format). No header means the commit is unsigned no matter what the settings say.

Signature _verification_ (`git log --show-signature`, the "Verified" badge on
GitHub) is a separate concern from signing and isn't covered above -- see
GitHub's docs on [commit signature verification][] if you need that working
locally too.

## Setting up GPG-format signing

If you use an actual OpenPGP key instead:

1. Make sure `gpg-agent` on the host has your key and is reachable the normal
   way (`gpg --list-secret-keys` should show it).
2. Leave `gpg.format` unset (or set it to `openpgp`), and set:

   ```console
   git config --global user.signingkey <your-key-id>
   git config --global commit.gpgsign true
   ```

3. Nothing in this repo's devcontainer needs configuring beyond what's already
   there: `gnupg` ships in the base image, and the forwarded agent socket is all
   `gpg` needs.

## Troubleshooting

- **`ssh-add -l` says "The agent has no identities"** -- this is a host-side
  fact, not a container problem. Add the key on the host and reattach.
- **`post-start.sh` reports more than one identity** -- it won't guess. Either
  unload the extra identities from the agent for this session, or, inside the
  container, write the file yourself from the one you mean (path from
  `git config --global user.signingkey`):

  ```console
  ssh-add -L | grep <comment-or-fingerprint> > <path-to-signingkey>
  ```

- **It worked before, stopped working after a container rebuild** -- the file
  `post-start.sh` writes lives in the container's filesystem, not a volume, so a
  rebuild removes it. It gets rewritten on the next attach as long as the agent
  still has exactly one identity at that point.

<!-- prettier-ignore-start -->
<!-- LINK LABEL DEFINITIONS - START -->

[#1775]: https://github.com/OpenINF/openinf.github.io/pull/1775
[sharing Git credentials]: https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials
[commit signature verification]: https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification

<!-- LINK LABEL DEFINITIONS - END -->
<!-- prettier-ignore-end -->
