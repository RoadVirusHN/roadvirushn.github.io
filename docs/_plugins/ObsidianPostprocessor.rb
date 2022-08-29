require 'liquid'
require_relative './obsidian/postprocesses/PostprocessTOC'

module Jekyll
  module ObsidianPostprocessor 
    include PostprocessTOC
    def convert_noneng_custom_id(str)
       return str.gsub(NO_ID_HEADINGS_REGEX)\
       { |matched|
            custom_id = text_to_id_format($title)
            matched = "<h#{$headings} id='#{custom_id}'>#{$title}</h#{$headings}>" 
        }
    end
    
    def convert_toc(str)
        return str
    end

  end
end

Liquid::Template.register_filter(Jekyll::ObsidianPostprocessor)
