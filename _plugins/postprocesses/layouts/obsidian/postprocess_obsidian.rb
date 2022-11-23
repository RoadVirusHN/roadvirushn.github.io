require 'liquid'
require_relative './modules/postprocess_toc'
require_relative './modules/postprocess_callout'
require_relative './modules/postprocess_wikilink'

module Jekyll
  module PostprocessObsidian

    include PostprocessToc
    include PostprocessCallout
    include PostprocessWikilink
    def postprocess_obsidian(str)
      str = convert_noneng_custom_id(str)
      str = convert_toc(str)
      str = convert_callout(str)
      str = convert_wikilink(str)
      str
    end

  end
end

Liquid::Template.register_filter(Jekyll::PostprocessObsidian)
