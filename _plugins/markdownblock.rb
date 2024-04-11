module Jekyll # :nodoc: all
  class MarkdownBlock < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      require "kramdown"
    end

    def render(context)
      content = super

      String.new(Kramdown::Document.new(content).to_html).to_s.chomp
    end
  end
end

Liquid::Template.register_tag("markdown", Jekyll::MarkdownBlock)
