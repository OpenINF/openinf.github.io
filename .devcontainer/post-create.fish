#!/usr/bin/fish

# If there's a .ruby-version, then run `rbenv install`.
if test -e .ruby-version
    rbenv install
end

rbenv rehash

echo 'set -Ux fish_user_paths ~/.rbenv/shims/ $fish_user_paths' >> ~/.config/fish/config.fish

source ~/.config/fish/config.fish

# Install Bundler.
gem install bundler

rbenv rehash

# Configure Bundler setting local gem install path to avoid permission errors.
bundle config set --local path 'vendor/bundle'

# If there's a Gemfile, then run `bundle install`.
# It's assumed that the Gemfile will install Jekyll too.
if test -e Gemfile
    bundle install
else
    # If there's no Gemfile, install Jekyll.
    gem install jekyll
end

# If there's a .node-version, then run `nvm install`.
if test -e .node-version
    nvm install
    npm install -g npm # ensure latest version of npm is installed
    npm audit fix # address any vulns package manager CLI app itself
end

# If there's a package.json, then run `npm install`.
if test package.json
    npm install
end

echo 'rbenv rehash && nvm use' >> ~/.config/fish/config.fish
