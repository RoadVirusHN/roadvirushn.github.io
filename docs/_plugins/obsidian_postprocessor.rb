require 'liquid'
require_relative './obsidian/postprocesses/postprocess_toc'
require_relative './obsidian/postprocesses/postprocess_callout'

module Jekyll
  module ObsidianPostprocessor

    include PostprocessToc
    include PostprocessCallout
    def postprocess_obsidian(str)
      str = convert_noneng_custom_id(str)
      str = convert_toc(str)
      convert_callout(str)
    end

  end
end

Liquid::Template.register_filter(Jekyll::ObsidianPostprocessor)
