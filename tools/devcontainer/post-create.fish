#!/usr/bin/fish

# Set the SHELL environment variable to our active shell.

set -gx SHELL fish
echo 'set -gx SHELL fish' >> ~/.config/fish/config.fish

# install rem - remember command
# sudo wget https://github.com/mborho/rem/releases/download/v0.17.0/rem_0.17.0_linux_amd64 \
#     -O /usr/local/bin/rem && sudo chmod +x /usr/local/bin/rem

# # initialize rem cmd
# rem here ls -la

# rem ***************
# rem   Subroutines
# rem ***************

# function

# ------------------------------------------------------------------------------

# If there's a `.ruby-version`, then run `rbenv install`.
if test -e .ruby-version
    # Install the specified versions/Ruby runtime!
    rbenv install --verbose
end

echo 'fish_add_path -g ~/.rbenv/shims/' >> ~/.config/fish/config.fish

source ~/.config/fish/config.fish

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
