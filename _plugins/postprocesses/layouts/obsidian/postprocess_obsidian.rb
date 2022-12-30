require 'liquid'
require 'nokogiri'
require_relative './modules/postprocess_toc'
require_relative './modules/postprocess_callout'
require_relative './modules/postprocess_wikilink'

module Jekyll
  module PostprocessObsidian

    include PostprocessToc
    include PostprocessCallout
    include PostprocessWikilink
    def postprocess_obsidian(str)
      html = Nokogiri.HTML5(str)
      html = convert_noneng_custom_id(html)
      html = convert_toc(html)
      html = html.to_html
      html = convert_callout(html)
      html = convert_wikilink(html)
      html
    end

  end
end

Liquid::Template.register_filter(Jekyll::PostprocessObsidian)
