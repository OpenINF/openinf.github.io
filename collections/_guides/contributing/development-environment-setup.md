---
title: Development Environment Setup
draft: true
---

{{#intro}}

If you've got [Visual Studio Code](https://code.visualstudio.com/) with the 
[Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) 
installed, then simply opening this repository in Visual Studio Code and 
following the prompts to "Re-open In A Development Container" will get you set 
up and ready to go in a fresh environment with all the requirements installed.

{{/intro}}

{{#warning}}

This guide is currently under the assumption that you are running on the latest
version of 
[Windows Server 2022 Standard](https://cloudblogs.microsoft.com/windowsserver/2021/09/01/windows-server-2022-now-generally-available-delivers-innovation-in-security-hybrid-and-containers/).  
Instructions supporting Linux and macOS are coming soon.

{{/warning}}

Make sure to have all your tools installed and configured!

## Git

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

   ```command-line powershell
   ssh-add $HOME/.ssh/id_ed25519
   ```

   Source:
   <https://code.visualstudio.com/docs/remote/containers#_using-ssh-keys>

2. [Add your SSH key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

### Sign commits

1. [Download Gpg4win](https://gpg4win.org/download.html)
1. [Generate a GPG key](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-gpg-key#generating-a-gpg-key)
1. [Add GPG key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account)

### Git repository setup

1. Create your own fork of the 
   [OpenINF website repository](https://github.com/openinf/openinf.github.io) by
   clicking "Fork" in the Web UI. During local development, this will be 
   referred to by `git` as `origin`.
1. Download your fork to a local repository.

   ```command-line bash
   git clone git@github.com:<your username>/openinf.github.io.git
   ```

2. Add an alias called `upstream` to refer to the main 
   `openinf/openinf.github.io` repository. Go to the root directory of the 
   newly created local repository directory and run the following.

   ```command-line bash
   git remote add upstream git@github.com:openinf/openinf.github.io.git
   ```

3. Fetch data from the `upstream` remote:

   ```command-line bash
   git fetch upstream live
   ```

4. Set up your local `live` branch to track `upstream/live` instead of 
   `origin/live` (which will become outdated).

   ```command-line bash
   git branch -u upstream/live live
   ```

## Development Container

Whether you deploy to containers or not, containers make a great development 
environment because you can:

- Develop with a consistent, easily reproducible toolchain on the same operating
  system you deploy to.
- Quickly swap between different, separate development environments and safely 
  make updates without worrying about impacting your local machine.
- Make it easy for new team members / contributors to get up and running in a 
  consistent development environment.
- Try out new technologies or clone a copy of a code base without impacting 
  your local setup.

The [Visual Studio Code **Remote - Containers** extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) lets you use a 
[Docker container](https://docker.com) as a full-featured development 
environment.

### Docker

1. [Download and install the latest version of Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Once installed, click on the little gear in the upper-right corner of the app
   to go to the settings menu (General Tab) and be sure that the "Use the WSL 2
   based engine" option box isn't ticked. If it's already ticked off, be sure to
   un-tick it before proceeding.
1. Next, go to **Resources > File Sharing** ("Resources" tab, "File Sharing"
   sub-tab) and update the list to include any locations your source code is
   kept to enable them to be bind-mounted into Docker containers and click the
   "Apply & Restart" button.

{{#tip}}

The entire Local Disk (e.g., `C:\` volume) is a valid target directory.

{{/tip}}

### Visual Studio Code

-[ ] Visual Studio Code &mdash; [\[ Install \]](https://code.visualstudio.com/sha/download?build=stable&os=win32-x64)

{{#warning}}

Since our host OS is Windows Server 2022, which uses the  "Administrator" 
account by default, we will need to use the "Windows _System_
Installer" (most likely 
[the 64-bit installer](https://code.visualstudio.com/#alt-downloads)), which
installs VS Code for _all_ users as opposed to the "Windows _User_ Installer",
which is geared towards a single personalized Windows user profile (excluding
"Administrator"); while the Windows ZIP archive, which is geared towards 
portable installations of VS Code, lacks support for auto update and isn't
recognized by Docker Dev Environments.

{{/warning}}

### Visual Studio Code Remote - Containers Extension

The extension starts (or attaches to) a development container running a well 
defined tool and runtime stack. Workspace files can be mounted into the 
container from the local file system, or copied or cloned into it once the 
container is running. Extensions are installed and run inside the container 
where they have full access to the tools, platform, and file system. 

You then work with VS Code as if everything were running locally on your 
machine, except now they are separated inside a container.

#### Installation

-[ ] Visual Studio Code Remote Containers Extension &mdash; 
[\[ Install \]](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

{{#note}}

Although the 
[local system requirements](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers#system-requirements) 
for this extension state that _WSL 2 back-end_ is a hard requirement, we will 
not be enabling WSL 2 since 
[WSL 2 isn't yet supported on Windows Server](https://github.com/microsoft/WSL/issues/8277#issuecomment-1103204094), 
which is one of the system platforms that we currently offer Tier 1 support for 
(currently Windows Server 2019 and Windows Server 2022). Fortunately, WSL 2 is 
not strictly required as usage of WSL 1 seems to be suitable for our purposes in
this case.

{{/note}}
