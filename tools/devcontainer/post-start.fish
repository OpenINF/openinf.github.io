#!/usr/bin/fish

echo 'Hey diddle didle!'

# rem *****************
# rem   Fisher Plugins
# rem *****************

# curl -sL https://raw.githubusercontent.com/OpenINF/openinf-fisher/HEAD/functions/fisher.fish | source \
#     && fisher install OpenINF/openinf-fisher

fisher install OpenINF/openinf-nvm.fish          \
    && fisher install OpenINF/openinf-bass       \
    && fisher install OpenINF/openinf-autoenvstack

######################################################################## 100.0%

# If there's a `.nvmrc`, then run `nvm install`.
if test -e .nvmrc
    # Install the specified version of Node.js.
    nvm install
end

# If there's a package.json, then run `pnpm install`.
if test -e package.json
    corepack enable
    corepack prepare pnpm@latest --activate
    bass pnpm setup # >> /dev/null
    source ~/.config/fish/config.fish
    pnpm add -g pnpm
    pnpm install
end

echo 'rbenv rehash && nvm use' >> ~/.config/fish/config.fish

# Installs the moon and dprint tools, and it adds the tools to the user's $PATH.
# It makes the tools available to the user when they open a new terminal window.

# Install moon
bass curl -fsSL https://moonrepo.dev/install/moon.sh | bash # >> /dev/null
set -gx MOON_HOME $HOME/.moon/bin
echo 'set -gx MOON_HOME $HOME/.moon/bin' >> ~/.config/fish/config.fish
fish_add_path -g $MOON_HOME
echo 'fish_add_path -g $MOON_HOME' >> $HOME/.config/fish/config.fish

# Install dprint
bass curl -fsSL https://dprint.dev/install.sh | sh # >> /dev/null
set -gx DPRINT_INSTALL $HOME/.dprint
echo 'set -gx DPRINT_INSTALL $HOME/.dprint' >> ~/.config/fish/config.fish
fish_add_path -g $DPRINT_INSTALL
echo 'fish_add_path -g $DPRINT_INSTALL' >> ~/.config/fish/config.fish

set -gx DPRINT_HOME $DPRINT_INSTALL/bin
echo 'set -gx DPRINT_HOME $DPRINT_INSTALL/bin' >> ~/.config/fish/config.fish
fish_add_path -g $DPRINT_HOME
echo 'fish_add_path -g $DPRINT_HOME' >> $HOME/.config/fish/config.fish

# this will populate your ~/.gnupg directory with empty keyring files
# it will create the ~/.gnupg directory if it does not already exist (expected)
gpg --list-keys

# If there's a .gnupg directory, then perform the following setup tasks.
if test -e ~/.gnupg/
    # Configure Git to use `gpg2`.
    echo 'git config --global gpg.program gpg2' >> ~/.config/fish/config.fish

    echo 'set -gx GPG_TTY (tty)' >> ~/.config/fish/config.fish

    # To fix the " gpg: WARNING: unsafe permissions on homedir
    # '/home/path/to/user/.gnupg' " error, make sure that the .gnupg directory and
    # its contents is accessibile by your user.
    # chown -R (whoami) ~/.gnupg/

    # Also correct the permissions and access rights on the directory.
    # chmod 600 ~/.gnupg/*
    # chmod 700 ~/.gnupg

    echo no-autostart >> ~/.gnupg/gpg.conf

    # Remove an existing Unix-domain socket file for remote port forwarding before
    # creating a new one when gpgtunnel connection is made.
    # rm ~/.gnupg/S.gpg-agent

    printf '\n%s\n\n\t%s\n\n' 'Enable commit signing:' 'git config --global commit.gpgsign true'
end
