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
  container. The forwarded agent doesn't help until that file exists -- and the
  container's non-root user usually can't even create it: a Mac's `/Users/<you>`
  or a Linux host's `/home/<you>` both live under a root-owned directory this
  container's `node` user has no write access to, so recreating the host's path
  byte-for-byte fails with a permissions error regardless of host OS.

`.devcontainer/post-start.sh` closes that second gap. It runs on every container
**start/attach**, unlike `post-create.sh`, which only ever runs once, when the
container is first built -- too early, since the forwarded agent socket is a
fresh, per-session thing set up on each attach. If `gpg.format` is `ssh` and the
forwarded agent is holding exactly one identity, `post-start.sh` writes that
public key to a path under `$HOME/.ssh` in the container (not the host path
copied into `user.signingkey`) and repoints the container's own
`user.signingkey` at it. It deliberately does nothing if the agent has zero
identities (nothing to write) or more than one (no reliable way to know which
one you mean) -- watch its output on attach to see which case you're in.

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
are a poor fit: `user.signingkey` has to name a real path on the host, and
`post-start.sh` needs a public key it can write out in the container. The two
paths don't need to match -- `post-start.sh` retargets the container's own copy
of `user.signingkey` to wherever it actually writes the file, under
`$HOME/.ssh`.

To confirm signing is actually working locally rather than assuming it, commit
and then check that the object really carries a signature:

```console
git cat-file commit HEAD | head -20
```

A locally signed commit has a `gpgsig` header (`BEGIN SSH SIGNATURE` for this
format). No header means the commit is unsigned no matter what the settings say.

Prefer that check over `git log --show-signature` when the question is whether
_signing_ works: `cat-file` reads the commit, while `--show-signature` also has
to verify it, which is a separate mechanism that can fail on its own. See
[below](#when-show-signature-says-no-signature) for what that looks like.

## Verifying signatures locally

Verification is a distinct mechanism from signing, with its own configuration
and its own failure modes -- a commit can be perfectly signed and still fail to
verify here. For SSH-format signatures, Git needs an [allowed signers][] file
mapping each principal (an email address) to the keys it may sign with. Unlike
GPG, where the keyring is discovered automatically, Git has no default location
for this file, so verification cannot run at all until
`gpg.ssh.allowedSignersFile` names one.

`post-start.sh` writes `$HOME/.ssh/allowed_signers` alongside the signing key it
already sets up, listing your `user.email` against that key, and points the
config at it. That is enough for `git log --show-signature` to report
`Good "git" signature`.

Two things it deliberately does not attempt:

- **Anyone else's commits.** The file lists your key and no one else's, so other
  contributors' signed commits report `No principal matched`. Verifying those
  means maintaining a shared allowed-signers file, which is a project-wide
  decision rather than something a container script should invent.
- **Trust beyond your own attestation.** You are asserting that this key belongs
  to this address. That makes local verification meaningful for catching a
  misconfigured or swapped key; it is not third-party attestation the way
  GitHub's "Verified" badge is. GitHub does its own check against the keys
  registered on your account -- see its docs on [commit signature
  verification][], and note that a key has to be added as a **signing** key
  there, separately from the same key added for authentication.

### When show-signature says "No signature"

If the allowed-signers file is missing or unconfigured,
`git log --show-signature` prints (wrapped here for width):

```console
error: gpg.ssh.allowedSignersFile needs to be configured and exist
       for ssh signature verification
No signature
```

`No signature` here is the verifier reporting that it could not run -- not a
statement about the commit, which may well be signed. The wording invites the
opposite reading, and acting on it means re-checking `commit.gpgsign`,
`user.signingkey` and the agent, all of which were fine. Confirm with
`git cat-file commit HEAD` before changing any signing setting: a
`BEGIN SSH SIGNATURE` header means signing works and only verification needs
attention. Note that the `error:` line is easy to miss when it scrolls past
above the commit, or when a pager or tool shows only the commit body.

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
  container, write the file yourself from the one you mean, then point
  `user.signingkey` at it:

  ```console
  ssh-add -L | grep <comment-or-fingerprint> > ~/.ssh/id_ed25519.pub
  git config --global user.signingkey ~/.ssh/id_ed25519.pub
  ```

- **It worked before, stopped working after a container rebuild** -- the file
  `post-start.sh` writes, and the `user.signingkey` override pointing at it,
  both live in the container's filesystem, not a volume, so a rebuild removes
  them along with the host's copied-in gitconfig. Both get rewritten on the next
  attach as long as the agent still has exactly one identity at that point.
- **`git log --show-signature` says `No signature`** -- establish that the
  commit is actually unsigned before treating it as a signing problem, since
  that message is also what a verifier that could not run prints.
  `git cat-file commit HEAD` settles it; see
  [above](#when-show-signature-says-no-signature).
- **Everything looks configured, but commits still come out unsigned** -- check
  for a per-repository override before re-checking anything global:

  ```console
  git config --local --get commit.gpgsign
  ```

  `false` here beats `commit.gpgsign = true` in your global config, silently and
  for every tool touching the clone. It is worth ruling out early: `.git/config`
  isn't version controlled, so nothing in a PR can fix it and nothing in a diff
  reveals it, and because the working tree is bind-mounted from the host, a
  `--local` setting applied inside the container is applied to the host clone
  too. Clear it with `git config --local --unset commit.gpgsign`.

<!-- prettier-ignore-start -->
<!-- LINK LABEL DEFINITIONS - START -->

[#1775]: https://github.com/OpenINF/openinf.github.io/pull/1775
[allowed signers]: https://man.openbsd.org/ssh-keygen#ALLOWED_SIGNERS
[sharing Git credentials]: https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials
[commit signature verification]: https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification

<!-- LINK LABEL DEFINITIONS - END -->
<!-- prettier-ignore-end -->
