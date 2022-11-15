require 'liquid'
require_relative './postprocesses/postprocess_toc'
require_relative './postprocesses/postprocess_callout'
require_relative './postprocesses/postprocess_wikilink'

module Jekyll
  module PostprocessObsidian

    include PostprocessToc
    include PostprocessCallout
    include PostprocessWikilink
    def postprocess_obsidian(str)
      str = convert_noneng_custom_id(str)
      str = convert_toc(str)
      str = convert_callout(str)
      convert_wikilink(str)
    end

  end
end

Liquid::Template.register_filter(Jekyll::PostprocessObsidian)
