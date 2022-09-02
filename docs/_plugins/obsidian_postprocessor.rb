require 'liquid'
require_relative './obsidian/postprocesses/postprocess_toc'

module Jekyll
  module ObsidianPostprocessor
    include PostprocessToc
    def convert_noneng_custom_id(str)
        return str.gsub(NO_ID_HEADINGS_REGEX){ |matched|
          headings = $1
          innerText = $2
          custom_id = text_to_id_format(innerText)
          "<h#{headings} id='#{custom_id}'>#{innerText}</h#{headings}>"
        }
    end
    
    def postprocess_toc(str)
      return convert_toc(str)
    end

  end
end

Liquid::Template.register_filter(Jekyll::ObsidianPostprocessor)
