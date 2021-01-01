# frozen_string_literal: true

source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

# Whitelisted plugins not included in runtime dependencies.
group :jekyll_plugins do
  gem "jekyll-octicons"
  gem "jekyll-redirect-from"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?

# kramdown v2 ships without the gfm parser by default.
gem "kramdown-parser-gfm"

gem 'yaml-lint', '~> 0.0.10'

# Fix for https://github.com/github/pages-gem/issues/399.
gem 'dotenv'
