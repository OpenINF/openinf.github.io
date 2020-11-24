#!/bin/sh

# If there's a Gemfile, then run `bundle install`.
# It's assumed that the Gemfile will install Jekyll too.
if [ -f Gemfile ]; then
    bundle config set --local path 'vendor/bundle' && bundle install
else
    # If there's no Gemfile, install Jekyll.
    bundle config set --local path 'vendor/bundle' && sudo gem install jekyll
fi

# If there's a .nvmrc, then run `nvm use`.
if [ -f .nvmrc ]; then
    nvm use
fi

# If there's a package.json, then run `npm install`.
if [ -f package.json ]; then
    npm install
fi
