# # Modify code from https://github.com/joshdavenport/jekyll-regex-replace (MIT license)
# require 'liquid'
# require_relative './obsidian/postprocesses/WikiLinkConverter'
# require_relative './obsidian/postprocesses/ImageLinkConverter'
# require_relative './obsidian/postprocesses/TOCConverter'

# module Jekyll
#   module ObosidianPostprocessor  
#     include ImageLinkConverter 
#     def convert_imagelink(str, static_dir)
#       return imagelink_obsidian_to_kramdown(str, static_dir)
#     end

#     include WikiLinkConverter
#     def convert_wikilink(str, posts, page)
#       return wikilink_obsidian_to_kramdown(str, posts, page)
#       # return wikilink_md_to_kramdown(str, posts, page)
#     end

#     include TOCConverter
#     def convert_toc(str)
#       return toc_obsidian_to_kramdown(str)
#     end

#   end
# end

# Liquid::Template.register_filter(Jekyll::ObosidianPostprocessor)
