require 'octicons'

module Filters
  module PostFilter
    icon = Octicons::Octicon.new("star")
    TIP_HTML = '<div class="alert tip mt-3" role="alert">' + icon.to_svg
    icon = Octicons::Octicon.new("info")
    NOTE_HTML = '<div class="alert note mt-3" role="alert">' + icon.to_svg
    icon = Octicons::Octicon.new("alert")
    WARNING_HTML = '<div class="alert warning mt-3" role="alert">' + icon.to_svg
    icon = Octicons::Octicon.new("stop")
    DANGER_HTML = '<div class="alert danger mt-3" role="alert">' + icon.to_svg

    def format_admonitions!(html)
      html.gsub!(/<p>#{@front_wrap}#tip#{@end_wrap}<\/p>/,     TIP_HTML)
      html.gsub!(/<p>#{@front_wrap}#note#{@end_wrap}<\/p>/,    NOTE_HTML)
      html.gsub!(/<p>#{@front_wrap}#warning#{@end_wrap}<\/p>/, WARNING_HTML)
      html.gsub!(/<p>#{@front_wrap}#danger#{@end_wrap}<\/p>/,  DANGER_HTML)
      html.gsub!(/<p>#{@front_wrap}\/(tip|note|warning|danger)#{@end_wrap}<\/p>/, Filters::CLOSE_DIV)
    end
  end
end
