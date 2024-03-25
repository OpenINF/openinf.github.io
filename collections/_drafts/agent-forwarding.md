---
title: OpenINF Next-Gen Guidance on Agent Forwarding
category: contributing
permalink: /docs/dev/internals/contributing/agent-forwarding/
relevant_urls:
  - https://github.com/OpenINF/docker-fisher/issues/5 # psusan + auth awkwardness
  - https://dev.gnupg.org/T3883 # Win32-OpenSSH support for gpg-agent's ssh-agent
---

Additional setup procedures may be necessary for the chosen few who hold core
OpenINF membership to sign any potential Git commits or tags. This guide will be
especially relevant for those developing inside the container provided as there
will likely be snafus to overcome before connecting to the devcontainer.

## Connecting to GitHub with SSH

You can connect to GitHub using the Secure Shell Protocol (SSH), which provides
a secure channel over an unsecured network.

Using the SSH protocol, you can connect and authenticate to remote servers and
services. With SSH keys, you can connect to GitHub without supplying your
username and personal access token at each visit.

When one sets up SSH, it's necessary to first generate a new SSH key and then
add it to the **[`ssh-agent`][]**. One must add the SSH key to their account on
GitHub before any usage of the key to authenticate may occur.

### 1.1.1     Generating a new SSH key and adding it to the ssh-agent

If you don't already have an SSH key, you must generate a new one for
authentication. You can check for existing keys if you are unsure whether you
already have an SSH key. For more information, see "[Checking for existing SSH
keys][]".

If you don't want to reenter your passphrase every time you use your SSH key,
you can add your key to the SSH agent, which will manage your SSH keys and
remember your passphrases.

#### 1.1.1.1    Working with SSH key passphrases

You can secure your SSH keys and configure an authentication agent so that you
won't have to reenter your passphrase every time you use your SSH keys.

With SSH keys, if someone gains access to your computer, they also gain access
to every system that uses that key. To add an extra layer of security, you can
add a passphrase to your SSH key. You can use `ssh``-agent` to save your
passphrase securely, so you don't have to reenter it.

## 1.2    Adding or changing a passphrase

### 1.2.1     Adding a new SSH key to your GitHub account

You can further secure your SSH key by using a hardware security key, which
requires the physical hardware security key to be attached to your computer when
the key pair is used to authenticate with SSH. You can also secure your SSH key
by adding your key to the ssh-agent and using a passphrase. For more
information, see "[Working with SSH key passphrases][]".

## 1.3    Auto-start of the gpg-agent

The _gpg-agent_ is the central part of the GnuPG system. It takes care of all
private (secret) keys and, if required, diverts operations to a smartcard or
other token. It also supports Secure Shell (SSH) by implementing the ssh-agent
protocol.

The traditional way to run _gpg-agent_ on \*nix systems is by launching it at
login time and using an environment variable (GPG_AGENT_INFO) to tell the other
GnuPG modules how to connect to the agent. However, correctly managing the
startup and this environment variable is cumbersome, so a more straightforward
method is required. Since GnuPG 2.0.16, the --use-standard-socket option already
allowed starting the agent on the fly; however, the environment variable was
still needed.

With GnuPG 2.1, the need for GPG_AGENT_INFO has been completely removed, and the
variable is ignored.

Instead, a fixed _Unix domain socket_ named S.gpg-agent in the GnuPG home
directory (by default ~/.gnupg) is used. The agent is also started on-demand by
all tools requiring services from the agent.

If the option `--enable-ssh-support` is used, the auto-start mechanism does not
work because _ssh_ does not know about this mechanism. Instead, the environment
variable `SSH_AUTH_SOCK` must be set to the `S.gpg-agent.ssh` socket in the
GnuPG home directory. Further, `gpg-agent` must be started by either using a
GnuPG command that implicitly starts `gpg-agent` or by using
`gpgconf --launch gpg-agent` to explicitly start it without first having to use
a GnuPG command.

`gpg-agent` is a daemon to manage secret (private) keys independently from any
protocol. It is a backend for gpg, gpgsm, and other utilities.

GPG Agent Configuration

There are a few configuration files needed for the operation of the agent. They
may all be found in the current GnuPG home directory, which defaults
to ~/.gnupg.

:::windows

However, there may be problems on Windows systems with Gpg4Win installed;
**Gpg4Win may have changed this default GnuPG home directory location** to an
AppData subdirectory (i.e., `C:\Users\<username>\AppData\Roaming\gnupg`). This
location, however, is not the location our GPG agent will be using, so to
reaffirm our preference for the default location, we will set
the GNUPGHOME environment variable to ~/.gnupg in the Git Bash startup script by
running the following.

echo 'export GNUPGHOME="~/.gnupg"' >> .bashrc

:::

Setting environment variables

Add the following lines to your .bashrc or whatever initialization file is used
for all shell invocations:

GPG_TTY=$(tty)

export GPG_TTY

This variable may only be helpful if you use `pinentry-curses` (the
terminal-based pin entry program).

:::windows

On Windows systems, you should add the above lines to the ~/.bashrc file for use
by Git Bash.

:::

GnuPG configuration

It's important to note that GnuPG on the remote system still needs your public
GPG keys to work correctly. So you have to ensure they are available on the
remote system even if your secret keys are not.

:::note{.note}

If you use VSCode with the remote extension pack, you may skip this step and
move on to the next section. This step of copying over your local public GPG
keyring into the remote container gets done automatically by the extension.

:::

:::excerpt{.quote} <!-- TODO(DerekNonGeneric): link to source of below -->

