---
title: Developing
---

## macOS Setup

Coming soonish.

## Windows Setup

This guide is under the assumption that the user is running on the latest
version of
[Windows Server 2022 Standard](https://cloudblogs.microsoft.com/windowsserver/2021/09/01/windows-server-2022-now-generally-available-delivers-innovation-in-security-hybrid-and-containers/).

### Development environment dependencies

Make sure you have your tools installed!

To get started with Dev Environments, you’ll need Git, Visual Studio Code, and
the Visual Studio Code Remote Containers extension:

-[x] Git - Installed

-[ ] Visual Studio Code &mdash;
[\[ Install \]](https://code.visualstudio.com/sha/download?build=stable&os=win32-x64)

Note: Since out host OS is Windows Server 2022, which uses the "Administrator"
account by default, we will need to use the "Windows _System_ Installer" (most
likely [the 64-bit installer](https://code.visualstudio.com/#alt-downloads)),
which installs VS Code for _all_ users as opposed to the "Windows _User_
Installer, which is geared towards a single personalized Windows user profile
(excluding "Administrator"); while the Windows ZIP archive, which is geared
towards portable installations of VS Code, lacks support for auto update and
isn't recognized by Docker Dev Environments.

-[ ] Visual Studio Code Remote Containers Extension &mdash;
[\[ Install \]](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

Note: Although the
[local system requirements](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers#system-requirements)
for this extension require Docker Desktop 2.2+ and the _WSL 2 back-end_, we will
not be enabling WSL 2 due to outstanding bugs preventing its usage on systems
that we currently offer Tier 1 support for (namely, Windows Server 2022).
Fortunately, it's not strictly required as usage of WSL 1 seems to be suitable
for our purposes in this case.

#### Docker Setup

1. [Download and install the latest version of Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Once installed, click on the little gear in the upper-right corner of the app
   to go to the settings menu (General Tab) and be sure that the "Use the WSL 2
   based engine" option box isn't ticked. If it's already ticked off, be sure to
   un-tick it before proceeding.
1. Next, go to the "Resources" tab (file sharing sub-tab) and add the entire
   Local Disk (`C:\`) volume to the list of (sub)directories able to be
   bind-mounted into Docker containers and click the "Apply & Restart" button.

### Git user setup

1. [Download and install the latest version of Git](https://git-scm.com/downloads)
1. [Set username in Git](https://docs.github.com/en/free-pro-team@latest/github/using-git/setting-your-username-in-git)
1. [Set commit email in Git](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address)

### [Connect to GitHub with SSH](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)

1. [Generate a new SSH key](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
1. [Auto-launch `ssh-agent` on Git for Windows](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/working-with-ssh-key-passphrases#auto-launching-ssh-agent-on-git-for-windows)
1. [Add your SSH key to the SSH agent](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)

   Start a local Administrator PowerShell and run the following commands.

   ```powershell
   # Make sure you're running as an Administrator
   Set-Service ssh-agent -StartupType Automatic
   Start-Service ssh-agent
   Get-Service ssh-agent
   ```

   Add local SSH keys to the agent by using the ssh-add command.

   ```powershell
   ssh-add $HOME/.ssh/id_ed25519
   ```

   Source:
   <https://code.visualstudio.com/docs/remote/containers#_using-ssh-keys>

1. [Add your SSH key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

### Sign commits

1. [Download Gpg4win](https://gpg4win.org/download.html)
1. [Generate a GPG key](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-gpg-key#generating-a-gpg-key)
1. [Add GPG key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account)

### Git Setup

1. Create your own fork of the
   [OpenINF website repository](https://github.com/openinf/openinf.github.io) by
   clicking "Fork" in the Web UI. During local development, this will be
   referred to by `git` as `origin`.
1. Download your fork to a local repository.

   ```bash
   git clone git@github.com:<your username>/openinf.github.io.git
   ```

1. Add an alias called `upstream` to refer to the main
   `openinf/openinf.github.io` repository. Go to the root directory of the newly
   created local repository directory and run the following.

   ```bash
   git remote add upstream git@github.com:openinf/openinf.github.io.git
   ```

1. Fetch data from the `upstream` remote:

   ```bash
   git fetch upstream live
   ```

1. Set up your local `live` branch to track `upstream/live` instead of
   `origin/live` (which will become outdated).

   ```bash
   git branch -u upstream/live live
   ```

## Visual Studio Code Development Container

If you've got [Visual Studio Code](https://code.visualstudio.com/) with the
[Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
installed, then simply opening this repository in Visual Studio Code and
following the prompts to "Re-open In A Development Container" will get you set
up and ready to go in a fresh environment with all the requirements installed.

### Visual Studio Code Remote - Containers

The **Remote - Containers** extension lets you use a
[Docker container](https://docker.com) as a full-featured development
environment. Whether you deploy to containers or not, containers make a great
development environment because you can:

- Develop with a consistent, easily reproducible toolchain on the same operating
  system you deploy to.
- Quickly swap between different, separate development environments and safely
  make updates without worrying about impacting your local machine.
- Make it easy for new team members / contributors to get up and running in a
  consistent development environment.
- Try out new technologies or clone a copy of a code base without impacting your
  local setup.

The extension starts (or attaches to) a development container running a well
defined tool and runtime stack. Workspace files can be mounted into the
container from the local file system, or copied or cloned into it once the
container is running. Extensions are installed and run inside the container
where they have full access to the tools, platform, and file system.

You then work with VS Code as if everything were running locally on your
machine, except now they are separated inside a container.

![Remote Dev Container](https://microsoft.github.io/vscode-remote-release/images/remote-containers-readme.gif)

Other `glibc` based Linux containers may work if they have
[needed prerequisites](https://aka.ms/vscode-remote/linux).

Note that while the Docker CLI is required, the Docker daemon/service does not
need to be running locally if you are
[using a remote Docker host](https://aka.ms/vscode-remote/containers/remote-host).

## Installation

To get started, follow these steps:

1.  Install [VS Code](https://code.visualstudio.com/) or
    [VS Code Insiders](https://code.visualstudio.com/insiders/) and this
    extension.
2.  Install and configure [Docker](https://www.docker.com/get-started) for your
    operating system.

    **Windows / macOS:**

    1.  Install
        [Docker Desktop for Mac/Windows](https://www.docker.com/products/docker-desktop).
    2.  If not using WSL2 on Windows, right-click on the Docker task bar item,
        select **Settings / Preferences** and update **Resources > File
        Sharing** with any locations your source code is kept. See
        [tips and tricks](https://aka.ms/vscode-remote/containers/troubleshooting)
        for troubleshooting.
    3.  To enable the
        [Windows WSL2 back-end](https://aka.ms/vscode-remote/containers/docker-wsl2):
        Right-click on the Docker taskbar item and select **Settings**. Check
        **Use the WSL2 based engine** and verify your distribution is enabled
        under **Resources > WSL Integration**.

    **Linux:**

    1.  Follow the
        [official install instructions for Docker CE/EE](https://docs.docker.com/install/#supported-platforms).
        If you use Docker Compose, follow the
        [Docker Compose install directions](https://docs.docker.com/compose/install/).
    2.  Add your user to the `docker` group by using a terminal to run:
        `sudo usermod -aG docker $USER` Sign out and back in again so this
        setting takes effect.

**Working with Git?** Here are two tips to consider:

- If you are working with the same repository folder in a container and Windows,
  be sure to set up consistent line endings. See
  [tips and tricks](https://aka.ms/vscode-remote/containers/troubleshooting/crlf)
  to learn how.
- If you clone using a Git credential manager, your container should already
  have access to your credentials! If you use SSH keys, you can also opt-in to
  sharing them. See
  [Sharing Git credentials with your container](https://aka.ms/vscode-remote/containers/git)
  for details.

## Getting started

**[Follow the step-by-step tutorial](http://aka.ms/vscode-remote/containers/tutorial)**
or if you are comfortable with Docker, follow these four steps:

1.  Follow the installation steps above.
2.  Clone `https://github.com/Microsoft/vscode-remote-try-node` locally.
3.  Start VS Code
4.  Run the **Remote-Containers: Open Folder in Container...** command and
    select the local folder.

Check out the
[repository README](https://github.com/Microsoft/vscode-remote-try-node) for
things to try. Next, learn how you can:

- [Use a container as your full-time environment](https://aka.ms/vscode-remote/containers/getting-started/open) -
  Open an existing folder in a container for use as your full-time development
  environment in few easy steps. Works with both container and non-container
  deployed projects.
- [Attach to a running container](https://aka.ms/vscode-remote/containers/getting-started/attach) -
  Attach to a running container for quick edits, debugging, and triaging.
- [Advanced: Use a remote Docker host](https://aka.ms/vscode-remote/containers/remote-host) -
  Once you know the basics, learn how to use a remote Docker host if needed.

## Available commands

Another way to learn what you can do with the extension is to browse the
commands it provides. Press `F1` to bring up the Command Palette and type in
`Remote-Containers` for a full list of commands.

![Command palette](https://microsoft.github.io/vscode-remote-release/images/remote-command-palette.png)

You can also click on the Remote "Quick Access" status bar item to get a list of
the most common commands.

![Quick actions status bar item](https://microsoft.github.io/vscode-remote-release/images/remote-dev-status-bar.png)

For more information, please see the
[extension documentation](https://aka.ms/vscode-remote/containers).
