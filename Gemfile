# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.2.1"

# Whitelisted plugins not included in runtime dependencies.
group :jekyll_plugins do
  gem "jekyll-avatar"
  gem "jekyll-feed"
  gem "jekyll-mentions"
  gem "jekyll-octicons"
  gem "jekyll-redirect-from"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jemoji"
end

# Windows & JRuby do not include zoneinfo files, so bundle the tzinfo-data
# gem and associated library.
platforms :jruby, :mswin, :mingw, :x64_mingw do
  gem "tzinfo", ENV["TZINFO_VERSION"] if ENV["TZINFO_VERSION"]
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?

# kramdown v2 ships without the gfm parser by default.
gem "kramdown-parser-gfm"

gem 'yaml-lint', '~> 0.0.10'

gem "webrick", "~> 1.7"