<abbr title="Secure Copy Protocol">[SCP]{#scp .dfn}</abbr> is a means of
securely transferring [computer files][] between a local [host][] and a remote
host or between two remote hosts. It is based on the [Secure Shell][] (SSH)
protocol.[^1] "SCP" commonly refers to both the Secure Copy Protocol and the
program itself.[^2]

<!-- TODO(DerekNonGeneric): include how SCP's not:
- preferable over using SFTP for remote file transfer
- a bad choice for quick local transfers btwx host and guest vm/container(s)
-->

:::

During _**[`ssh-agent`][]** initialization_, the extra socket (named
**`S.gpg-agent.extra`** by default) gets created in the GnuPG home directory.

The intended use for this extra socket is to set up a _Unix domain socket_
forwarding from a remote machine to this socket on the local device.
A gpg process running on the remote box (or, in our case, in the devcontainer)
may connect to the local gpg-agent and use its private keys. This activity
enables decrypting or signing data on a remote machine without exposing the
private keys to the remote box. Although this technique is usually taken as a
precaution when the connection between two systems goes over a hostile network,
it is convenient to avoid transferring private keys to the devcontainer.

### 1.3.1.1    Manually specify GPG agent configuration

To guarantee that the connection (going over a kernel IPC channel) between the
two systems goes to the right place, it is advisable to explicitly specify the
local filename (in full) of the extra socket in the GPG agent config file. Do so
by adding the following line to the `gpg-agent.conf` file in the GnuPG home
directory.

```text
extra-socket /c/Users/Administrator/.gnupg/S.gpg-agent.extra
```

This extra socket is the one our local `gpg-agent` will be using rather than
S.gpg-agent because its limitations theoretically make it more secure.

Enable GPG agent support of SSH

Add the following line to your GPG-agent config file.

```text
enable-ssh-support
```

The OpenSSH Agent protocol is always enabled, but `gpg-agent` will only set
the `SSH_AUTH_SOCK` environment variable with this option specified.

In this mode of operation, the agent implements both the `gpg-agent` protocol
and the agent protocol used by OpenSSH (through a separate socket).
Consequently, using the `gpg-agent` as a drop-in replacement for the
well-known `ssh-agent` should be possible.

SSH keys, intended for use through the agent, need to be added to the
gpg-agent initially through the ssh-add utility. Upon adding a key, ssh-add will
ask for the password of the provided key file and send the unprotected key
material to the agent. This routine will cause the gpg-agent to ask for a
passphrase, which it will use to encrypt the newly-received key and store it in
a gpg-agent-specific directory for later use. Once an SSH key has been added to
the gpg-agent in this manner, the gpg-agent will be ready to use the newly-added
key.

:::note{.note}

If the `gpg-agent` receives a signature request, the user may need prompting for
a passphrase, which is necessary to decrypt any SSH keys stored. Since
the ssh-agent protocol does not contain a mechanism for telling the agent on
which display/terminal it's running, gpg-agent's ssh-support will use the TTY or
X display where gpg-agent started. To switch this display to the current one,
you may use the following command.

```console
gpg-connect-agent updatestartuptty /bye
```

:::

Although all GnuPG components try to start the **[`gpg-agent`][]** as needed,
this is not possible for _the **[`ssh`][]** support_ because **[`ssh`][]** does
not know about it. Thus, if no GnuPG tool, that usually accesses the
**[`gpg-agent`][]** (causing the initial start of it) ever ran, there is no
guarantee that **[`ssh`][]** can use **[`gpg-agent`][]** for authentication. To
fix this, one may start **[`gpg-agent`][]** , if needed, by using this simple
command:

```console
gpg-connect-agent /bye
```

:::note{.tip}

Adding the `--verbose` flag shows the progress of starting the agent.

:::

### Correctly managing the startup of the GPG agent

The traditional way to run _gpg-agent_ on \*nix systems is by launching it at
login time.

To be sure, we will add the following line to&hellip;

:::windows

The `--enable-putty-support` flag is only available under Windows and allows the
use of gpg-agent with the PuTTY implementation of SSH. This usage is similar to
the regular ssh-agent, which supports OpenSSH implementations of SSH on \*nix
systems, but differs in its use of Windows Message Queues as PuTTY requires.

:::

to load configuration details

#### 1.3.1.2    specify SSH configuration

SSH configuration

Add the following to the file located at ~/.ssh/config. If it does not yet
exist, create it.

host gpgtunnel

hostname localhost

port 2222

User vscode

RemoteForward /home/vscode/.gnupg/S.gpg-agent
/c/Users/Administrator/.gnupg/S.gpg-agent.extra

VSCode remote extension user configuration (optional)

You must specify the remote’s VS Code user settings option if you are using VS
Code and the development environment.SSH.path to point to the SSH client
included in the Cygwin/MSYS installation of Git Bash.

<!-- LINK LABEL DEFINITIONS - START -->

[`ssh`]: https://en.wikipedia.org/wiki/Secure_Shell
[`ssh-agent`]: https://en.wikipedia.org/wiki/Ssh-agent
[`gpg-agent`]:
  https://www.gnupg.org/documentation/manuals/gnupg/Invoking-GPG_002dAGENT.html
[Checking for existing SSH keys]:
  https://docs.github.com/en/github/authenticating-to-github/checking-for-existing-ssh-keys
[computer files]: https://en.wikipedia.org/wiki/Computer_file
[host]: https://en.wikipedia.org/wiki/Server_(computing)
[Secure Shell]: https://en.wikipedia.org/wiki/Secure_Shell
[Working with SSH key passphrases]:
  https://docs.github.com/en/github/authenticating-to-github/working-with-ssh-key-passphrases

[^1]: https://en.wikipedia.org/wiki/Secure_copy_protocol#cite_note-1
[^2]: https://en.wikipedia.org/wiki/Secure_copy_protocol#cite_note-Pechanec-2

<!-- LINK LABEL DEFINITIONS - END -->
