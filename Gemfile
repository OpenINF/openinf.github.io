# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "4.3.0"

group :jekyll_plugins do
  gem "jekyll-redirect-from"
  gem "jekyll-relative-links"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "2.0.5"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "0.1.1", :install_if => Gem.win_platform?

gem 'yaml-lint', '0.0.10'

gem "webrick", "1.7.0"

# Fix for https://github.com/github/pages-gem/issues/399.
gem 'dotenv'
