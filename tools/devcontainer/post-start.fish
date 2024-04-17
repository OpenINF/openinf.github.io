#!/usr/bin/env fish
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------

# *********************
#    Requirements
# *********************

set -gx SHELL fish
set -gx COREPACK_ENABLE_DOWNLOAD_PROMPT 0

# *********************
#    Fisher Plugins
# *********************

fisher install OpenINF/openinf-nvm.fish
fisher install OpenINF/openinf-bass

########################################################################

# If there's a `.nvmrc`, then run `nvm install`.
if test -e .nvmrc
    # Install the specified version of Node.js.
    nvm install
end

# If there's a package.json, then run `pnpm install`.
if test -e package.json
    corepack enable
    corepack prepare pnpm@latest --activate
    bass pnpm setup >> /dev/null
    source $HOME/.config/fish/config.fish
    pnpm add -g pnpm
    pnpm install
end

echo 'rbenv rehash && nvm use' >> $HOME/.config/fish/config.fish

# Installs the dprint utility, and adds it to the user's $PATH.
# It makes the tool available to the user when one opens a new terminal window.

# Install dprint
bass curl -fsSL https://dprint.dev/install.sh | sh >> /dev/null
set -gx DPRINT_INSTALL $HOME/.dprint
echo 'set -gx DPRINT_INSTALL $HOME/.dprint' >> $HOME/.config/fish/config.fish
fish_add_path -g $DPRINT_INSTALL
echo 'fish_add_path -g $DPRINT_INSTALL' >> $HOME/.config/fish/config.fish

set -gx DPRINT_HOME $DPRINT_INSTALL/bin
echo 'set -gx DPRINT_HOME $DPRINT_INSTALL/bin' >> $HOME/.config/fish/config.fish
fish_add_path -g $DPRINT_HOME
echo 'fish_add_path -g $DPRINT_HOME' >> $HOME/.config/fish/config.fish

# Add dir in which executables of local Node deps are linked to the user's $PATH.
echo 'fish_add_path -g (pnpm bin)' >> $HOME/.config/fish/config.fish

########################################################################

# Populate user's $HOME/.gnupg directory with empty keyring files
# it will create the $HOME/.gnupg directory if it does not already exist (expected)
gpg --list-keys

# If there's a .gnupg directory, then perform the following setup tasks.
if test -e $HOME/.gnupg/
    # Configure Git to use `gpg2`.
    echo 'git config --global gpg.program gpg2' >> $HOME/.config/fish/config.fish

    echo 'set -gx GPG_TTY (tty)' >> $HOME/.config/fish/config.fish

    # To fix the " gpg: WARNING: unsafe permissions on homedir
    # '/home/path/to/user/.gnupg' " error, make sure that the .gnupg directory and
    # its contents is accessibile by your user.
    # chown -R (whoami) $HOME/.gnupg/

    # Also correct the permissions and access rights on the directory.
    # chmod 600 $HOME/.gnupg/*
    # chmod 700 $HOME/.gnupg

    echo no-autostart >> $HOME/.gnupg/gpg.conf

    # Remove an existing Unix-domain socket file for remote port forwarding before
    # creating a new one when gpgtunnel connection is made.
    # rm $HOME/.gnupg/S.gpg-agent

    printf '\n%s\n\n\t%s\n\n' 'Enable commit signing:' 'git config --global commit.gpgsign true'
end
