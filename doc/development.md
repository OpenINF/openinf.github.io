# Development

## macOS Setup

Coming soonish.

## Windows Setup

### Development environment dependencies

1. [Download and install the latest version of Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. [Download and install the latest version of Git](https://git-scm.com/downloads)
1. [Download and install the latest version of VS Code](https://code.visualstudio.com/)

### Git setup

1. [Set username in Git](https://docs.github.com/en/free-pro-team@latest/github/using-git/setting-your-username-in-git)
1. [Set commit email address in Git](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address)

### [Connect to GitHub with SSH](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)

1. [Generate a new SSH key](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
1. [Auto-launch `ssh-agent` on Git for Windows](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/working-with-ssh-key-passphrases#auto-launching-ssh-agent-on-git-for-windows)
1. [Add your SSH key to the SSH agent](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent)

   Start a local Administrator PowerShell and run the following commands.

   ```
   # Make sure you're running as an Administrator
   Set-Service ssh-agent -StartupType Automatic
   Start-Service ssh-agent
   Get-Service ssh-agent
   ```

   Add local SSH keys to the agent by using the ssh-add command.

   ```
   ssh-add $HOME/.ssh/id_ed25519
   ```

   Source: https://code.visualstudio.com/docs/remote/containers#_using-ssh-keys

1. [Add your SSH key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

### Sign commits

1. [Download Gpg4win](https://gpg4win.org/download.html)
1. [Generate a GPG key](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-gpg-key#generating-a-gpg-key)
1. [Add GPG key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account)

### VS Code Setup

1. Install [Visual Studio Code Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

### Git Setup

1. Create your own fork of the [openinf website repository](https://github.com/openinf/openinf.github.io) by clicking "Fork" in the Web UI. During local development, this will be referred to by `git` as `origin`.
1. Download your fork to a local repository.

   ```shell
   git clone git@github.com:<your username>/openinf.github.io.git
   ```

1. Add an alias called `upstream` to refer to the main `openinf/openinf.github.io` repository. Go to the root directory of the newly created local repository directory and run the following.

   ```shell
   git remote add upstream git@github.com:openinf/openinf.github.io.git
   ```

1. Fetch data from the `upstream` remote:

   ```shell
   git fetch upstream live
   ```

1. Set up your local `live` branch to track `upstream/live` instead of `origin/live` (which will rapidly become
   outdated).

   ```shell
   git branch -u upstream/live live
   ```
