#!/usr/bin/env fish
# ------------------------------------------------------------------------------
# Copyright (c) The OpenINF Authors & Friends. All rights reserved.
# License: MIT OR Apache-2.0 OR BlueOak-1.0.0
# ------------------------------------------------------------------------------

# Set the SHELL environment variable to our active shell.

set -gx SHELL fish
echo 'set -gx SHELL fish' >> $HOME/.config/fish/config.fish

# *********************
#      Subroutines
# *********************

# function

# ------------------------------------------------------------------------------

source $HOME/.config/fish/config.fish

