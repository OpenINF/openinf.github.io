module Jekyll
  class MarkdownBlock < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      require "kramdown"
    end
    def render(context)
      content = super
      "#{Kramdown::Document.new(content).to_html}"
    end
  end
end

Liquid::Template.register_tag('markdown', Jekyll::MarkdownBlock)
