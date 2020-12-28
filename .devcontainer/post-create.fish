#!/usr/bin/fish

# If there's a .ruby-version, then run `rbenv install`.
if test -e .ruby-version
    rbenv install
end

# Install Bundler and set local gem install path.
sudo gem install bundler && bundle config set --local path 'vendor/bundle'

# If there's a Gemfile, then run `bundle install`.
# It's assumed that the Gemfile will install Jekyll too.
if test -e Gemfile
    bundle install
else
    # If there's no Gemfile, install Jekyll.
    sudo gem install jekyll
end

# If there's a .node-version, then run `nvm install`.
if test -e .node-version
    nvm install
end

# If there's a package.json, then run `npm install`.
if test package.json
    npm install
end

# Once the shell launches, run `rbenv rehash` and `nvm use`.
