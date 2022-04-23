require 'html/pipeline/filter'

class AddCssClassToTableFilter < HTML::Pipeline::Filter

  def call
    doc.search("table").each do |table|
      table['class'] = "table table-horizontal table-striped"
    end
    doc
  end

end
