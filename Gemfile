# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.2.1"

group :jekyll_plugins do
  gem 'jekyll-assets'
  gem 'jekyll-assets-autoprefixer'
  gem 'jekyll-sass-converter', github: 'jekyll/jekyll-sass-converter'
  gem 'sass-embedded'
  gem "jekyll-avatar"
  gem "jekyll-feed"
  gem "jekyll-html-pipeline"
  gem 'extended-markdown-filter'
  gem 'github-markdown'
  gem "jekyll-mentions"
  gem "jekyll-octicons"
  gem "jekyll-redirect-from"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jemoji"
end

# html-pipeline filter gem dependencies are not bundled; we must install
# each of the included filter's gem dependencies prior to use.
group :html_pipeline_filter_deps do
  gem 'commonmarker',       '~> 0.16'  # MarkdownFilter
  gem 'email_reply_parser', '~> 0.5'   # EmailReplyFilter
  gem 'gemoji',             '>= 2.0'   # EmojiFilter
  gem 'rinku',              '~> 2.0'   # AutolinkFilter
  gem 'sanitize',           '~> 6.0'   # SanitizationFilter
  gem 'rouge',              '~> 3.1'   # SyntaxHighlightFilter
  # EmailReplyFilter PlainTextInputFilter TableOfContentsFilter
  gem 'escape_utils',       '~> 1.0'
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

gem 'octicons'
