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

# If there's a `.ruby-version`, then run `rbenv install`.
if test -e .ruby-version
    # Upgrade rbenv ruby-build plugin for latest build definitions.
    git -C $HOME/.rbenv/plugins/ruby-build pull
    # Install the specified versions/Ruby runtime!
    rbenv install --verbose
end

echo 'fish_add_path -g $HOME/.rbenv/shims/' >> $HOME/.config/fish/config.fish

source $HOME/.config/fish/config.fish

rbenv rehash

# If there's a Gemfile, then install Bundler and run `bundle install`.
if test -e Gemfile
    # Latest version already installed?
    gem update --system -N --no-document
    # Install Bundler.
    gem install bundler
    # Configure Bundler setting local gem install path to avoid permission errors.
    bundle config set --local path vendor/bundle
    # Install the dependencies specified in the Gemfile.
    bundle install
    # Ensure latest versions of Bundler's dependencies are installed.
    bundle update --bundler
else
    # If there's no Gemfile, install Jekyll.
    gem install jekyll
end
