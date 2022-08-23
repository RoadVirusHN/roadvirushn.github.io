# Modify code from https://github.com/joshdavenport/jekyll-regex-replace (MIT license)
require 'liquid'
require_relative './utils/WikiLinkConverter'
require_relative './utils/ImageLinkConverter'

module Jekyll
  module ObsidianConverter    
    include ImageLinkConverter 
    def convert_imagelink(str, static_dir)
      return imagelink_obsidian_to_kramdown(str, static_dir)
    end

    include WikiLinkConverter
    def convert_wikilink(str, posts, page)
      return wikilink_obsidian_to_kramdown(str, posts, page)
      # return wikilink_md_to_kramdown(str, posts, page)
    end


  end
end

Liquid::Template.register_filter(Jekyll::ObsidianConverter)
