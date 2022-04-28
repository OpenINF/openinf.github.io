#!/usr/bin/fish

# If there's a .ruby-version, then run `rbenv install`.
if test -e .ruby-version
    rbenv install
end

echo 'set -Ux fish_user_paths ~/.rbenv/shims/ $fish_user_paths' >>~/.config/fish/config.fish

source ~/.config/fish/config.fish

rbenv rehash

# If there's a Gemfile, then install Bundler and run `bundle install`.
if test -e Gemfile
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

# If there's a `.node-version`, then run `nvm install`.
if test -e .node-version
    # Install the specified version of Node.js.
    nvm install
    npm install -g npm # ensure latest version of npm is installed
    npm audit fix # address any vulns in package manager CLI app itself
end

# If there's a package.json, then run `npm install`.
if test package.json
    npm install
end

echo 'rbenv rehash && nvm use' >>~/.config/fish/config.fish

# Configure Git to use `gpg2`.
echo 'git config --global gpg.program gpg2' >>~/.config/fish/config.fish
echo no-autostart >~/.gnupg/gpg.conf

echo 'set -gx GPG_TTY (tty)' >>~/.config/fish/config.fish

echo "to enable commit signing, run"
echo "git config --global commit.gpgsign true"
